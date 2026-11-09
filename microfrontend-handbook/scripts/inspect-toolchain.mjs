import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Inspect actual installed compilers in an isolated fixture. No package installation,
// browser execution, runtime build, or write to packages/docs-new is performed.
const handbook = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repository = path.resolve(handbook, '..')
const pcRequire = createRequire(path.join(repository, 'packages/pc-ui/package.json'))
const docsRequire = createRequire(path.join(repository, 'docs-new/package.json'))
const viteRoot = path.dirname(pcRequire.resolve('vite/package.json'))
const pluginRoot = path.resolve(path.dirname(pcRequire.resolve('@vitejs/plugin-react')), '..')
const vite = await import(pathToFileURL(path.join(viteRoot, 'dist/node/index.js')))
const { default: react } = await import(pathToFileURL(path.join(pluginRoot, 'dist/index.mjs')))
const compiler = docsRequire('@vue/compiler-sfc')
const viteRequire = createRequire(path.join(viteRoot, 'package.json'))
const versionOf = (require, name) => JSON.parse(readFileSync(require.resolve(`${name}/package.json`), 'utf8')).version
const versions = {
  vite: vite.version,
  pluginReact: JSON.parse(readFileSync(path.join(pluginRoot, 'package.json'), 'utf8')).version,
  react: versionOf(pcRequire, 'react'),
  reactDom: versionOf(pcRequire, 'react-dom'),
  rollup: viteRequire('rollup').VERSION,
  esbuild: viteRequire('esbuild').version,
  vueCompilerSfc: compiler.version,
}
assert.match(versions.vite, /^5\./, '本探针用于 Vite 5，版本改变后先复核断言')
assert.match(versions.pluginReact, /^4\./)

const temporaryRoot = path.resolve(os.tmpdir())
const fixture = mkdtempSync(path.join(temporaryRoot, 'freelog-toolchain-inspection-'))
const checks = []
const passed = label => { checks.push(label); console.log('PASS', label) }
let server

