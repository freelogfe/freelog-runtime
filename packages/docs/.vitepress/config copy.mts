import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "freelog运行时文档",
  description: "freelog运行时文档",
  head: [['link', { rel: 'icon', href: '/freelog.ico' }]],
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/index.md' },
      { text: '框架接入', link: '/framework/index.md' },
      { text: 'API', link: '/api/index.md' }
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '基础', link: '/guide/index' },
          { text: '资源系统', link: '/guide/static-source' },
          { text: '数据通信', link: '/guide/data' },
          { text: '虚拟路由系统', link: '/guide/router' },
          // { text: 'keep-alive', link: '/guide/keep-alive' },
        ]
      },
      {
        text: '框架接入',
        items: [
          { text: '说明', link: '/framework/index.md' },
          { text: 'react', link: '/framework/react' },
          { text: 'vue', link: '/framework/vue' },
          { text: 'vite', link: '/framework/vite' },
          // { text: 'nexjts', link: '/framework/nextjs' },
          // { text: 'nuxtjs', link: '/framework/nuxtjs' },
          // { text: 'angular', link: '/framework/angular' },
        ]
      },
      {
        text: '参考API',
        items: [
          { text: '所有', link: '/api/index' },
          { text: 'vite', link: '/api/vite' },
          { text: 'nexjts', link: '/api/nextjs' },
          { text: 'nuxtjs', link: '/api/nuxtjs' },
          { text: 'angular', link: '/api/angular' },
        ]
      },
    ],

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  }
})
