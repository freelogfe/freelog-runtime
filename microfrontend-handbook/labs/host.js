import microApp, { removeDomScope } from '/engine.js'

const names = ['reader-a', 'reader-b']
const records = new Map()
const events = []
let sequence = 0
let info
let paintPending = false
const labels = { mounted: '运行中', afterhidden: '已隐藏', aftershow: '运行中', unmount: '已卸载', error: '失败', loading: '加载中', destroyed: '已销毁' }
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

function assertName(name) {
  if (!names.includes(name)) throw new Error('实验只支持 reader-a 和 reader-b')
}
function log(kind, name, detail = {}) {
  events.push({ ...detail, seq: ++sequence, at: Math.round(performance.now()), kind, name })
  if (events.length > 300) events.shift()
  if (!paintPending) {
    paintPending = true
    requestAnimationFrame(() => { paintPending = false; paint() })
  }
}
function snapshot() {
  return {
    engine: info,
    browserUrl: location.href,
    browserMicroState: history.state?.__MICRO_APP_STATE__ || null,
    allApps: microApp.getAllApps(),
    activeApps: microApp.getActiveApps(),
    visibleApps: microApp.getActiveApps({ excludeHiddenApp: true }),
    rawHasOwner: Object.prototype.hasOwnProperty.call(window, '__LAB_OWNER__'),
    apps: Object.fromEntries([...records].map(([name, record]) => [name, {
      status: record.status,
      options: record.options,
      probe: record.probe,
      ticks: record.ticks,
      cleanups: record.cleanups,
      messages: record.messages,
      lastMessage: record.lastMessage,
      connected: !!record.element?.isConnected,
      domRootOwner: record.element?.querySelector('#player-root')?.dataset.owner || null,
    }])),
  }
}
function paint() {
  document.querySelector('#snapshot').textContent = JSON.stringify(snapshot(), null, 2)
  document.querySelector('#events').textContent = events.map(item => JSON.stringify(item)).join('\n')
  for (const [name, record] of records) {
    document.querySelector('#status-' + name).textContent = labels[record.status] || record.status
  }
}
function notify(text, error = false) {
  const target = document.querySelector('#notice')
  target.textContent = text
  target.dataset.error = String(error)
}
function evidence(name, payload) {
  // A host observation callback is a boundary crossing; do not leave child DOM scope active.
  removeDomScope()
  const record = records.get(name)
  if (payload.probe) record.probe = payload.probe
  if (payload.kind === 'tick') record.ticks = payload.ticks
  if (payload.kind === 'cleanup') record.cleanups++
  log('child:' + payload.kind, name, payload)
}
function deadline(promise, label, milliseconds = 7000) {
  let timer
  return Promise.race([
    promise,
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(label + ' 超时；检查因果记录。超时不代表底层工作已被取消。')), milliseconds) }),
  ]).finally(() => clearTimeout(timer))
}

microApp.start({
  iframeSrc: location.origin + '/iframe-empty.html',
  fetch: async (url, options, appName) => {
    log('source:fetch', appName, { url })
    const response = await fetch(url, options)
    if (!response.ok) throw new Error('实验资源 HTTP ' + response.status)
    return response.text()
  },
})

