import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, unlink, access, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { markdownTarget, exportAgent } from '../scripts/agent-export.mjs'

test('Markdown 导出保留下载文件，页面与清单支持子路径', () => {
  assert.equal(markdownTarget('/source-lock.json', 'agents.md', '/docs/'), '/docs/source-lock.json')
  assert.equal(markdownTarget('/llms.txt', 'agents.md', '/docs/'), '/docs/llms.txt')
  assert.equal(markdownTarget('./widget.md#getselfdep', 'runtime/api/index.md', '/docs/'), '/docs/markdown/runtime/api/widget.md#getselfdep')
  assert.equal(markdownTarget('/cli/', 'index.md', '/docs/'), '/docs/markdown/cli/index.md')
})

test('移除正文后导出不会保留失效页面，清单摘要与文本匹配', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'freelog-docs-export-'))
  try {
    const sourceRoot = path.join(root, 'site')
    const publicRoot = path.join(sourceRoot, 'public')
    const lockFile = path.join(root, 'lock.json')
    await mkdir(sourceRoot)
    await writeFile(lockFile, JSON.stringify({ channel: 'development' }))
    await writeFile(path.join(sourceRoot, 'kept.md'), '# 保留\n')
    await writeFile(path.join(sourceRoot, 'removed.md'), '# 移除\n')
    await exportAgent({ sourceRoot, publicRoot, lockFile, base: '/preview/' })
    await unlink(path.join(sourceRoot, 'removed.md'))
    await exportAgent({ sourceRoot, publicRoot, lockFile, base: '/preview/' })
    await assert.rejects(access(path.join(publicRoot, 'markdown/removed.md')))
    const manifest = JSON.parse(await readFile(path.join(publicRoot, 'markdown-manifest.json'), 'utf8'))
    assert.deepEqual(manifest.pages.map((p) => p.path), ['/preview/markdown/kept.md'])
    assert.match(manifest.pages[0].sha256, /^[a-f0-9]{64}$/)
    assert.doesNotMatch(await readFile(path.join(publicRoot, 'llms-full.txt'), 'utf8'), /# 移除/)
  } finally {
    // The only recursive removal is the exact directory returned by mkdtemp.
    assert.ok(root.startsWith(path.join(tmpdir(), 'freelog-docs-export-')))
    await rm(root, { recursive: true, force: true })
  }
})
