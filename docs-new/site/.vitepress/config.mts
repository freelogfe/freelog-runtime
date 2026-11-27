import { defineConfig } from 'vitepress'
import { nav, sidebar } from './navigation.mjs'
import { directoryFallbackScript } from './static-hosting.mjs'

const base = process.env.DOCS_BASE || '/'
if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('DOCS_BASE 必须以 / 开头和结尾')

export default defineConfig({
  lang: 'zh-CN',
  title: 'Freelog 平台使用与开发文档',
  description: '理解平台业务，完成资源发行、节点展品运营和主题插件开发',
  base,
  // Default to .html URLs so direct visits and reloads work on OSS.
  // Enable clean URLs only when the host rewrites paths to matching .html files.
  cleanUrls: process.env.DOCS_CLEAN_URLS === 'true',
  srcExclude: ['public/**'],
  ignoreDeadLinks: false,
  lastUpdated: true,
  head: [['meta', { name: 'theme-color', content: '#075f52' }]],
  transformHead({ page, siteConfig }) {
    // Run before hydration when the host serves the home/404 HTML for a directory.
    if (page !== 'index.md' && page !== '404.md') return []
    const pages = siteConfig.pages.map((source) => siteConfig.rewrites.map[source] || source)
    return [['script', { id: 'docs-directory-fallback' }, directoryFallbackScript(pages, base)]]
  },
  markdown: {
    config(md) {
      const fence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        if (tokens[idx].info.trim() === 'mermaid') {
          const code = md.utils.escapeHtml(JSON.stringify(tokens[idx].content))
          return `<MermaidDiagram :code="${code}" />`
        }
        return fence(tokens, idx, options, env, self)
      }
    }
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Freelog 文档',
    outline: { level: [2, 3], label: '本页内容' },
    nav,
    sidebar,
    search: { provider: 'local', options: {
      translations: {
        button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
        modal: { noResultsText: '没有找到结果', resetButtonTitle: '清除搜索',
          footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } }
      }
    } },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    lastUpdatedText: '最近更新',
    footer: { message: '开发文档 · 源码能力与线上部署分开核验', copyright: 'Freelog' }
  }
})
