import { defineConfig } from 'vitepress'
import { cliSidebar } from './cli-sidebar.mjs'

const base = process.env.DOCS_BASE || '/'
if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('DOCS_BASE 必须以 / 开头和结尾')

export default defineConfig({
  lang: 'zh-CN',
  title: 'Freelog 平台使用与开发文档',
  description: '理解平台业务，完成资源发行、节点展品运营和主题插件开发',
  base,
  // OSS can serve generated .html objects directly, without extensionless rewrites.
  cleanUrls: process.env.DOCS_CLEAN_URLS !== 'false',
  srcExclude: ['public/**'],
  ignoreDeadLinks: false,
  lastUpdated: true,
  head: [['meta', { name: 'theme-color', content: '#075f52' }]],
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
    nav: [
      { text: '开始', link: '/start' },
      { text: '平台业务', link: '/platform/tasks' },
      { text: '运行时', link: '/runtime/quickstart' },
      { text: 'CLI', link: '/cli/' },
      { text: 'API', link: '/runtime/api/' },
      { text: 'Agent 阅读', link: '/agents' }
    ],
    sidebar: { '/cli/': cliSidebar, '/': [
      { text: '先建立全景', items: [
        { text: '让 AI 帮我完成任务', link: '/start' },
        { text: '平台对象与主线', link: '/platform/overview' },
        { text: '按平台任务操作', link: '/platform/tasks' },
        { text: '账号与环境', link: '/platform/accounts' },
        { text: '资源创作与发行', link: '/platform/resources' },
        { text: '节点、展品与内容', link: '/platform/nodes-and-exhibits' },
        { text: '签约、支付与授权', link: '/platform/authorization' },
        { text: '运行时与主子应用', link: '/runtime/architecture' },
        { text: '版本与兼容边界', link: '/runtime/compatibility' }
      ] },
      { text: '开发与交付', items: [
        { text: '准备节点与启用主题', link: '/runtime/node-setup' },
        { text: '主题插件快速接入', link: '/runtime/quickstart' },
        { text: '主题与插件本地调试', link: '/runtime/development' },
        { text: '正式发行与节点使用', link: '/runtime/release' },
        { text: '排查问题', link: '/runtime/troubleshooting' },
        { text: 'CLI 完整手册', link: '/cli/' }
      ] },
      { text: 'SDK 参考', collapsed: false, items: [
        { text: '调用前必读', link: '/runtime/api/' },
        { text: '实例与插件挂载', link: '/runtime/api/widget' },
        { text: '展品与内容', link: '/runtime/api/exhibit' },
        { text: '合集', link: '/runtime/api/collection' },
        { text: '授权', link: '/runtime/api/auth' },
        { text: '用户', link: '/runtime/api/user' },
        { text: '分享与其它功能', link: '/runtime/api/share' },
        { text: '响应码', link: '/runtime/api/code' }
      ] },
      { text: '进阶资料', collapsed: true, items: [
        { text: '框架接入', link: '/reference/frameworks/' },
        { text: '路由、通信与资源', link: '/reference/microapp/' },
        { text: '前端库开发', link: '/library/' },
        { text: '0.4 迁移参考', link: '/reference/migration-0-4' }
      ] },
      { text: '文档说明', items: [
        { text: '版本、来源与迁移状态', link: '/about' },
        { text: 'Agent 读取方式', link: '/agents' }
      ] }
    ] },
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
