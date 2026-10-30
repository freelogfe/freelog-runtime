import path from 'node:path'
import { mkdir, writeFile, readFile, copyFile, unlink, lstat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
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
  for (const file of files) {
    const relative = slash(path.relative(sourceRoot, file))
    let body = withoutFrontmatter(await readFile(file, 'utf8'))
    if (relative === 'index.md') body = '# Freelog 平台使用与开发文档\n\n' + body
    body = rewriteMarkdownLinks(body, (target) => markdownTarget(target, relative, base))
    const destination = path.join(publicRoot, 'markdown', relative)
    await mkdir(path.dirname(destination), { recursive: true })
    await writeFile(destination, body)
    entries.push({ relative, title: body.match(/^#\s+(.+)$/m)?.[1] || relative, body, sha256: digest(body) })
  }
  const index = ['# Freelog 平台使用与开发文档', '', '> dev / 测试共用文档。CLI适用版本和来源见版本说明与source-lock.json；未来能力不当成现有接口。', '', '## 阅读顺序', '',
    `- [人与AI协作入口](${link('/markdown/start.md')})`,
    `- [Agent 使用说明](${link('/markdown/agents.md')})`,
    `- [平台对象](${link('/markdown/platform/overview.md')})`,
    `- [按平台任务操作](${link('/markdown/platform/tasks.md')})`,
    `- [当前支付与授权边界](${link('/markdown/platform/authorization.md')})`,
    `- [主子应用](${link('/markdown/runtime/architecture.md')})`,
    `- [CLI](${link('/markdown/cli/index.md')})`, '', '## 全部页面', '',
    ...entries.map((e) => `- [${e.title}](${link(textRoute(e.relative))})`), '', `完整文本：${link('/llms-full.txt')}`, ''].join('\n')
  await writeFile(path.join(publicRoot, 'llms.txt'), index)
  await writeFile(path.join(publicRoot, 'llms-full.txt'), index + '\n\n' + entries.map((e) => `---\n来源：${link(textRoute(e.relative))}\n\n${e.body}`).join('\n\n'))
  const source = await readJson(lockFile)
  await copyFile(lockFile, path.join(publicRoot, 'source-lock.json'))
  await writeFile(path.join(publicRoot, 'markdown-manifest.json'), JSON.stringify({ schemaVersion: 1, channel: source.channel, pages: entries.map(({ relative, sha256 }) => ({ path: link(textRoute(relative)), sha256 })) }, null, 2) + '\n')
  console.log(`Agent 文本已导出：${entries.length} 页`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await exportAgent()
