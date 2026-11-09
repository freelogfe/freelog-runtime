import assert from 'node:assert/strict'
import test from 'node:test'
import { once } from 'node:events'
import { createRuntime } from './runtime.mjs'
import { createFoundationsServer } from './serve.mjs'

const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done }); return { promise, resolve } }
const mount = (host, options) => host.mount({ container: {}, ...options })
test('一个定义只加载一次，但两个实例各有对象与清理身份', async () => {
  let loads = 0
  let serial = 0
  const disposed = []
  const host = createRuntime(async () => {
    loads++
    return { createApplication() { const id = ++serial; return { mount() {}, unmount() { disposed.push(id) } } } }
  })
  const a = await mount(host, { name: 'a', entry: 'same' })
  const b = await mount(host, { name: 'b', entry: 'same' })
  assert.equal(loads, 1)
  assert.equal(serial, 2)
  await a.unmount()
  assert.deepEqual(disposed, [1])
  assert.deepEqual(host.snapshot().map(item => item.name), ['b'])
  await b.unmount()
})
test('加载中取消不创建实例，也不假称 import 已停止；名称等到结算再释放', async () => {
  const load = deferred()
  let factories = 0
  const host = createRuntime(() => load.promise)
  const pending = mount(host, { name: 'a', entry: 'slow' })
  assert.equal(host.cancel('a'), true)
  await assert.rejects(mount(host, { name: 'a', entry: 'slow' }), /reserved/)
  load.resolve({ createApplication() { factories++; return {} } })
  assert.equal((await pending).status, 'cancelled')
  assert.equal(factories, 0)
  assert.deepEqual(host.snapshot(), [])
})
test('mount过程中取消：等适配器返回后清理一次，不返回有效句柄', async () => {
  const ready = deferred()
  let cleanups = 0
  const host = createRuntime(async () => ({ createApplication: () => ({ mount: () => ready.promise, unmount: () => cleanups++ }) }))
  const pending = mount(host, { name: 'a', entry: 'entry' })
  await new Promise(resolve => setImmediate(resolve))
  host.cancel('a')
  ready.resolve()
  assert.equal((await pending).status, 'cancelled')
  assert.equal(cleanups, 1)
  assert.deepEqual(host.snapshot(), [])
})
test('旧句柄绑定旧对象，重复调用不能按复用名称误卸载新实例', async () => {
  const cleaned = []
  let id = 0
  const host = createRuntime(async () => ({ createApplication() { const current = ++id; return { mount() {}, unmount() { cleaned.push(current) } } } }))
  const container = {}
  const old = await mount(host, { name: 'a', entry: 'entry', container })
  await old.unmount()
  const next = await mount(host, { name: 'a', entry: 'entry', container })
  await old.unmount()
  assert.deepEqual(cleaned, [1])
  assert.equal(host.snapshot()[0].id, next.id)
  await assert.rejects(mount(host, { name: 'b', entry: 'entry', container }), /container reserved/)
  await next.unmount()
})
test('适配器挂载失败保留拒绝并释放已创建资源', async () => {
  let cleaned = 0
  const host = createRuntime(async () => ({ createApplication: () => ({ mount() { throw new Error('failed mount') }, unmount() { cleaned++ } }) }))
  await assert.rejects(mount(host, { name: 'a', entry: 'entry' }), /failed mount/)
  assert.equal(cleaned, 1)
  assert.deepEqual(host.snapshot(), [])
})
test('清理失败保留隔离记录与两个原因，不释放名称冒充干净退出', async () => {
  const host = createRuntime(async () => ({ createApplication: () => ({ mount() { throw new Error('mount failed') }, unmount() { throw new Error('cleanup failed') } }) }))
  const container = {}
  await assert.rejects(mount(host, { name: 'a', entry: 'entry', container }), error => error instanceof AggregateError && error.errors.length === 2)
  assert.equal(host.snapshot()[0].status, 'cleanup_failed')
  await assert.rejects(mount(host, { name: 'a', entry: 'entry' }), /reserved/)
  await assert.rejects(mount(host, { name: 'b', entry: 'entry', container }), /container reserved/)
})
test('不同名称也不能同时拥有同一容器；正常退出后可转交', async () => {
  const container = {}
  const host = createRuntime(async () => ({ createApplication: () => ({ mount() {}, unmount() {} }) }))
  const first = await mount(host, { name: 'a', entry: 'entry', container })
  await assert.rejects(mount(host, { name: 'b', entry: 'entry', container }), /container reserved/)
  await first.unmount()
  const next = await mount(host, { name: 'b', entry: 'entry', container })
  assert.equal(next.status, 'mounted')
  await next.unmount()
})
test('缺少容器引用在加载定义之前失败', async () => {
  let loads = 0
  const host = createRuntime(() => { loads++; return {} })
  await assert.rejects(host.mount({ name: 'a', entry: 'entry' }), /container/)
  assert.equal(loads, 0)
})
test('独立基础实验不提供MicroApp、源码仓库目录或未知资源', async () => {
  const server = createFoundationsServer()
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const origin = `http://127.0.0.1:${server.address().port}`
  try {
    const versions = await (await fetch(origin + '/versions.json')).json()
    assert.deepEqual(versions.versions.map(item => item.name), ['react', 'react-dom', 'vue'])
    assert.equal((await fetch(origin + '/counter.mjs?copy=second')).status, 200)
    for (const target of ['/engine.js', '/packages/micro-app2/lib/index.esm.js', '/package.json']) assert.equal((await fetch(origin + target)).status, 404)
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)) }
})
