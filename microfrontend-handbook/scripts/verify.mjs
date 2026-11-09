import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { inspectMarkdown, markdownFiles } from './markdown-check.mjs'

// 文档结构与证据漂移检查，不执行运行时、网络请求或浏览器实验。
const handbook = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const files = markdownFiles(handbook)
const errors = []
let localLinks = 0
let diagrams = 0

for (const file of files) {
  const result = inspectMarkdown(file)
  errors.push(...result.errors.map(error => `${path.relative(handbook, file)}: ${error}`))
  localLinks += result.localLinks
  diagrams += result.diagrams
}

let sourceCount = 0
for (const name of ['sources.json', 'technical-sources.json']) {
  const lock = JSON.parse(readFileSync(path.join(handbook, name), 'utf8'))
  sourceCount += lock.files.length
  for (const source of lock.files) {
    const target = path.resolve(handbook, source.path)
    if (!existsSync(target)) {
      errors.push(`来源已缺失: ${source.path}`)
      continue
    }
    const actual = createHash('sha256').update(readFileSync(target)).digest('hex')
    if (actual !== source.sha256) errors.push(`来源已变化，需复核正文: ${source.path}`)
  }
}

// 第 00 章教学示例：直接提取正文代码执行，避免另写一份不同的示例。
try {
  const lesson = readFileSync(path.join(handbook, '00-学习路线与浏览器基础.md'), 'utf8')
  const block = [...lesson.matchAll(/```js\r?\n([\s\S]*?)\r?\n```/g)]
    .find(match => match[1].includes('const makeTeachingSandbox'))
  assert.ok(block, '教学沙箱示例必须存在')
  const lines = []
  new Function('console', block[1])({ log: (...args) => lines.push(args) })
  assert.deepEqual(lines, [[2, 1]])
} catch (error) {
  errors.push(`第 00 章教学示例: ${error.message}`)
}

// 第 04 章 URL 示例仅计算字符串，不对示例域名发出请求。
try {
  const lesson = readFileSync(path.join(handbook, '04-加载流水线与应用生命周期.md'), 'utf8')
  const block = [...lesson.matchAll(/```js\r?\n([\s\S]*?)\r?\n```/g)]
    .find(match => match[1].includes('const appendLikeLocalBranch'))
  assert.ok(block, '路径示例必须存在')
  const lines = []
  new Function('console', block[1])({ log: (...args) => lines.push(args) })
  assert.deepEqual(lines, [
    ['https://files.example.test/pkg/assets/a.js'],
    ['https://files.example.test/pkgassets/a.js'],
  ])
} catch (error) {
  errors.push(`第 04 章 URL 示例: ${error.message}`)
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`通过：${files.length} 份 Markdown，${localLinks} 个本地链接，${diagrams} 个图表代码块，${sourceCount} 份来源摘要，2 个离线教学示例。`)
  console.log('本命令不运行浏览器；实际浏览器与教学模型结果见 VALIDATION.md。')
}
