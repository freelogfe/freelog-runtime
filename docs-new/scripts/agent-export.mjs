import path from 'node:path'
import { mkdir, writeFile, readFile, copyFile, unlink, lstat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createMarkdownRenderer } from 'vitepress'
import { agentReading } from '../site/.vitepress/navigation.mjs'
import { site, project, filesIn, slash, withoutFrontmatter, rewriteMarkdownLinks, readJson, digest } from './lib.mjs'

export function textRoute(relative) { return `/markdown/${relative}` }

export function markdownTarget(target, relative, base = '/') {
  const link = (value) => base + value.replace(/^\//, '')
  if (/^[a-z]+:|^#/i.test(target)) return target
  const [pathname, anchor] = target.split('#')
  const resolved = pathname.startsWith('/') ? pathname.slice(1) : path.posix.normalize(path.posix.join(path.posix.dirname(relative), pathname))
  if (path.posix.extname(resolved) && !resolved.endsWith('.md') && !resolved.endsWith('.html')) return link('/' + resolved) + (anchor ? '#' + anchor : '')
  const mdPath = resolved.endsWith('/') || !resolved ? resolved + 'index.md' : resolved.endsWith('.md') ? resolved : resolved.replace(/\.html$/, '') + '.md'
  return link(textRoute(mdPath)) + (anchor ? '#' + anchor : '')
}

export async function exportAgent({ sourceRoot = site, publicRoot = path.join(site, 'public'), lockFile = path.join(project, 'source-lock.json'), base = process.env.DOCS_BASE || '/' } = {}) {
  const files = (await filesIn(sourceRoot)).filter((f) => f.endsWith('.md'))
  const output = path.join(publicRoot, 'markdown')
  await mkdir(output, { recursive: true })
  if ((await lstat(output)).isSymbolicLink()) throw new Error('Markdown 导出目录不能是符号链接')
  const expected = new Set(files.map((f) => path.relative(sourceRoot, f)))
  for (const old of await filesIn(output)) {
    if (old.endsWith('.md') && !expected.has(path.relative(output, old))) await unlink(old)
  }
  const link = (value) => base + value.replace(/^\//, '')
  const entries = []
  const markdown = await createMarkdownRenderer(sourceRoot)
  for (const file of files) {
    const relative = slash(path.relative(sourceRoot, file))
    const source = await readFile(file, 'utf8')
    let body = withoutFrontmatter(source)
    const frontmatter = source.slice(0, source.length - body.length)
    const indexable = !/^search: false\s*$/m.test(frontmatter)
    if (relative === 'index.md') body = '# Freelog 平台使用与开发文档\n\n' + body
    const tokens = markdown.parse(body, {})
    const heading = tokens.findIndex((token) => token.type === 'heading_open' && token.tag === 'h1' && token.level === 0)
    const title = heading < 0 ? relative : tokens[heading + 1]?.content || relative
    body = rewriteMarkdownLinks(body, (target) => markdownTarget(target, relative, base))
    const destination = path.join(publicRoot, 'markdown', relative)
    await mkdir(path.dirname(destination), { recursive: true })
    await writeFile(destination, body)
    entries.push({ relative, title, body, sha256: digest(body), indexable })
  }
  const indexed = entries.filter((entry) => entry.indexable)
  const available = new Set(indexed.map((entry) => entry.relative))
  const index = ['# Freelog 平台使用与开发文档', '', '> dev / 测试共用文档。CLI 版本和提交见 source-lock.json。', '', '## 按任务阅读', '',
    ...agentReading.filter(({ page }) => available.has(page)).map(({ text, page }) => `- [${text}](${link(textRoute(page))})`),
    '', '## 全部页面', '',
    ...indexed.map((e) => `- [${e.title}](${link(textRoute(e.relative))})`), '', `完整文本：${link('/llms-full.txt')}`, ''].join('\n')
  await writeFile(path.join(publicRoot, 'llms.txt'), index)
  await writeFile(path.join(publicRoot, 'llms-full.txt'), index + '\n\n' + indexed.map((e) => `---\n来源：${link(textRoute(e.relative))}\n\n${e.body}`).join('\n\n'))
  const source = await readJson(lockFile)
  await copyFile(lockFile, path.join(publicRoot, 'source-lock.json'))
  await writeFile(path.join(publicRoot, 'markdown-manifest.json'), JSON.stringify({ schemaVersion: 1, channel: source.channel, pages: entries.map(({ relative, sha256 }) => ({ path: link(textRoute(relative)), sha256 })) }, null, 2) + '\n')
  console.log(`Agent 文本已导出：${entries.length} 页`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await exportAgent()
