import { cliSidebar } from './cli-sidebar.mjs'

export const nav = [
  { text: '开始使用', link: '/start' },
  { text: '平台业务', link: '/platform/tasks', activeMatch: '^/platform/' },
  { text: '运行时开发', link: '/runtime/', activeMatch: '^/runtime/(?!api/)|^/(reference|library)/' },
  { text: '运行时 API', link: '/runtime/api/', activeMatch: '^/runtime/api/' },
  { text: 'CLI', link: '/cli/', activeMatch: '^/cli/' },
  { text: 'Agent 阅读', link: '/agents' }
]

const runtimeSidebar = [
  { text: '接入与调试', items: [
    { text: '运行时开发总览', link: '/runtime/' },
    { text: '准备节点与主题', link: '/runtime/node-setup' },
    { text: '运行第一个主题', link: '/runtime/quickstart' },
    { text: '主题与插件本地调试', link: '/runtime/development' }
  ] },
  { text: '发行与验证', items: [
    { text: '配置运行时版本', link: '/runtime/compatibility' },
    { text: '发行与节点验收', link: '/runtime/release' },
    { text: '问题排查', link: '/runtime/troubleshooting' }
  ] },
  { text: '理解与参考', items: [
    { text: '运行时如何加载应用', link: '/runtime/architecture' },
    { text: '运行时 API', link: '/runtime/api/' },
    { text: '框架接入', link: '/reference/frameworks/' },
    { text: '应用接入', link: '/runtime/integration/' },
    { text: '前端库', link: '/library/' }
  ] }
]

export const sidebar = {
  '/cli/': cliSidebar,
  '/runtime/api/': [
    { text: '运行时 API', items: [
      { text: '方法总览', link: '/runtime/api/' },
      { text: '调用与返回约定', link: '/runtime/api/base' },
      { text: '实例与插件挂载', link: '/runtime/api/widget' },
      { text: '展品与内容', link: '/runtime/api/exhibit' },
      { text: '合集展品', link: '/runtime/api/collection' },
      { text: '消费者授权', link: '/runtime/api/auth' },
      { text: '用户与登录', link: '/runtime/api/user' },
      { text: '分享', link: '/runtime/api/share' },
      { text: '响应状态码', link: '/runtime/api/code' }
    ] }
  ],
  '/runtime/': runtimeSidebar,
  '/platform/': [
    { text: '平台业务', items: [
      { text: '平台对象与主线', link: '/platform/overview' },
      { text: '按任务操作', link: '/platform/tasks' },
      { text: '账号与环境', link: '/platform/accounts' },
      { text: '资源创作与发行', link: '/platform/resources' },
      { text: '节点、展品与内容', link: '/platform/nodes-and-exhibits' },
      { text: '签约、支付与授权', link: '/platform/authorization' }
    ] }
  ],
  '/reference/': [
    { text: '框架接入', items: [
      { text: '选择接入方式', link: '/reference/frameworks/' },
      { text: 'Vite 开发与构建', link: '/reference/frameworks/vite' },
      { text: 'React 生命周期', link: '/reference/frameworks/react' },
      { text: 'Vue 生命周期', link: '/reference/frameworks/vue' }
    ] },
    { text: '运行时进阶', items: [
      { text: '路由、通信与静态资源', link: '/runtime/integration/' },
      { text: '官方示例', link: '/reference/official' },
      { text: '0.4 迁移参考', link: '/reference/migration-0-4' }
    ] }
  ],
  '/library/': [
    { text: '开发和使用前端库', items: [
      { text: '任务总览', link: '/library/' },
      { text: '库与命名空间', link: '/library/intro' },
      { text: '构建与发行', link: '/library/guide' },
      { text: '最小示例', link: '/library/helloworld' },
      { text: '在应用中加载库', link: '/library/library-usage' },
      { text: '调试本地库', link: '/library/local-dev' }
    ] }
  ],
  '/': [
    { text: '文档入口', items: [
      { text: '让 AI 帮我完成任务', link: '/start' },
      { text: 'Agent 阅读与操作约定', link: '/agents' },
      { text: '版本与来源', link: '/about' }
    ] }
  ]
}

export const agentReading = [
  { text: 'Agent 阅读与操作约定', page: 'agents.md' },
  { text: '理解平台对象', page: 'platform/overview.md' },
  { text: '按平台业务选任务', page: 'platform/tasks.md' },
  { text: '发行资源或管理节点：CLI 使用手册', page: 'cli/index.md' },
  { text: '按主题、插件任务开始运行时开发', page: 'runtime/index.md' },
  { text: '配置并核对运行时版本', page: 'runtime/compatibility.md' },
  { text: '从真实节点运行第一个主题', page: 'runtime/quickstart.md' },
  { text: '接入、调试插件与依赖', page: 'runtime/development.md' },
  { text: '应用接入：路由、通信与生命周期', page: 'runtime/integration/index.md' },
  { text: '查询运行时 API 的方法、参数和返回值', page: 'runtime/api/index.md' }
]