try {
  const sources = {
    'package.json': JSON.stringify({ name: 'handbook-toolchain-fixture', type: 'module' }),
    'index.html': '<!doctype html><html><head></head><body><div id="root"></div><script type="module" src="/main.jsx"></script></body></html>',
    'main.jsx': `import React from 'react'
import { createRoot } from 'react-dom/client'
import logo from './logo.svg'
import './style.css'
const imageUrl = new URL('./logo.svg', import.meta.url)
function Reader() {
  return <button onClick={() => import('./lazy.js').then(module => module.read())}>
    <img src={logo} data-url={imageUrl.href} />章节
  </button>
}
createRoot(document.getElementById('root')).render(<Reader />)
`,
    'lazy.js': "import './lazy.css'; export const read = () => 'chapter-2'",
    'style.css': '.reader { background-image: url("./logo.svg"); }',
    'lazy.css': '.chapter { color: #234; }',
    'logo.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8"/></svg>',
  }
  for (const [name, source] of Object.entries(sources)) writeFileSync(path.join(fixture, name), source)
  const aliases = ['react-dom/client', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react']
    .map(name => ({ find: new RegExp(`^${name.replaceAll('/', '\\/')}$`), replacement: pcRequire.resolve(name) }))
  const config = {
    root: fixture,
    configFile: false,
    envFile: false,
    base: '/reader/',
    cacheDir: path.join(fixture, '.vite-cache'),
    logLevel: 'silent',
    plugins: [react()],
    resolve: { alias: aliases },
    optimizeDeps: { noDiscovery: true, include: ['react', 'react-dom/client', 'react/jsx-dev-runtime'] },
    server: { host: '127.0.0.1', port: 0, fs: { allow: [fixture, repository] } },
    build: { write: false, manifest: true, assetsInlineLimit: 0, minify: false },
  }
  server = await vite.createServer(config)
  await server.listen()
  const address = server.httpServer.address()
  const origin = `http://127.0.0.1:${address.port}`
  const getText = async relative => {
    const response = await fetch(origin + relative)
    assert.equal(response.status, 200, relative)
    return response.text()
  }
  const html = await getText('/reader/')
  const devModule = await getText('/reader/main.jsx')
  const devCssModule = await getText('/reader/style.css')
  // Request an actual optimized dependency before shutdown, so this inspection
  // waits for esbuild's processing promise instead of canceling an in-flight scan.
  const optimizedUrl = [...devModule.matchAll(/from\s+"([^"]+)"/g)]
    .map(match => match[1]).find(url => url.includes('/deps/'))
  assert.ok(optimizedUrl, 'JSX 开发响应应指向已优化依赖')
  const optimizedModule = await getText(optimizedUrl)
  assert.ok(optimizedModule.includes('export'))
  passed('esbuild 依赖预构建产生浏览器可取得的 ESM 响应')
  assert.ok(html.includes('/reader/@vite/client'))
  assert.ok(html.includes('__vite_plugin_react_preamble_installed__'))
  assert.ok(html.includes('/reader/@react-refresh'))
  passed('开发 HTML 同时注入 Vite client 与 React Refresh preamble')
  assert.ok(devModule.includes('/@react-refresh'))
  assert.ok(devModule.includes('import.meta.hot'))
  assert.ok(!devModule.includes('return <button'))
  assert.ok(devModule.includes('/reader/lazy.js'))
  assert.ok(devModule.includes('/reader/logo.svg?import'))
  passed('开发 JSX 转为 JS，保留 HMR 协议并改写模块与资源 URL')
  assert.ok(devCssModule.includes('updateStyle'))
  passed('开发 CSS 请求返回样式注入模块，不是生产独立 CSS 语义')

  await server.close()
  server = null
  // Create a fresh plugin instance: dev and build hooks own separate resolved configurations.
  const built = await vite.build({ ...config, plugins: [react()] })
  const output = (Array.isArray(built) ? built[0] : built).output
  const manifestAsset = output.find(item => item.fileName === '.vite/manifest.json')
  assert.ok(manifestAsset)
  const manifest = JSON.parse(String(manifestAsset.source))
  const entry = output.find(item => item.type === 'chunk' && item.isEntry)
  const lazy = output.find(item => item.type === 'chunk' && item.isDynamicEntry)
  const builtHtml = output.find(item => item.fileName === 'index.html')
  assert.ok(entry && lazy)
  assert.ok(entry.dynamicImports.includes(lazy.fileName))
  assert.ok(manifest['lazy.js'].css?.length)
  assert.ok(entry.code.includes('__vitePreload'))
  passed('生产 Rollup 输出动态 chunk、关联 CSS、manifest 与预加载助手')
  assert.ok(String(builtHtml.source).includes('/reader/assets/'))
  assert.ok(output.some(item => item.type === 'asset' && item.fileName.endsWith('.svg')))
  assert.ok(output.filter(item => item.type === 'asset' && item.fileName.endsWith('.css')).some(item => String(item.source).includes('/reader/assets/')))
  assert.ok(!entry.code.includes('import.meta.hot'))
  assert.ok(!entry.code.includes('__vite_plugin_react_preamble_installed__'))
  passed('生产 base 改写 HTML、CSS 与资产；开发 Refresh 协议不保留')

  const sfc = `<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
<template><button @click="count++">{{ count }}</button></template>`
  const parsed = compiler.parse(sfc, { filename: 'Counter.vue' })
  assert.deepEqual(parsed.errors, [])
  const compiled = compiler.compileScript(parsed.descriptor, { id: 'handbook-counter', inlineTemplate: true })
  assert.equal(compiled.bindings.count, 'setup-ref')
  assert.ok(compiled.content.includes('createElementBlock'))
  assert.ok(compiled.content.includes('count.value'))
  assert.ok(!compiled.content.includes('<template>'))
  passed('Vue SFC 编译器把 setup 与模板变成含 ref 和 VNode 创建的模块')

  const outputFolder = path.join(handbook, 'evidence')
  mkdirSync(outputFolder, { recursive: true })
  const report = {
    checkedAt: new Date().toISOString(),
    timezone: 'Asia/Shanghai',
    versions,
    scope: 'Node-side real dev responses and build output inspection; no browser HMR, framework execution, federation runtime or Freelog platform proof',
    checks,
    dev: {
      html,
      moduleMarkers: ['/@react-refresh', 'import.meta.hot', '/reader/lazy.js', '/reader/logo.svg?import'].filter(marker => devModule.includes(marker)),
      cssUsesUpdateStyle: devCssModule.includes('updateStyle'),
      dependencyPrebundling: { optimizedUrl, respondsWithEsm: true },
    },
    production: {
      files: output.map(item => ({ file: item.fileName, type: item.type, imports: item.imports, dynamicImports: item.dynamicImports })),
      manifest,
      html: String(builtHtml.source),
      lazyCall: entry.code.match(/.{0,80}__vitePreload\(\(\) => import\(.{0,180}/)?.[0],
    },
    vue: { bindings: compiled.bindings, compiledExcerpt: compiled.content.slice(0, 1800) },
  }
  writeFileSync(path.join(outputFolder, 'toolchain-inspection.json'), JSON.stringify(report, null, 2) + '\n')
  console.log(`通过：${checks.length} 项真实工具链检查；结果已写入 evidence/toolchain-inspection.json。`)
} finally {
  if (server) await server.close()
  const resolved = path.resolve(fixture)
  if (resolved.startsWith(temporaryRoot + path.sep) && path.basename(resolved).startsWith('freelog-toolchain-inspection-')) {
    rmSync(resolved, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
  }
}
