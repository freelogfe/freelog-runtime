import path from 'node:path'
import { readFile, mkdir, writeFile, lstat, unlink } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { createMarkdownRenderer } from 'vitepress'
import { project, site, filesIn, slash, digest, rewriteMarkdownLinks } from './lib.mjs'

export function cliPage(relative) {
  return relative.replace(/(^|\/)README\.md$/, '$1index.md')
}

export function normalizeCliAnchor(anchor, candidates = []) {
  if (candidates.includes(anchor)) return anchor
  const signature = (text) => decodeURIComponent(text).normalize('NFKC').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase()
  const matches = candidates.filter((candidate) => signature(candidate) === signature(anchor))
  if (matches.length > 1) throw new Error(`CLI 链接锚点存在歧义：${anchor}`)
  return matches[0] || anchor
}

function escapedAt(text, index) {
  let backslashes = 0
  while (index > 0 && text[--index] === '\\') backslashes += 1
  return backslashes % 2 === 1
}

function escapeTableCodePipes(line) {
  const runs = [...line.matchAll(/`+/g)]
  let result = '', cursor = 0
  for (let index = 0; index < runs.length; index += 1) {
    const opening = runs[index]
    // Outside code a backslash escapes the first tick; inside code it does not.
    const width = opening[0].length - (escapedAt(line, opening.index) ? 1 : 0)
    if (!width) continue
    let closing = index + 1
    while (closing < runs.length && runs[closing][0].length !== width) closing += 1
    if (closing === runs.length) continue
    const start = opening.index + opening[0].length
    const end = runs[closing].index
    const code = line.slice(start, end)
    result += line.slice(cursor, start) + code.replace(/\|/g, (pipe, offset) => escapedAt(code, offset) ? pipe : '\\|')
    cursor = end
    index = closing
  }
  return result + line.slice(cursor)
}

export function transformCli(body, relative, linkAnchors = new Map(), renderer) {
  // Block token maps exclude fenced/indented examples and prose with table-like pipes.
  const tableRows = new Set(renderer?.parse(body, {}).filter((token) => token.type === 'tr_open' && token.map).map((token) => token.map[0]))
  const formatted = body.split('\n').map((line, index) => tableRows.has(index) ? escapeTableCodePipes(line) : line).join('\n')
  let result = rewriteMarkdownLinks(formatted, (target) => {
    if (/^(?:[a-z]+:|#|\/)/i.test(target)) return target
    const [file, anchor] = target.split('#')
    const sourceTarget = path.posix.normalize(path.posix.join(path.posix.dirname(relative), file))
    const destination = file.replace(/(^|\/)README\.md$/, '$1index.md')
    return destination + (anchor ? '#' + normalizeCliAnchor(anchor, linkAnchors.get(sourceTarget)) : '')
  })
  const note = '\n::: info CLI 同步文档\n本页自动同步自 CLI 仓库使用手册。先核对已安装版本与本页适用范围；Node.js 22.14+ 是 CLI 自身要求，不是运行时对子应用的要求。来源、发布状态及已知限制见[版本说明](/about)。\n:::\n'
  const heading = result.match(/^# .+$/m)
  return heading ? result.replace(heading[0], heading[0] + '\n' + note) : note + result
}

export async function syncCli({ cliRoot, target = path.join(site, 'cli'), lockFile = path.join(project, 'source-lock.json') }) {
  const root = path.resolve(cliRoot)
  const source = path.join(root, 'docs', '使用手册')
  // Validate the complete input before changing any generated page.
  const inputs = (await filesIn(source)).filter((f) => f.endsWith('.md'))
  if (!inputs.some((f) => path.relative(source, f) === 'README.md')) throw new Error('CLI 手册缺少 README.md')
  const pkg = JSON.parse(await readFile(path.join(root, 'packages/cli/package.json'), 'utf8'))
  let revision, dirty
  try {
    revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
    dirty = execFileSync('git', ['status', '--porcelain', '--', 'docs/使用手册', 'packages/cli/package.json'], { cwd: root, encoding: 'utf8' }).trim().length > 0
  } catch { throw new Error('CLI 来源必须是可核对的 Git 工作树') }
  const renderer = await createMarkdownRenderer(source)
  const originals = await Promise.all(inputs.map(async (file) => ({
    relative: slash(path.relative(source, file)), raw: await readFile(file, 'utf8')
  })))
  const linkAnchors = new Map(originals.map(({ relative, raw }) => [relative,
    [...renderer.render(raw).matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
  ]))
  const pages = originals.map(({ relative, raw }) => {
    const content = transformCli(raw.replaceAll('\r\n', '\n'), relative, linkAnchors, renderer)
    return { source: relative, target: cliPage(relative), raw, content }
  })
  await mkdir(target, { recursive: true })
  if ((await lstat(target)).isSymbolicLink()) throw new Error('同步目标不能是符号链接')
  const expected = new Set(pages.map((entry) => entry.target))
  for (const file of await filesIn(target)) {
    const relative = slash(path.relative(target, file))
    if (!expected.has(relative)) {
      // Generated area: refuse unknown formats rather than removing user files.
      if (!file.endsWith('.md')) throw new Error(`生成目录存在未知文件：${relative}`)
      await unlink(file)
    }
  }
  for (const page of pages) {
    const file = path.join(target, page.target)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, page.content)
  }
  const record = {
    schemaVersion: 1, cliPackageVersion: pkg.version, revision, dirty,
    channel: 'development',
    transforms: ['README→index links and renderer-matched anchors', 'source and Node scope notice', 'escape unescaped pipes inside table inline code'],
    files: pages.map(({ source, target, raw, content }) => ({ source, target, sourceSha256: digest(raw), generatedSha256: digest(content) }))
  }
  await writeFile(lockFile, JSON.stringify(record, null, 2) + '\n')
  return record
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = process.env.FREELOG_CLI_ROOT || path.resolve(project, '../../freelog-runtime-cli')
  const record = await syncCli({ cliRoot: root })
  console.log(`CLI 文档已同步：${record.files.length} 页，版本 ${record.cliPackageVersion}，开发分支${record.dirty ? '（含未提交内容）' : ''}`)
}
