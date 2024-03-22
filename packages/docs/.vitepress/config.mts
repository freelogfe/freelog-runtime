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
      { text: 'Home', link: '/' },
      { text: '基础指南', link: '/guide/index.md' },
      { text: '框架改造指南', link: '/framework/react.md' },
      { text: 'API', link: '/api/index.md' }
    ],
    sidebar: [
      {
        text: '框架改造指南',
        items: [
          { text: 'react', link: '/framework/react' },
          { text: 'vue', link: '/framework/vue' },
          { text: 'vite', link: '/framework/vite' },
          { text: 'nexjts', link: '/framework/nextjs' },
          { text: 'nuxtjs', link: '/framework/nuxtjs' },
          { text: 'angular', link: '/framework/angular' },
        ]
      }
    ],

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  }
})
