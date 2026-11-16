import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { createMarkdownRenderer } from 'vitepress'
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

test('同步仅适配展示格式，不擅自改写业务规则', () => {
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

test('命令表格中的行内管道转义后仍是两列，参数不会变成HTML标签', async () => {
  const renderer = await createMarkdownRenderer(process.cwd())
  const source = '| 命令 | 说明 |\n| --- | --- |\n| `payment start <contractId> [--method wechat|alipay]` | 暂停 |\n'
  const result = transformCli(source, '11-命令参考.md', new Map(), renderer)
  assert.ok(result.includes('| `payment start <contractId> [--method wechat\\|alipay]` | 暂停 |'))
  const html = renderer.render(result)
  assert.match(html, /wechat\|alipay/)
  assert.match(html, /&lt;contractId&gt;/)
  assert.match(html, /<td>暂停<\/td>/)
  assert.doesNotMatch(html, /<contractId>/)
})

test('表格格式适配按完整反引号边界处理，既有转义不加倍，未闭合片段不猜测', async () => {
  const renderer = await createMarkdownRenderer(process.cwd())
  const source = [
    '| 命令 | 说明 |', '| --- | --- |',
    '| ``command `a|b` end`` | 双反引号 |',
    '| `already a\\|b` | 已转义 |',
    '| ``unclosed a|b | 未闭合 |',
  ].join('\n')
  const result = transformCli(source, 'page.md', new Map(), renderer)
  assert.ok(result.includes('| ``command `a\\|b` end`` | 双反引号 |'))
  assert.ok(result.includes('| `already a\\|b` | 已转义 |'))
  assert.ok(result.includes('| ``unclosed a|b | 未闭合 |'))
})

test('只处理渲染器识别的表格，正文、非表格行内代码及围栏示例原样保留', async () => {
  const renderer = await createMarkdownRenderer(process.cwd())
  const source = [
    '正文 a|b 与 `non-table a|b`。', '',
    '````md', '| 命令 | 说明 |', '| --- | --- |', '| `fenced a|b` | 示例 |',
    '```', '| `still fenced a|b` | 示例 |', '````', '',
    '~~~md', '| 命令 | 说明 |', '| --- | --- |', '| `tilde a|b` | 示例 |', '~~~', '',
    '    | 命令 | 说明 |', '    | --- | --- |', '    | `indented a|b` | 示例 |', '',
  ].join('\n')
  assert.ok(transformCli(source, 'page.md', new Map(), renderer).endsWith(source))
})

test('从根docs同步未提交授权章节，登记来源与格式转换并保留原始字节', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'freelog-docs-table-'))
  try {
    const source = path.join(root, 'docs', 'README.md')
    await mkdir(path.dirname(source), { recursive: true })
    await mkdir(path.join(root, 'packages', 'cli'), { recursive: true })
    await writeFile(path.join(root, 'packages', 'cli', 'package.json'), '{"version":"0.8.0"}')
    const raw = '# 手册\r\n\r\n| 命令 | 说明 |\r\n| --- | --- |\r\n| `start <id> [wechat|alipay]` | 暂停 |\r\n'
    await writeFile(source, raw)
    execFileSync('git', ['init', '-q', root])
    const git = (args) => execFileSync('git', ['-c', 'user.name=Docs Fixture', '-c', 'user.email=docs@example.invalid', '-c', 'commit.gpgsign=false', '-c', `core.hooksPath=${path.join(root, 'no-hooks')}`, ...args], { cwd: root })
    git(['add', '--', 'docs', 'packages'])
    git(['commit', '-qm', 'fixture'])
    const authorization = path.join(root, 'docs', '授权与支付')
    await mkdir(authorization)
    await writeFile(path.join(authorization, 'README.md'), '# 授权与支付\n[支付与恢复](./支付与恢复.md)\n')
    await writeFile(path.join(authorization, '支付与恢复.md'), '# 支付与恢复\n只读查询原单。\n')
    const target = path.join(root, 'generated')
    const lockFile = path.join(root, 'lock.json')
    const record = await syncCli({ cliRoot: root, target, lockFile })
    assert.equal(await readFile(source, 'utf8'), raw)
    assert.equal(record.sourceDirectory, 'docs')
    assert.equal(record.dirty, true)
    assert.deepEqual(new Set(record.files.map((page) => page.source)), new Set(['README.md', '授权与支付/README.md', '授权与支付/支付与恢复.md']))
    assert.ok((await readFile(path.join(target, '授权与支付', 'index.md'), 'utf8')).includes('[支付与恢复](./支付与恢复.md)'))
    assert.ok(record.transforms.includes('escape unescaped pipes inside table inline code'))
    assert.deepEqual(JSON.parse(await readFile(lockFile, 'utf8')).transforms, record.transforms)
    assert.ok((await readFile(path.join(target, 'index.md'), 'utf8')).includes('`start <id> [wechat\\|alipay]`'))
  } finally {
    assert.ok(root.startsWith(path.join(tmpdir(), 'freelog-docs-table-')))
    await rm(root, { recursive: true, force: true })
  }
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
