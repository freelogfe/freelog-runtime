import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { cliPage, transformCli, normalizeCliAnchor, syncCli } from '../scripts/sync-cli.mjs'
import { rewriteMarkdownLinks } from '../scripts/lib.mjs'

test('README 链接按目录映射，正文和命令不被全文替换', () => {
  assert.equal(cliPage('合集/README.md'), '合集/index.md')
  const text = '# 示例\n[合集](./合集/README.md#入口)\n```sh\ncat README.md\n```\n'
  const result = transformCli(text, 'page.md')
  assert.match(result, /合集\/index\.md#入口/)
  assert.match(result, /cat README\.md/)
  assert.match(result, /不是运行时对子应用的要求/)
})

test('同步只适配链接和来源提示，不擅自改写业务规则', () => {
  const source = '# 手册\nCLI当前暂不支持支付，需要支付后授权时未支付无法获授权。\n'
  const result = transformCli(source, 'README.md')
  assert.ok(result.includes(source.split('\n')[1]))
  assert.doesNotMatch(result, /来源遗留说明/)
})

test('同步提示不硬编码过时的npm发布结论，版本状态从来源说明读取', () => {
  const result = transformCli('# 手册\n正文\n', 'README.md')
  assert.match(result, /CLI 同步文档/)
  assert.match(result, /来源.*版本说明/)
  assert.doesNotMatch(result, /npm 0\.5\.9|CLI 开发分支文档/)
})

test('不改写 fenced code 中的链接与示例', () => {
  const source = '[页面](./x.md)\n```md\n[原文](./x.md)\n```'
  assert.equal(rewriteMarkdownLinks(source, () => '/new'), '[页面](/new)\n```md\n[原文](./x.md)\n```')
})

test('CLI 原 Markdown 的锚点按新站渲染规则适配，章节目标不丢失', () => {
  const anchors = new Map([['01-快速上手.md', ['_1-安装与登录']], ['04-日常路径.md', ['init、create、bind-各做什么']]])
  const result = transformCli('# 索引\n[安装](./01-快速上手.md#1-安装与登录)\n[入口](./04-日常路径.md#initcreatebind-各做什么)', 'index.md', anchors)
  assert.match(result, /#_1-安装与登录/)
  assert.match(result, /#init、create、bind-各做什么/)
})

test('锚点不凭相近文字猜测，含歧义的归一化必须失败', () => {
  assert.equal(normalizeCliAnchor('不存在', ['已存在']), '不存在')
  assert.throws(() => normalizeCliAnchor('ab', ['a-b', 'a、b']), /歧义/)
})

test('来源不存在时失败并完整保留上一次生成内容', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'freelog-docs-sync-'))
  try {
    const target = path.join(root, 'cli')
    await mkdir(target)
    await writeFile(path.join(target, 'index.md'), '# 上一次内容\n')
    await assert.rejects(syncCli({ cliRoot: path.join(root, 'missing'), target, lockFile: path.join(root, 'lock.json') }))
    assert.equal(await readFile(path.join(target, 'index.md'), 'utf8'), '# 上一次内容\n')
  } finally {
    assert.ok(root.startsWith(path.join(tmpdir(), 'freelog-docs-sync-')))
    await rm(root, { recursive: true, force: true })
  }
})
