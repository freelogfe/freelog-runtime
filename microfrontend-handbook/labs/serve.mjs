import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const folder = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(folder, '../..')
const engine = path.join(root, 'packages/micro-app2/lib/index.esm.js')
const routes = new Map([
  ['/', ['index.html', 'text/html']],
  ['/index.html', ['index.html', 'text/html']],
  ['/host.js', ['host.js', 'text/javascript']],
  ['/style.css', ['style.css', 'text/css']],
  ['/children/reader-a/', ['child.html', 'text/html']],
  ['/children/reader-b/', ['child.html', 'text/html']],
  ['/assets/child.js', ['child.js', 'text/javascript']],
  ['/assets/child.css', ['child.css', 'text/css']],
])

export function parsePort(value) {
  if (value === undefined) return 4318
  if (!/^\d+$/.test(String(value))) throw new Error('Invalid port: use an integer from 1 to 65535')
  const port = Number(value)
  if (port < 1 || port > 65535) throw new Error('Invalid port: use an integer from 1 to 65535')
  return port
}

export function createLabServer() {
  // Read once per start: one session has a stable, explicitly identified built artifact.
  const engineCode = readFileSync(engine)
  const packageInfo = JSON.parse(readFileSync(path.join(root, 'packages/micro-app2/package.json'), 'utf8'))
  const info = {
    packageVersion: packageInfo.version,
    engineSource: 'packages/micro-app2/lib/index.esm.js',
    engineSha256: createHash('sha256').update(engineCode).digest('hex'),
    environmentBridge: "实验宿主在加载原样 bundler ESM 前提供 window.process.env.NODE_ENV='development'",
    role: '本地机制实验，不连接 Freelog 平台，不代表授权与 SDK 验证',
  }
  return http.createServer((request, response) => {
    const send = (status, mime, body) => {
      response.writeHead(status, {
        'Content-Type': `${mime}; charset=utf-8`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      })
      response.end(request.method === 'HEAD' ? undefined : body)
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.setHeader('Allow', 'GET, HEAD')
      return send(405, 'text/plain', 'Method not allowed')
    }
    let pathname
    try {
      pathname = decodeURIComponent((request.url || '/').split('?')[0])
    } catch {
      return send(400, 'text/plain', 'Malformed path')
    }
    if (pathname.includes('..') || pathname.includes('\\') || pathname.includes('\0')) {
      return send(400, 'text/plain', 'Invalid path')
    }
    if (pathname === '/engine.js') return send(200, 'text/javascript', engineCode)
    if (pathname === '/lab-info.json') return send(200, 'application/json', JSON.stringify(info))
    if (pathname === '/iframe-empty.html') return send(200, 'text/html', '<!doctype html><html><head></head><body></body></html>')
    const route = routes.get(pathname)
    if (!route) return send(404, 'text/plain', 'Lab fixture not found')
    try {
      return send(200, route[1], readFileSync(path.join(folder, route[0])))
    } catch {
      return send(500, 'text/plain', 'Lab fixture unavailable; check the local labs directory')
    }
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2)
    if (args.length && !(args.length === 2 && args[0] === '--port')) throw new Error('Usage: node serve.mjs [--port 4318]')
    const port = parsePort(args[1] ?? process.env.HANDBOOK_LAB_PORT)
    const server = createLabServer()
    server.on('error', error => {
      console.error(`实验台启动失败：${error.message}`)
      process.exitCode = 1
    })
    server.listen(port, '127.0.0.1', () => {
      console.log(`Freelog 微前端机制实验台：http://127.0.0.1:${port}/`)
      console.log('真实加载当前本地 lib；不连接平台。按 Ctrl+C 停止。')
    })
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
