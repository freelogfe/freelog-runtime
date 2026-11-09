import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const handbook = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const root = path.resolve(handbook, '..')
const docsRequire = createRequire(path.join(root, 'docs-new/package.json'))
const { compileTemplate } = docsRequire('@vue/compiler-sfc')
const built = compileTemplate({ source: '<button @click="count++">{{ count }}</button>', filename: 'Player.vue', id: 'reader' })
assert.deepEqual(built.errors, [])
assert.match(built.code, /from "vue"/)
assert.match(built.code, /TEXT/)

const Vue = docsRequire('vue')
const value = Vue.ref(0)
const observations = []
const scope = Vue.effectScope()
scope.run(() => Vue.watchEffect(() => observations.push(value.value)))
value.value = 1
value.value = 2
await Vue.nextTick()
scope.stop()
value.value = 3
await Vue.nextTick()
assert.deepEqual(observations, [0, 2])

const pnpm = path.join(root, 'node_modules/.pnpm')
const installedJsdom = readdirSync(pnpm).find(name => name.startsWith('jsdom@'))
assert.ok(installedJsdom, '工作区需要已有 jsdom；不会自动安装')
const localRequire = createRequire(path.join(root, 'package.json'))
const { JSDOM } = localRequire(path.join(pnpm, installedJsdom, 'node_modules/jsdom'))
const dom = new JSDOM('<!doctype html><html><body></body></html>', { runScripts: 'outside-only' })
const outputs = []
dom.window.console.log = (...args) => outputs.push(args)
dom.window.console.info = () => {}
try {
  dom.window.eval(readFileSync(path.join(root, 'docs-new/node_modules/vue/dist/vue.global.js'), 'utf8'))
  const text = readFileSync(path.join(handbook, 'foundations/04-Vue从编译响应式到应用卸载.md'), 'utf8')
  const blocks = [...text.matchAll(/```js\r?\n([\s\S]*?)\r?\n```/g)].map(match => match[1])
  const adapter = blocks.find(code => code.startsWith('const V = globalThis.Vue'))
  const host = blocks.find(code => code.startsWith('const seen = []'))
  assert.ok(adapter && host, '必须从正文提取完整适配器与宿主样本')
  await dom.window.eval(`(async()=>{\n${adapter}\n${host}\n})()`)
  const serializable = JSON.parse(JSON.stringify(outputs))
  assert.deepEqual(serializable, [[[{ owner: 'reader-b', event: 'resize' }]], [1], [0]])
  writeFileSync(path.join(handbook, 'evidence/vue-examples.json'), JSON.stringify({
    checkedAt: new Date().toISOString(), version: Vue.version,
    checks: ['实际template编译产生helper模块与TEXT标记', 'scope批处理并stop后不再响应', '正文适配器退出A后仅B响应，宿主订阅从1到0'],
    scope: 'Node compiler/reactivity and jsdom execution of extracted prose example; not full-browser proof',
    observations, adapter: serializable,
  }, null, 2) + '\n')
  console.log('通过：3 项 Vue 正文／编译／scope 检查（含 jsdom，区别于真实浏览器）。')
} finally { dom.window.close() }
