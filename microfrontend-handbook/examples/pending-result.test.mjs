import assert from 'node:assert/strict'
import test from 'node:test'
import { createPlayer, deferred, runScenario } from './pending-result.mjs'

test('反例：只移除视图不会阻止旧结果覆盖新结果', async () => {
  const result = await runScenario(false)
  assert.deepEqual(result.paints, ['chapter-new', 'chapter-old'])
})

test('代次：新结果可提交，旧挂载结果失去提交权', async () => {
  const result = await runScenario(true)
  assert.deepEqual(result.paints, ['chapter-new'])
  assert.ok(result.trace.includes('discard:chapter-old:g1'))
})

test('退出后不重挂：迟到结果也不能提交', async () => {
  const request = deferred()
  const paints = []
  const player = createPlayer({
    guard: true, load: () => request.promise, paint: value => paints.push(value), trace: [],
  })
  const mounted = player.mount('chapter-old')
  player.unmount()
  request.resolve('chapter-old')
  assert.equal(await mounted, 'discarded')
  assert.deepEqual(paints, [])
})

test('实例隔离：退出 A 不使仍活跃的 B 请求失效', async () => {
  const requestA = deferred()
  const requestB = deferred()
  const paintsA = []
  const paintsB = []
  const a = createPlayer({ guard: true, load: () => requestA.promise, paint: v => paintsA.push(v), trace: [] })
  const b = createPlayer({ guard: true, load: () => requestB.promise, paint: v => paintsB.push(v), trace: [] })
  const resultA = a.mount('chapter-old')
  const resultB = b.mount('chapter-new')
  a.unmount()
  requestB.resolve('chapter-new')
  requestA.resolve('chapter-old')
  assert.equal(await resultA, 'discarded')
  assert.equal(await resultB, 'committed')
  assert.deepEqual(paintsA, [])
  assert.deepEqual(paintsB, ['chapter-new'])
})

test('失败要传播，不能把被拒请求伪装成成功', async () => {
  const request = deferred()
  const paints = []
  const player = createPlayer({
    guard: true,
    load: async () => { await request.promise; throw new Error('fixture unavailable') },
    paint: value => paints.push(value), trace: [],
  })
  const result = player.mount('chapter-old')
  const rejected = assert.rejects(result, /fixture unavailable/)
  request.resolve()
  await rejected
  assert.deepEqual(paints, [])
})
