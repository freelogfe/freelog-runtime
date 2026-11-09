import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { inspectMarkdown, markdownFiles } from './markdown-check.mjs'

test('嵌套实验文档的链接相对于自身，中文标题锚点与显式锚点均可访问', () => {
  const tempRoot = path.resolve(os.tmpdir())
  const root = mkdtempSync(path.join(tempRoot, 'freelog-markdown-check-'))
  try {
    mkdirSync(path.join(root, 'labs'))
    writeFileSync(path.join(root, 'README.md'), '# 运行契约\n\n<a id="failure"></a>\n')
    writeFileSync(path.join(root, 'labs', 'README.md'), '# 实验\n\n[返回](../README.md#运行契约)\n[错误](../README.md#failure)\n')
    assert.equal(markdownFiles(root).length, 2)
    const result = inspectMarkdown(path.join(root, 'labs/README.md'))
    assert.deepEqual(result.errors, [])
    assert.equal(result.localLinks, 2)
    writeFileSync(path.join(root, 'labs/README.md'), '# 实验\n\n[坏锚点](../README.md#不存在)\n')
    assert.ok(inspectMarkdown(path.join(root, 'labs/README.md')).errors.some(error => error.includes('锚点不存在')))
  } finally {
    if (path.resolve(root).startsWith(tempRoot + path.sep) && path.basename(root).startsWith('freelog-markdown-check-')) rmSync(root, { recursive: true, force: true })
  }
})

test('围栏示例里的链接和HTML不冒充正文，折叠答案仍检查', () => {
  const content = '# 示例\n\n```md\n[不是链接](missing.md)\n<details>\n```\n\n<details>\n<summary>答案</summary>\n\n内容\n</details>\n'
  assert.deepEqual(inspectMarkdown(import.meta.filename, content).errors, [])
})

test('未关闭的围栏或折叠答案必须失败，不能只统计开闭数量', () => {
  assert.ok(inspectMarkdown(import.meta.filename, '# 标题\n\n```js\n').errors.some(error => error.includes('围栏')))
  assert.ok(inspectMarkdown(import.meta.filename, '# 标题\n\n<details><summary>答案</details></summary>').errors.some(error => error.includes('折叠')))
})
