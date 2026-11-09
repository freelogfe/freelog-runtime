import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'
import { createLabServer } from '../labs/serve.mjs'

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

const server = createLabServer()
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
  socket = new WebSocket(`ws://127.0.0.1:${port}${endpoint}`)
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  socket.addEventListener('message', event => {
    const message = JSON.parse(String(event.data))
    if (message.method === 'Runtime.exceptionThrown') {
      const detail = message.params.exceptionDetails
      errors.push(detail.exception?.description || detail.text)
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      errors.push(message.params.args.map(argument => argument.description || argument.value || argument.type).join(' '))
    }
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
  await until(() => evaluate('Boolean(window.__HANDBOOK_LAB__?.ready)'), '实验初始化')
  await evaluate('window.lab = window.__HANDBOOK_LAB__')
  await evaluate('document.querySelector("button[data-action=mount][data-name=reader-a]").click()')
  await until(() => evaluate('lab.snapshot().apps["reader-a"]?.status === "mounted"'), 'UI 挂载 A')
  await evaluate('document.querySelector("button[data-action=mount][data-name=reader-b]").click()')
  await until(() => evaluate('lab.snapshot().apps["reader-b"]?.status === "mounted"'), 'UI 挂载 B')
  let snapshot = await evaluate('lab.snapshot()')
  for (const name of ['reader-a', 'reader-b']) {
    const record = snapshot.apps[name]
    assert.equal(record.status, 'mounted')
    assert.equal(record.probe.owner, name)
    assert.equal(record.probe.queryIsSelf, true)
    assert.equal(record.domRootOwner, name)
    assert.equal(record.probe.rawHasOwner, false)
    assert.equal(record.probe.sameArrayConstructor, true)
  }
  checked('with 双实例：全局标记、同名根节点与宿主边界')

  const beforeMessages = snapshot.apps['reader-a'].messages
  await evaluate('document.querySelector("#slot-reader-a .lab-merge-button").click()')
  snapshot = await until(async () => {
    const value = await evaluate('lab.snapshot()')
    return value.apps['reader-a'].messages > beforeMessages ? value : false
  }, '通信合并')
  assert.equal(snapshot.apps['reader-a'].messages - beforeMessages, 1)
  assert.equal(snapshot.apps['reader-a'].lastMessage.first, 1)
  assert.equal(snapshot.apps['reader-a'].lastMessage.second, 2)
  checked('同轮两次 dispatch：一份合并状态')

  await evaluate('document.querySelector("#slot-reader-a .lab-route-button").click()')
  snapshot = await until(async () => {
    const value = await evaluate('lab.snapshot()')
    return value.apps['reader-a'].probe.path === '/chapter/2' ? value : false
  }, 'search 导航')
  assert.ok(new URL(snapshot.browserUrl).searchParams.has('reader-a'))
  checked('search：子路径与浏览器编码同时可见')

  const initialMounts = snapshot.apps['reader-a'].probe.mounts
  await evaluate('lab.unmount("reader-a")')
  const hidden = await evaluate('lab.snapshot()')
  assert.equal(hidden.apps['reader-a'].status, 'afterhidden')
  assert.ok(hidden.activeApps.includes('reader-a'))
  assert.ok(!hidden.visibleApps.includes('reader-a'))
  await delay(750)
  snapshot = await evaluate('lab.snapshot()')
  assert.equal(snapshot.apps['reader-a'].ticks, hidden.apps['reader-a'].ticks)
  assert.ok(snapshot.apps['reader-b'].ticks > hidden.apps['reader-b'].ticks)
  await evaluate('lab.mount("reader-a")')
  snapshot = await evaluate('lab.snapshot()')
  assert.equal(snapshot.apps['reader-a'].probe.mounts, initialMounts)
  checked('隐藏／恢复：子应用主动暂停，B 继续，mount 次数不增加')

  await evaluate('lab.unmount("reader-a", {clearAliveState:true})')
  snapshot = await evaluate('lab.snapshot()')
  assert.equal(snapshot.apps['reader-a'].status, 'unmount')
  const cleanups = snapshot.apps['reader-a'].cleanups
  assert.ok(cleanups >= 1)
  await evaluate('lab.mount("reader-a")')
  snapshot = await evaluate('lab.snapshot()')
  assert.equal(snapshot.apps['reader-a'].probe.mounts, initialMounts + 1)
  await evaluate('lab.unmount("reader-a", {destroy:true})')
  snapshot = await evaluate('lab.snapshot()')
  assert.ok(!snapshot.allApps.includes('reader-a'))
  assert.equal(snapshot.apps['reader-a'].cleanups, cleanups + 1)
  checked('UMD 卸载重挂及 destroy：清理发生，实例登记移除')

  await evaluate('lab.mount("reader-a", {sandbox:"iframe"})')
  snapshot = await evaluate('lab.snapshot()')
  assert.equal(snapshot.apps['reader-a'].probe.sandbox, 'iframe')
  assert.equal(snapshot.apps['reader-a'].probe.sameArrayConstructor, false)
  assert.equal(snapshot.apps['reader-a'].probe.queryIsSelf, true)
  assert.equal(snapshot.apps['reader-a'].domRootOwner, 'reader-a')
  assert.ok(snapshot.visibleApps.includes('reader-b'))
  checked('iframe 经典脚本：新 realm，主页面可见 DOM，B 保留')

  const output = path.join(folder, 'evidence')
  mkdirSync(output, { recursive: true })
  await evaluate('document.querySelector("#sandbox").value = "iframe"')
  const image = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  writeFileSync(path.join(output, 'lab-desktop.png'), Buffer.from(image.data, 'base64'))
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await delay(100)
  const layout = await evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})')
  assert.ok(layout.scroll <= layout.width + 1, `窄屏横向溢出 ${JSON.stringify(layout)}`)
  checked('390px 窄屏：页面无横向溢出')
  assert.deepEqual(errors, [], '不应出现未处理的页面异常')
  writeFileSync(path.join(output, 'browser-smoke.json'), JSON.stringify({
    checkedAt: new Date().toISOString(), timezone: 'Asia/Shanghai', browser: version.product, userAgent: version.userAgent,
    engine: snapshot.engine, checks,
    scope: 'same-origin local classic-script lab only; no Freelog platform, native ESM, cross-origin or other-browser proof',
  }, null, 2) + '\n')
  await evaluate('lab.unmount("reader-a", {destroy:true})')
  await evaluate('lab.unmount("reader-b", {destroy:true})')
  console.log(`通过：${checks.length} 项真实浏览器检查；记录已写入 evidence/browser-smoke.json。`)
} catch (error) {
  if (evaluate) {
    try { console.error(JSON.stringify(await evaluate('({snapshot:window.__HANDBOOK_LAB__?.snapshot(),events:window.__HANDBOOK_LAB__?.events?.slice(-12)})'), null, 2)) } catch {}
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