async function mount(name, options = {}) {
  assertName(name)
  let record = records.get(name)
  if (record?.pending) throw new Error(name + ' 正在切换，请等待完成')
  if (record?.status === 'mounted' || record?.status === 'aftershow') return snapshot()
  if (record?.status === 'afterhidden') {
    record.pending = true
    try {
      await deadline(new Promise(resolve => {
        record.element.addEventListener('aftershow', resolve, { once: true })
        document.querySelector('#slot-' + name).appendChild(record.element)
      }), name + ' 恢复')
      notify(name + ' 已恢复原实例；观察 mounts 是否保持不变。')
      return snapshot()
    } finally { record.pending = false; paint() }
  }
  const selected = {
    sandbox: options.sandbox || 'with',
    routerMode: options.routerMode || 'search',
    keepAlive: options.keepAlive ?? true,
  }
  if (!['with', 'iframe'].includes(selected.sandbox)) throw new Error('sandbox 必须为 with 或 iframe')
  if (!['search', 'state', 'pure'].includes(selected.routerMode)) throw new Error('路由模式必须为 search/state/pure')
  // A retained, unmounted instance cannot silently change its sandbox/options.
  if (record && record.status !== 'destroyed' && JSON.stringify(record.options) !== JSON.stringify(selected)) {
    throw new Error('切换配置前先销毁 ' + name + '；普通卸载可能保留旧沙箱。')
  }
  record = record || { cleanups: 0, messages: 0, lastMessage: null, ticks: 0 }
  Object.assign(record, { status: 'loading', pending: true, options: selected })
  records.set(name, record)
  const slot = document.querySelector('#slot-' + name)
  slot.replaceChildren()
  const lifecycle = {}
  for (const kind of ['created', 'beforemount', 'mounted', 'afterhidden', 'aftershow', 'unmount', 'error']) {
    lifecycle[kind] = () => {
      if (!['created', 'beforemount'].includes(kind)) record.status = kind
      log('lifecycle:' + kind, name)
    }
  }
  try {
    const result = microApp.renderApp({
      name,
      url: location.origin + '/children/' + name + '/',
      container: slot,
      iframe: selected.sandbox === 'iframe',
      'keep-alive': selected.keepAlive,
      'router-mode': selected.routerMode,
      data: { lesson: 'reader', onEvidence: payload => evidence(name, payload) },
      lifeCycles: lifecycle,
      onDataChange: event => {
        record.messages++
        record.lastMessage = event.detail.data
        log('message:child-to-host', name, { data: event.detail.data })
      },
    })
    record.element = slot.querySelector('micro-app')
    const success = await deadline(result, name + ' 挂载')
    if (!success) throw new Error(name + ' 挂载返回 false')
    notify(name + ' 已挂载。预测之后再观察快照中的 probe。')
    return snapshot()
  } catch (error) {
    record.status = 'error'
    log('host:error', name, { message: error.message })
    notify(error.message, true)
    throw error
  } finally { record.pending = false; paint() }
}

async function unmount(name, options = {}) {
  assertName(name)
  const record = records.get(name)
  if (!record) return false
  if (record.pending) throw new Error(name + ' 正在切换，请等待完成')
  record.pending = true
  try {
    const result = await deadline(microApp.unmountApp(name, options), name + ' 退出')
    if (!result) throw new Error(name + ' 没有可退出的框架实例')
    if (options.destroy) record.status = 'destroyed'
    notify(name + (options.destroy ? ' 已销毁；对比 B 是否继续工作。' : ' 已退出显示；隐藏与卸载请看状态和清理记录。'))
    return result
  } finally { record.pending = false; paint() }
}
function send(name, data) { assertName(name); microApp.forceSetData(name, data) }
function navigate(name, target = '/chapter/2') { send(name, { command: 'navigate', path: target }) }
function merge(name) { send(name, { command: 'dispatch-pair' }) }

window.__HANDBOOK_LAB__ = { mount, unmount, snapshot, events, send, navigate, merge, wait, ready: false }
document.querySelectorAll('[data-action]').forEach(button => {
  button.addEventListener('click', async () => {
    button.disabled = true
    try {
      if (button.dataset.action === 'mount') {
        await mount(button.dataset.name, {
          sandbox: document.querySelector('#sandbox').value,
          routerMode: document.querySelector('#router-mode').value,
          keepAlive: document.querySelector('#keep-alive').checked,
        })
      } else {
        await unmount(button.dataset.name, button.dataset.action === 'destroy' ? { destroy: true } : {})
      }
    } catch (error) { notify(error.message, true) }
    finally { button.disabled = false }
  })
})
document.querySelector('#refresh').addEventListener('click', paint)
document.querySelector('#clear-events').addEventListener('click', () => { events.splice(0); paint() })
try {
  const response = await fetch('/lab-info.json')
  if (!response.ok) throw new Error('无法读取产物来源')
  info = await response.json()
  document.querySelector('#engine-info').textContent = `${info.engineSource} · package ${info.packageVersion} · SHA-256 ${info.engineSha256}。${info.environmentBridge}`
  window.__HANDBOOK_LAB__.ready = true
  notify('已就绪。先预测：挂载 A、B 后，哪一个 window 会保存 __LAB_OWNER__？')
} catch (error) { notify(error.message, true) }
paint()
