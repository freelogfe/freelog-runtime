import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { cliSidebar } from '../site/.vitepress/cli-sidebar.mjs'
import { site, filesIn, slash } from '../scripts/lib.mjs'

test('开发入口不宣传已撤下的依赖mock能力', async () => {
  const config = await readFile(path.join(site, '.vitepress/config.mts'), 'utf8')
  assert.doesNotMatch(config, /text: ['"][^'"]*(?:依赖\s*mock|依赖模拟)/i)
  assert.match(config, /text: '主题与插件本地调试'/)
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
