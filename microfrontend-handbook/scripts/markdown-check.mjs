import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

export function markdownFiles(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(folder, entry.name)
    return entry.isDirectory() ? markdownFiles(file) : entry.name.endsWith('.md') ? [file] : []
  }).sort()
}

function proseOf(content) {
  let fence
  let diagrams = 0
  const errors = []
  const prose = []
  for (const [index, line] of content.split(/\r?\n/).entries()) {
    const marker = line.match(/^\s*(`{3,}|~{3,})(.*)$/)
    if (marker) {
      if (!fence) {
        fence = { char: marker[1][0], length: marker[1].length, line: index + 1 }
        if (marker[2].trim() === 'mermaid') diagrams++
      } else if (marker[1][0] === fence.char && marker[1].length >= fence.length && !marker[2].trim()) fence = null
    } else if (!fence) prose.push(line)
  }
  if (fence) errors.push(`第 ${fence.line} 行代码围栏未闭合`)
  return { prose: prose.join('\n'), errors, diagrams }
}

function anchorsOf(content) {
  const { prose } = proseOf(content)
  const anchors = new Set([...prose.matchAll(/<a\s+[^>]*(?:id|name)=["']([^"']+)["'][^>]*>/g)].map(match => match[1]))
  for (const heading of prose.matchAll(/^#{1,6}\s+(.+)$/gm)) {
    const text = heading[1].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/<[^>]+>/g, '')
    const slug = text.toLowerCase().replace(/[^\p{L}\p{N}\p{M}_\-\s]/gu, '').trim().replace(/\s+/g, '-')
    let unique = slug
    for (let index = 1; anchors.has(unique); index++) unique = `${slug}-${index}`
    anchors.add(unique)
  }
  return anchors
}

export function inspectMarkdown(file, content = readFileSync(file, 'utf8')) {
  const { prose, errors, diagrams } = proseOf(content)
  let localLinks = 0
  if (content.includes('\uFFFD')) errors.push('存在 Unicode 替换字符')
  if (!/^# .+/m.test(prose)) errors.push('缺少标题')
  const folded = []
  for (const tag of prose.matchAll(/<(\/?)(details|summary)\b[^>]*>/g)) {
    if (!tag[1]) folded.push(tag[2])
    else if (folded.pop() !== tag[2]) errors.push('折叠答案标签嵌套错误')
  }
  if (folded.length) errors.push('折叠答案标签未闭合')
  for (const match of prose.matchAll(/\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
    const href = match[1].trim().replace(/^<|>$/g, '')
    if (/^[a-z][a-z\d+.-]*:/i.test(href)) continue
    localLinks++
    try {
      const [target, fragment] = href.split('#')
      const resolved = target ? path.resolve(path.dirname(file), decodeURIComponent(target)) : file
      if (!existsSync(resolved) || !statSync(resolved).isFile()) errors.push(`链接不存在 ${href}`)
      else if (fragment && resolved.endsWith('.md') && !anchorsOf(readFileSync(resolved, 'utf8')).has(decodeURIComponent(fragment))) errors.push(`锚点不存在 ${href}`)
    } catch (error) { errors.push(`链接无法检查 ${href}: ${error.message}`) }
  }
  return { errors, localLinks, diagrams }
}
