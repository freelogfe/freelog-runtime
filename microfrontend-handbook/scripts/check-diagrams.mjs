import { createRequire } from 'node:module'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { markdownFiles } from './markdown-check.mjs'

// 可选检查：复用仓库现有 Mermaid/jsdom，不安装依赖，不构建或改写 docs-new。
const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const root = path.resolve(folder, '..')
const require = createRequire(import.meta.url)
let dom
try {
  const pnpm = path.join(root, 'node_modules/.pnpm')
  const jsdomFolder = readdirSync(pnpm).find(name => name.startsWith('jsdom@'))
  if (!jsdomFolder) throw new Error('工作区未找到已安装的 jsdom')
  const { JSDOM } = require(path.join(pnpm, jsdomFolder, 'node_modules/jsdom'))
  dom = new JSDOM('<!doctype html><html><body></body></html>')
  globalThis.window = dom.window
  globalThis.document = dom.window.document
  globalThis.DOMParser = dom.window.DOMParser
  const { default: mermaid } = await import(pathToFileURL(path.join(root, 'docs-new/node_modules/mermaid/dist/mermaid.core.mjs')))
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' })
  let count = 0
  for (const file of markdownFiles(folder)) {
    const content = readFileSync(file, 'utf8')
    for (const match of content.matchAll(/```mermaid\r?\n([\s\S]*?)\r?\n```/g)) {
      try {
        await mermaid.parse(match[1])
        count++
      } catch (error) {
        throw new Error(`${path.relative(folder, file)}: ${error.message}`)
      }
    }
  }
  console.log(`通过：${count} 个 Mermaid 图表语法解析。未进行浏览器排版验证。`)
} catch (error) {
  console.error(`图表检查未通过: ${error.message}`)
  console.error('此可选脚本要求工作区已有 jsdom 和 docs-new/node_modules/mermaid；基础检查不依赖它们。')
  process.exitCode = 1
} finally {
  dom?.window.close()
}
