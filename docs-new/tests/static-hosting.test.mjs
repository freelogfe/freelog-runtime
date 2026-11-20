import test from 'node:test'
import assert from 'node:assert/strict'
import { runInNewContext } from 'node:vm'
import { directoryFallbackScript } from '../site/.vitepress/static-hosting.mjs'

const pages = ['index.md', 'cli/index.md', 'cli/合集/index.md', 'cli/节点与展品/index.md', 'cli/01-快速上手.md']

function redirects(script, url) {
  const target = new URL(url, 'https://docs.example')
  const calls = []
  runInNewContext(script, { location: {
    pathname: target.pathname,
    search: target.search,
    hash: target.hash,
    replace: (value) => calls.push(value)
  } })
  return calls
}

test('目录请求误返回首页时，按实际目录跳转到 index.html 并保留查询和锚点', () => {
  const script = directoryFallbackScript(pages)
  for (const directory of ['/cli/', '/cli/合集/', '/cli/节点与展品/']) {
    const encoded = encodeURI(directory)
    assert.deepEqual(redirects(script, encoded + '?from=nav#section'), [encoded + 'index.html?from=nav#section'])
  }
})

test('显式 HTML 不重复跳转，首页、未知目录及非法编码不被误导向', () => {
  const script = directoryFallbackScript(pages)
  for (const url of ['/', '/index.html', '/cli/合集/index.html', '/cli/01-快速上手.html', '/missing/', '/cli/%E5/']) {
    assert.deepEqual(redirects(script, url), [], url)
  }
})

test('目录回退支持子路径部署且不影响部署范围外的 URL', () => {
  const script = directoryFallbackScript(pages, '/docs/')
  const directory = encodeURI('/docs/节点与展品/')
  assert.deepEqual(redirects(script, directory), [])
  const cliDirectory = encodeURI('/docs/cli/节点与展品/')
  assert.deepEqual(redirects(script, cliDirectory), [cliDirectory + 'index.html'])
  assert.deepEqual(redirects(script, '/cli/'), [])
  assert.deepEqual(redirects(script, '/docs/'), [])
})
