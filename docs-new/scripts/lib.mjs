import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

export const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const site = path.join(project, 'site')
export const slash = (value) => value.split(path.sep).join('/')
export const digest = (value) => createHash('sha256').update(value).digest('hex')
export const withoutFrontmatter = (value) => value.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')

export async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const result = []
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'public') continue
    const location = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`不允许符号链接：${slash(path.relative(project, location))}`)
    if (entry.isDirectory()) result.push(...await filesIn(location))
    else result.push(location)
  }
  return result
}

export function rewriteMarkdownLinks(body, transform) {
  // Only rewrite prose. Examples and commands remain byte-for-byte unchanged.
  let fenced = false
  let marker = ''
  return body.split('\n').map((line) => {
    const fence = line.match(/^\s*(`{3,}|~{3,})/)
    if (fence) {
      if (!fenced) { fenced = true; marker = fence[1][0] }
      else if (fence[1][0] === marker) fenced = false
      return line
    }
    if (fenced) return line
    return line.replace(/(!?\[[^\]]*\]\()([^\s)]+)([^)]*\))/g,
      (_, open, target, close) => `${open}${transform(target)}${close}`)
  }).join('\n')
}

export async function readJson(file) { return JSON.parse(await readFile(file, 'utf8')) }
