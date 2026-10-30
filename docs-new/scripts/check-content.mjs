import path from 'node:path'
import { readFile, access } from 'node:fs/promises'
import { site, project, filesIn, rewriteMarkdownLinks, readJson, digest } from './lib.mjs'
import { createMarkdownRenderer } from 'vitepress'

const errors = []
const files = (await filesIn(site)).filter((f) => f.endsWith('.md'))
const renderer = await createMarkdownRenderer(site, { headers: { level: [1, 2, 3, 4, 5, 6] } })
const anchors = new Map()
for (const file of files) {
  const html = renderer.render(await readFile(file, 'utf8'))
  anchors.set(file, new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])))
}
for (const file of files) {
  const body = await readFile(file, 'utf8')
  const relative = path.relative(site, file)
  if (/[A-Z]:[\\/]appinside/i.test(body)) errors.push(`${relative}：正文包含本机源码路径`)
  const targets = []
  rewriteMarkdownLinks(body, (target) => { targets.push(target); return target })
  for (const target of targets) {
    if (/^[a-z]+:/i.test(target)) continue
    const clean = target.split('#')[0].split('?')[0]
    if (!clean) {
      const anchor = decodeURIComponent(target.slice(1))
      if (anchor && !anchors.get(file).has(anchor)) errors.push(`${relative}：失效锚点 ${target}`)
      continue
    }
    let resolved
    try { resolved = decodeURI(clean) } catch { errors.push(`${relative}：非法链接 ${target}`); continue }
    const base = resolved.startsWith('/') ? path.join(site, resolved) : path.resolve(path.dirname(file), resolved)
    if (!base.startsWith(site + path.sep) && base !== site) { errors.push(`${relative}：站外文件路径 ${target}`); continue }
    const candidates = [base + '.md', path.join(base, 'index.md'), path.join(site, 'public', path.relative(site, base))]
    if (path.extname(base)) candidates.push(base)
    if (base.endsWith('.html')) candidates.push(base.slice(0, -5) + '.md')
    let exists = false
    let found
    for (const candidate of candidates) { try { await access(candidate); exists = true; found = candidate; break } catch {} }
    if (!exists) errors.push(`${relative}：失效链接 ${target}`)
    else if (target.includes('#') && found.endsWith('.md')) {
      const anchor = decodeURIComponent(target.slice(target.indexOf('#') + 1))
      if (anchor && !anchors.get(found)?.has(anchor)) errors.push(`${relative}：失效锚点 ${target}`)
    }
  }
}
const lock = await readJson(path.join(project, 'source-lock.json'))
for (const page of lock.files) {
  const body = await readFile(path.join(site, 'cli', page.target))
  if (digest(body) !== page.generatedSha256) errors.push(`CLI 生成页被手动改写：${page.target}`)
}
if (errors.length) throw new Error(errors.join('\n'))
console.log(`内容检查通过：${files.length} 页，站内路径、资源、锚点与 CLI 摘要有效。`)
