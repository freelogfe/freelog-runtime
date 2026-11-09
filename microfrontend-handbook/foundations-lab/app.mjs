import { createRuntime } from './runtime.mjs'

const state = { modules: null, native: {}, react: { setup: 0, cleanup: 0, parentClicks: 0 }, vue: { mounted: 0, unmounted: 0, watchValues: [], parentClicks: 0, detachedRuns: 0 } }
const React = window.React
const ReactDOM = window.ReactDOM
const V = window.Vue
const runtime = createRuntime()
const nativeHandles = new Map()
const reactRoots = new Map()
const vueApps = new Map()
let vueCount
let detachedValue
let detachedScope
const versions = await (await fetch('/versions.json')).json()
document.querySelector('#versions').textContent = JSON.stringify(versions, null, 2)
const snapshot = () => JSON.parse(JSON.stringify({ ...state, runtime: runtime.snapshot(), versions }))
function paint() { document.querySelector('#snapshot').textContent = JSON.stringify(snapshot(), null, 2) }

async function modules() {
  const a = await import('./counter.mjs')
  const b = await import('./counter.mjs')
  const c = await import('./counter.mjs?copy=second')
  const before = a.count
  a.increment()
  state.modules = { same: a === b, differentQuery: a !== c, before, live: b.count, initial: b.initial, copied: c.count, evaluations: [...globalThis.__FOUNDATION_MODULE_EVALUATIONS__] }
  paint()
  return state.modules
}
async function nativeMount() {
  for (const name of ['native-a', 'native-b']) {
    if (nativeHandles.has(name)) continue
    const handle = await runtime.mount({ name, entry: new URL('./native-entry.mjs', import.meta.url).href, container: document.getElementById(name), props: { label: name }, capabilities: { report: update => { state.native[name] = { ...state.native[name], ...update }; paint() } } })
    nativeHandles.set(name, handle)
  }
  paint()
}
async function nativeDispose() { await nativeHandles.get('native-a')?.unmount(); nativeHandles.delete('native-a'); paint() }

const Context = React.createContext('outside-provider')
function ReactPlayer({ name, portal = false }) {
  const token = React.useContext(Context)
  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    state.react.setup++
    const timer = setInterval(() => {}, 500)
    paint()
    return () => { clearInterval(timer); state.react.cleanup++; paint() }
  }, [])
  const children = [React.createElement('p', { key: 'value', 'data-context': name }, `${name}: context=${token}, count=${count}`), React.createElement('button', { key: 'click', onClick: () => setCount(value => value + 1) }, 'React count +1')]
  if (portal) children.push(ReactDOM.createPortal(React.createElement('button', { id: 'react-portal-button' }, 'React Portal：观察父 onClick'), document.getElementById('react-portal'), 'player-portal'))
  return React.createElement('section', { onClick: () => { state.react.parentClicks++; paint() } }, ...children)
}
function reactMount() {
  if (!reactRoots.has('a')) {
    const a = ReactDOM.createRoot(document.getElementById('react-a'))
    reactRoots.set('a', a)
    a.render(React.createElement(React.StrictMode, null, React.createElement(Context.Provider, { value: 'provider-a' }, React.createElement(ReactPlayer, { name: 'react-a', portal: true }))))
  }
  if (!reactRoots.has('b')) {
    const b = ReactDOM.createRoot(document.getElementById('react-b'))
    reactRoots.set('b', b)
    b.render(React.createElement(ReactPlayer, { name: 'react-b' }))
  }
}
function reactDispose() {
  const root = reactRoots.get('a')
  if (!root) return
  root.unmount()
  reactRoots.delete('a')
  try { root.render(React.createElement('p', null, 'invalid reuse')) }
  catch (error) { state.react.oldRootRejected = /unmounted/i.test(error.message) }
  paint()
}

const VueChild = { setup() { const id = V.inject('app-id', 'missing'); return () => V.h('span', { 'data-vue-context': id }, id) } }
function vueMount() {
  if (!detachedScope) {
    detachedValue = V.ref(0)
    detachedScope = V.effectScope(true)
    detachedScope.run(() => V.watchEffect(() => { detachedValue.value; state.vue.detachedRuns++; paint() }))
  }
  for (const name of ['vue-a', 'vue-b']) {
    if (vueApps.has(name)) continue
    const count = V.ref(0)
    if (name === 'vue-a') vueCount = count
    const app = V.createApp({
      setup() {
        if (name === 'vue-a') V.watchEffect(() => { state.vue.watchValues.push(count.value); paint() })
        V.onMounted(() => { state.vue.mounted++; paint() })
        V.onUnmounted(() => { state.vue.unmounted++; paint() })
        return () => V.h('section', { onClick: () => { state.vue.parentClicks++; paint() } }, [
          V.h(VueChild), V.h('p', { id: name + '-count' }, String(count.value)),
          V.h('button', { onClick: () => count.value++ }, 'Vue count +1'),
          ...(name === 'vue-a' ? [V.h(V.Teleport, { to: '#vue-portal' }, V.h('button', { id: 'vue-portal-button' }, 'Vue Teleport：观察原生路径'))] : []),
        ])
      },
    })
    app.provide('app-id', name)
    app.mount(document.getElementById(name))
    vueApps.set(name, app)
  }
  paint()
}
async function vueBatch() {
  vueCount.value++
  vueCount.value++
  state.vue.beforeNextTick = document.getElementById('vue-a-count')?.textContent
  state.vue.stateBeforeNextTick = vueCount.value
  await V.nextTick()
  state.vue.afterNextTick = document.getElementById('vue-a-count')?.textContent
  paint()
}
function vueDispose() { vueApps.get('vue-a')?.unmount(); vueApps.delete('vue-a'); paint() }
async function vueDetached() { detachedValue.value++; await V.nextTick(); paint() }
function stopScope() { detachedScope?.stop(); paint() }

const api = { ready: true, modules, nativeMount, nativeDispose, reactMount, reactDispose, vueMount, vueBatch, vueDispose, vueDetached, stopScope, snapshot, runtime, async disposeAll() {
  for (const handle of nativeHandles.values()) await handle.unmount()
  nativeHandles.clear()
  for (const root of reactRoots.values()) root.unmount()
  reactRoots.clear()
  for (const app of vueApps.values()) app.unmount()
  vueApps.clear()
  stopScope()
} }
window.__FOUNDATIONS__ = api
for (const [id, action] of Object.entries({ modules, native: nativeMount, 'dispose-native': nativeDispose, react: reactMount, 'dispose-react': reactDispose, vue: vueMount, 'batch-vue': vueBatch, 'dispose-vue': vueDispose, 'detached-vue': vueDetached, 'stop-scope': stopScope })) {
  document.getElementById(id).addEventListener('click', () => Promise.resolve().then(action).catch(error => { document.querySelector('#notice').textContent = error.message; console.error(error) }))
}
document.querySelector('#notice').textContent = '已就绪：先预测，再运行。这里没有微前端沙箱替你处理框架生命周期。'
paint()
