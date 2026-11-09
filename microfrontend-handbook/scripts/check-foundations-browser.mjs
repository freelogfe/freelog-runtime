import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'
import { createFoundationsServer } from '../foundations-lab/serve.mjs'

// Optional real-browser smoke. Fresh local profile; no account, platform API or new dependency.
// Runtime.evaluate / Target / Page use the official Chrome DevTools Protocol.
const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const candidates = [
  process.env.HANDBOOK_BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)
const browserPath = candidates.find(existsSync)
if (!browserPath) throw new Error('未找到本地 Chromium 浏览器；可用 HANDBOOK_BROWSER 指向浏览器可执行文件。')

const server = createFoundationsServer()
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve) })
const baseUrl = `http://127.0.0.1:${server.address().port}/`
const tempRoot = path.resolve(os.tmpdir())
const profile = mkdtempSync(path.join(tempRoot, 'freelog-handbook-browser-'))
const browser = spawn(browserPath, [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--disable-background-networking',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding', 'about:blank',
], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] })
let launchError
browser.on('error', error => { launchError = error })
let stderr = ''
browser.stderr.on('data', chunk => { stderr = (stderr + chunk).slice(-4000) })
let socket
let sessionId
let nextId = 0
const requests = new Map()
const errors = []
const checks = []
let evaluate

async function until(predicate, label, timeout = 10000) {
  const limit = Date.now() + timeout
  while (Date.now() < limit) {
    const result = await predicate()
    if (result) return result
    if (launchError) throw launchError
    await delay(60)
  }
  throw new Error(`${label} 超时`)
}
function cdp(method, params = {}, scoped = true) {
  return new Promise((resolve, reject) => {
    const id = ++nextId
    const timer = setTimeout(() => { requests.delete(id); reject(new Error(`${method} 超时`)) }, 12000)
    requests.set(id, { resolve, reject, timer })
    socket.send(JSON.stringify({ id, method, params, ...(scoped && sessionId ? { sessionId } : {}) }))
  })
}
function checked(name) { checks.push(name); console.log('PASS', name) }

