import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { once } from 'node:events'
import { readFileSync } from 'node:fs'
import http from 'node:http'
import { after, before, test } from 'node:test'
import { createLabServer, parsePort } from './serve.mjs'

let server
let origin
before(async () => {
  server = createLabServer()
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  origin = `http://127.0.0.1:${server.address().port}`
})
after(() => new Promise(resolve => server.close(resolve)))

test('one local service serves the host, two same-code child entries and actual engine with correct MIME', async () => {
  for (const [url, mime, text] of [
    ['/', 'text/html', 'Freelog'],
    ['/host.js', 'text/javascript', '/engine.js'],
    ['/children/reader-a/', 'text/html', '/assets/child.js'],
    ['/children/reader-b/', 'text/html', '/assets/child.js'],
    ['/engine.js', 'text/javascript', 'MicroApp'],
  ]) {
    const response = await fetch(origin + url)
    assert.equal(response.status, 200, url)
    assert.ok(response.headers.get('content-type').includes(mime), url)
    assert.ok((await response.text()).includes(text), url)
  }
  const source = await (await fetch(origin + '/lab-info.json')).json()
  assert.equal(source.packageVersion, '1.0.0-rc.8')
  assert.match(source.engineSha256, /^[a-f0-9]{64}$/)
  const engineBytes = readFileSync(new URL('../../packages/micro-app2/lib/index.esm.js', import.meta.url))
  assert.equal(source.engineSha256, createHash('sha256').update(engineBytes).digest('hex'))
  assert.equal(await (await fetch(origin + '/engine.js')).text(), engineBytes.toString('utf8'))
  const index = await (await fetch(origin + '/')).text()
  assert.ok(index.indexOf('window.process =') < index.indexOf('src="/host.js"'), 'bundler environment bridge must precede the module host')
})

test('repository files and path traversal are unavailable', async () => {
  for (const url of ['/package.json', '/.git/config', '/packages/micro-app2/package.json', '/unknown']) {
    assert.equal((await fetch(origin + url)).status, 404, url)
  }
  // Raw HTTP preserves traversal text; fetch/new URL would normalize it before sending.
  for (const url of ['/../package.json', '/%2e%2e/package.json', '/%2e%2e%2fpackage.json', '/assets/%5c..%5cpackage.json']) {
    const status = await new Promise((resolve, reject) => {
      http.get({ hostname: '127.0.0.1', port: server.address().port, path: url }, response => {
        response.resume()
        resolve(response.statusCode)
      }).on('error', reject)
    })
    assert.ok(status === 400 || status === 404, url)
  }
})

test('only GET and HEAD are accepted; malformed paths fail without exposing files', async () => {
  assert.equal((await fetch(origin + '/', { method: 'POST' })).status, 405)
  const head = await fetch(origin + '/engine.js', { method: 'HEAD' })
  assert.equal(head.status, 200)
  assert.equal(await head.text(), '')
  assert.equal((await fetch(origin + '/%ZZ')).status, 400)
})

test('port parsing rejects ambiguous or non-local service configuration', () => {
  assert.equal(parsePort(undefined), 4318)
  assert.equal(parsePort('4321'), 4321)
  for (const value of ['0', '-1', '65536', '4318x', '1.5', '']) {
    assert.throws(() => parsePort(value), /port/i)
  }
})
