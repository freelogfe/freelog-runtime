import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { cliSidebar } from '../site/.vitepress/cli-sidebar.mjs'
import { agentReading, nav, sidebar } from '../site/.vitepress/navigation.mjs'
import { site, filesIn, slash } from '../scripts/lib.mjs'

test('运行时开发、运行时 API 和 Agent 阅读各有入口', async () => {
  const navItems = Object.values(sidebar).flatMap((groups) => groups.flatMap(({ items }) => items))
  assert.ok(nav.some(({ link }) => link === '/runtime/'))
  assert.equal(nav.find(({ link }) => link === '/runtime/api/')?.text, '运行时 API')
  assert.equal(nav.find(({ link }) => link === '/agents')?.text, 'Agent 阅读')
  assert.match(agentReading.find(({ page }) => page === 'runtime/api/index.md')?.text ?? '', /运行时 API/u)
  const homepage = await readFile(path.join(site, 'index.md'), 'utf8')
  const [, frontmatter] = homepage.split(/^---\r?$/mu, 3)
  assert.match(frontmatter, /text: Agent 阅读\r?\n\s+link: \/agents\b/u)
  assert.ok(sidebar['/runtime/'].some(({ items }) => items.some(({ link }) => link === '/runtime/development')))
  assert.ok(sidebar['/runtime/api/'].some(({ items }) => items.some(({ link }) => link === '/runtime/api/base')))
  for (const { text, link } of [...nav, ...navItems]) {
    assert.doesNotMatch(text, /依赖\s*mock|依赖模拟/i)
    const page = link.endsWith('/') ? link + 'index.md' : link + '.md'
    await access(path.join(site, page))
  }
  for (const { page } of agentReading) await access(path.join(site, page))
})

test('Next.js 和 Nuxt 的旧入口不提供 SSR 接入步骤', async () => {
  for (const file of ['nextjs.md', 'nuxtjs.md']) {
    const text = await readFile(path.join(site, 'reference/frameworks', file), 'utf8')
    assert.match(text, /不(?:支持|托管|提供)[^\n。]*(?:服务端渲染|SSR)/u)
    assert.doesNotMatch(text, /<micro-app[^>]*\bssr\b|node server\.js|next start|nuxt start|nuxt\.render/i)
  }
})

test('应用开发导航与公开指南使用 Freelog 应用接入入口', async () => {
  const navItems = Object.values(sidebar).flatMap((groups) => groups.flatMap(({ items }) => items))
  assert.ok(navItems.some(({ link }) => link === '/runtime/integration/'))
  assert.ok(agentReading.some(({ page }) => page === 'runtime/integration/index.md'))
  assert.doesNotMatch(JSON.stringify([nav, navItems, agentReading]), /micro-?app/i)

  const paths = await Promise.all(['runtime', 'reference', 'library'].map((directory) => filesIn(path.join(site, directory))))
  for (const file of paths.flat().filter((file) => file.endsWith('.md'))) {
    assert.doesNotMatch(await readFile(file, 'utf8'), /micro-?app/i, slash(path.relative(site, file)))
  }
})

test('CLI 专属目录覆盖每个同步页面，所有入口指向实际正文', async () => {
  const links = cliSidebar.flatMap((group) => group.items.map((item) => item.link))
  const cliLinks = links.filter((link) => link.startsWith('/cli/'))
  assert.equal(new Set(cliLinks).size, cliLinks.length)
  const fileFor = (link) => path.join(site, link.endsWith('/') ? link + 'index.md' : link + '.md')
  for (const link of links) await access(fileFor(link))
  const actual = new Set((await filesIn(path.join(site, 'cli'))).filter((file) => file.endsWith('.md')).map((file) => slash(path.relative(site, file))))
  assert.deepEqual(new Set(cliLinks.map((link) => slash(path.relative(site, fileFor(link))))), actual)
})
