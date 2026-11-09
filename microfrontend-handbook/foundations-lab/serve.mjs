import http from 'node:http'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const folder = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(folder, '../..')
const files = new Map([
  ['/', ['index.html', 'text/html']],
  ['/app.mjs', ['app.mjs', 'text/javascript']],
  ['/style.css', ['style.css', 'text/css']],
  ['/runtime.mjs', ['runtime.mjs', 'text/javascript']],
  ['/native-entry.mjs', ['native-entry.mjs', 'text/javascript']],
  ['/counter.mjs', ['counter.mjs', 'text/javascript']],
])
const vendorPaths = [
  ['react', 'packages/pc-ui/node_modules/react', 'umd/react.development.js', '/vendor/react.js'],
  ['react-dom', 'packages/pc-ui/node_modules/react-dom', 'umd/react-dom.development.js', '/vendor/react-dom.js'],
  ['vue', 'docs-new/node_modules/vue', 'dist/vue.global.js', '/vendor/vue.js'],
]

export function createFoundationsServer() {
  const vendors = new Map()
  const versions = []
  for (const [name, pkg, build, route] of vendorPaths) {
    const code = readFileSync(path.join(repo, pkg, build))
    const version = JSON.parse(readFileSync(path.join(repo, pkg, 'package.json'), 'utf8')).version
    vendors.set(route, code)
    versions.push({ name, version, source: `${pkg}/${build}`, sha256: createHash('sha256').update(code).digest('hex') })
  }
  return http.createServer((request, response) => {
    const send = (status, mime, body) => {
      response.writeHead(status, { 'Content-Type': `${mime}; charset=utf-8`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
      response.end(request.method === 'HEAD' ? undefined : body)
    }
    if (!['GET', 'HEAD'].includes(request.method)) return send(405, 'text/plain', 'GET or HEAD only')
    let pathname
    try { pathname = decodeURIComponent((request.url || '/').split('?')[0]) } catch { return send(400, 'text/plain', 'Malformed URL') }
    if (pathname.includes('..') || pathname.includes('\\') || pathname.includes('\0')) return send(400, 'text/plain', 'Invalid path')
    if (pathname === '/versions.json') return send(200, 'application/json', JSON.stringify({ scope: 'browser/framework foundations; no MicroApp', versions }))
    if (vendors.has(pathname)) return send(200, 'text/javascript', vendors.get(pathname))
    const asset = files.get(pathname)
    if (!asset) return send(404, 'text/plain', 'Not a teaching fixture')
    try { return send(200, asset[1], readFileSync(path.join(folder, asset[0]))) }
    catch { return send(500, 'text/plain', 'Missing teaching fixture') }
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2)
    if (args.length && !(args.length === 2 && args[0] === '--port')) throw new Error('Usage: node serve.mjs [--port 4319]')
    const value = args[1] || '4319'
    if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 65535) throw new Error('Invalid port')
    const server = createFoundationsServer()
    server.on('error', error => { console.error(error.message); process.exitCode = 1 })
    server.listen(Number(value), '127.0.0.1', () => console.log(`底层技术实验：http://127.0.0.1:${value}/ （不加载 MicroApp；Ctrl+C 停止）`))
  } catch (error) { console.error(`无法启动：${error.message}。需要仓库已有的 React/Vue 本地构建，不会回退到 CDN。`); process.exitCode = 1 }
}
