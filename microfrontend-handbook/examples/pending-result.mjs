// 确定性教学模型：演示业务异步结果的提交权，不导入或修改 MicroApp。
import { pathToFileURL } from 'node:url'

export function deferred() {
  let resolve
  const promise = new Promise(done => { resolve = done })
  return { promise, resolve }
}

export function createPlayer({ load, paint, trace, guard }) {
  let generation = 0
  let active = false

  return {
    async mount(chapter) {
      active = true
      const mine = ++generation
      trace.push(`start:${chapter}:g${mine}`)
      const value = await load(chapter)
      if (guard && (!active || mine !== generation)) {
        trace.push(`discard:${chapter}:g${mine}`)
        return 'discarded'
      }
      paint(value)
      trace.push(`commit:${chapter}:g${mine}`)
      return 'committed'
    },
    unmount() {
      active = false
      ++generation
      trace.push(`unmount:g${generation}`)
    },
  }
}

export async function runScenario(guard) {
  const old = deferred()
  const next = deferred()
  const paints = []
  const trace = []
  const player = createPlayer({
    guard,
    load: chapter => chapter === 'chapter-old' ? old.promise : next.promise,
    paint: value => paints.push(value),
    trace,
  })
  const first = player.mount('chapter-old')
  player.unmount()
  const second = player.mount('chapter-new')
  next.resolve('chapter-new')
  await second
  old.resolve('chapter-old')
  await first
  return { mode: guard ? 'fixed-model' : 'broken-model', paints, trace }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify({
    scope: 'teaching-model-only',
    broken: await runScenario(false),
    fixed: await runScenario(true),
  }, null, 2))
}