try {
  const activeFile = path.join(profile, 'DevToolsActivePort')
  await until(() => existsSync(activeFile), '浏览器调试端点', 15000)
  const [port, endpoint] = readFileSync(activeFile, 'utf8').trim().split(/\r?\n/)
  socket = new WebSocket('ws://127.0.0.1:' + port + endpoint)
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  socket.addEventListener('message', event => {
    const message = JSON.parse(String(event.data))
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text)
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map(argument => argument.description || argument.value || argument.type).join(' '))
    if (!message.id) return
    const request = requests.get(message.id)
    if (!request) return
    clearTimeout(request.timer)
    requests.delete(message.id)
    if (message.error) request.reject(new Error(message.error.message))
    else request.resolve(message.result)
  })
  const version = await cdp('Browser.getVersion', {}, false)
  const target = await cdp('Target.createTarget', { url: 'about:blank' }, false)
  sessionId = (await cdp('Target.attachToTarget', { targetId: target.targetId, flatten: true }, false)).sessionId
  await cdp('Runtime.enable')
  await cdp('Page.enable')
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1080, deviceScaleFactor: 1, mobile: false })
  evaluate = async expression => {
    const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text)
    return result.result.value
  }
  await cdp('Page.navigate', { url: baseUrl })
  await until(() => evaluate('Boolean(window.__FOUNDATIONS__?.ready)'), '基础实验初始化')
  await evaluate('window.lab = window.__FOUNDATIONS__')

  const modules = await evaluate('lab.modules()')
  assert.equal(modules.same, true)
  assert.equal(modules.differentQuery, true)
  assert.equal(modules.live, 1)
  assert.equal(modules.initial, 0)
  assert.equal(modules.copied, 0)
  assert.equal(modules.evaluations.length, 2)
  checked('原生ESM：同URL复用、query身份、live binding与求值次数')

  await evaluate('lab.nativeMount()')
  assert.equal((await evaluate('lab.snapshot().runtime')).length, 2)
  await evaluate('document.querySelector("#native-a button").click()')
  let snapshot = await evaluate('lab.snapshot()')
  assert.equal(snapshot.native['native-a'].count, 1)
  assert.equal(snapshot.native['native-b'].count, 0)
  await evaluate('lab.nativeDispose()')
  const nativeTicks = await evaluate('lab.snapshot()')
  await delay(450)
  snapshot = await evaluate('lab.snapshot()')
  assert.equal(snapshot.native['native-a'].cleaned, true)
  assert.equal(snapshot.native['native-a'].ticks, nativeTicks.native['native-a'].ticks)
  assert.ok(snapshot.native['native-b'].ticks > nativeTicks.native['native-b'].ticks)
  checked('手写ESM应用协议：同定义双实例，退出A不影响B')

  await evaluate('lab.reactMount()')
  await until(() => evaluate('lab.snapshot().react.setup === 3'), 'React effect提交')
  const reactState = await evaluate('({stats:lab.snapshot().react,a:document.querySelector("[data-context=react-a]").textContent,b:document.querySelector("[data-context=react-b]").textContent})')
  assert.equal(reactState.stats.cleanup, 1)
  assert.ok(reactState.a.includes('provider-a'))
  assert.ok(reactState.b.includes('outside-provider'))
  checked('React18：StrictMode额外setup/cleanup，多root不共享Provider树')

  const reactClicks = reactState.stats.parentClicks
  await evaluate('document.querySelector("#react-portal-button").click()')
  assert.equal((await evaluate('lab.snapshot().react')).parentClicks, reactClicks + 1)
  await evaluate('lab.reactDispose()')
  snapshot = await evaluate('lab.snapshot()')
  assert.equal(snapshot.react.oldRootRejected, true)
  assert.equal(snapshot.react.setup - snapshot.react.cleanup, 1)
  assert.equal(await evaluate('Boolean(document.querySelector("#react-portal-button"))'), false)
  await evaluate('lab.reactMount()')
  await until(() => evaluate('lab.snapshot().react.setup === 5'), 'React新root重挂')
  checked('React Portal逻辑冒泡，旧root不能复用，新createRoot可重挂')

  await evaluate('lab.vueMount()')
  assert.equal(await evaluate('document.querySelector("#vue-a [data-vue-context]").textContent'), 'vue-a')
  assert.equal(await evaluate('document.querySelector("#vue-b [data-vue-context]").textContent'), 'vue-b')
  await evaluate('lab.vueBatch()')
  snapshot = await evaluate('lab.snapshot()')
  assert.equal(snapshot.vue.beforeNextTick, '0')
  assert.equal(snapshot.vue.stateBeforeNextTick, 2)
  assert.equal(snapshot.vue.afterNextTick, '2')
  assert.deepEqual(snapshot.vue.watchValues, [0, 2])
  checked('Vue3：app provide独立、同步变更批处理、nextTick前后DOM差异')

  const vueClicks = snapshot.vue.parentClicks
  await evaluate('document.querySelector("#vue-portal-button").click()')
  assert.equal((await evaluate('lab.snapshot().vue')).parentClicks, vueClicks)
  await evaluate('lab.vueDispose()')
  assert.equal(await evaluate('Boolean(document.querySelector("#vue-portal-button"))'), false)
  const beforeScope = await evaluate('lab.snapshot().vue')
  await evaluate('lab.vueDetached()')
  const afterScope = await evaluate('lab.snapshot().vue')
  assert.equal(afterScope.unmounted, 1)
  assert.equal(afterScope.detachedRuns, beforeScope.detachedRuns + 1)
  await evaluate('lab.stopScope()')
  await evaluate('lab.vueDetached()')
  assert.equal((await evaluate('lab.snapshot().vue')).detachedRuns, afterScope.detachedRuns)
  checked('Vue Teleport物理事件路径，app卸载不停止独立scope，显式stop有效')

  await evaluate('lab.vueMount()')
  assert.equal((await evaluate('lab.snapshot().vue')).mounted, 3)
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await delay(60)
  const layout = await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})')
  assert.ok(layout.scroll <= layout.width + 1)
  checked('Vue新app重挂成功；基础实验390px不横向溢出')
  assert.deepEqual(errors, [], '页面不应有未处理异常或error日志')
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1080, deviceScaleFactor: 1, mobile: false })
  const output = path.join(folder, 'evidence')
  mkdirSync(output, { recursive: true })
  const picture = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  writeFileSync(path.join(output, 'foundations-desktop.png'), Buffer.from(picture.data, 'base64'))
  snapshot = await evaluate('lab.snapshot()')
  const teachingSources = ['runtime.mjs', 'native-entry.mjs', 'app.mjs', 'index.html'].map(name => ({
    path: 'foundations-lab/' + name,
    sha256: createHash('sha256').update(readFileSync(path.join(folder, 'foundations-lab', name))).digest('hex'),
  }))
  writeFileSync(path.join(output, 'foundations-browser.json'), JSON.stringify({checkedAt:new Date().toISOString(),timezone:'Asia/Shanghai',browser:version.product,versions:snapshot.versions.versions,teachingSources,checks,observations:{modules:snapshot.modules,react:snapshot.react,vue:snapshot.vue},scope:'real local browser; no MicroApp, ViteHMR, cross-origin, hydration or Freelog platform execution'},null,2)+'\n')
  await evaluate('lab.disposeAll()')
  console.log('通过：' + checks.length + ' 项独立底层浏览器检查。')

} catch (error) {
  if (evaluate) {
    try { console.error(JSON.stringify(await evaluate('({snapshot:window.__FOUNDATIONS__?.snapshot(),events:window.__FOUNDATIONS__?.events?.slice(-12)})'), null, 2)) } catch {}
  }
  console.error(error.stack)
  if (errors.length) console.error('页面异常／错误日志：', JSON.stringify(errors, null, 2))
  if (launchError) console.error(launchError.message)
  if (!socket) console.error(stderr)
  process.exitCode = 1
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    try { await cdp('Browser.close', {}, false) } catch {}
    socket.close()
  }
  if (browser.exitCode === null) {
    await Promise.race([new Promise(resolve => browser.once('exit', resolve)), delay(2000)])
    if (browser.exitCode === null) browser.kill()
  }
  for (const request of requests.values()) clearTimeout(request.timer)
  server.closeAllConnections()
  await new Promise(resolve => server.close(resolve))
  // Delete only the fresh profile allocated above, after checking its resolved temp boundary.
  const resolved = path.resolve(profile)
  if (resolved.startsWith(tempRoot + path.sep) && path.basename(resolved).startsWith('freelog-handbook-browser-')) {
    try { rmSync(resolved, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }) }
    catch { console.error('临时浏览器配置仍被占用，保留于：' + resolved) }
  }
}
