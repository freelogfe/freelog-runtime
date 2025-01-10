import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "freelog运行时文档",
  description: "freelog运行时文档",
  lang: "zh-CN",
  // locales: {
  //   root: {
  //     label: 'English',
  //     lang: 'zh'
  //   },
  // },
  head: [["link", { rel: "icon", href: "/freelog.ico" }]],
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "指南", link: "/guide/", activeMatch: "/guide/" },
      { text: "框架改造", link: "/framework/", activeMatch: "/framework/" },
      { text: "API", link: "/api/widget", activeMatch: "/api/" },
      { text: "库开发者", link: "/library/helloworld", activeMatch: "/library/" },
    ],
    sidebar: {
      // 当用户位于 `guide` 目录时，会显示此侧边栏
      "/guide/": [
        {
          text: "指南",
          items: [
            { text: "基础", link: "/guide" },
            { text: "资源系统", link: "/guide/static-source" },
            { text: "数据通信", link: "/guide/data" },
            { text: "虚拟路由系统", link: "/guide/router" },
            // { text: 'keep-alive', link: '/guide/keep-alive' },
          ],
        },
      ],

      "/framework/": [
        {
          text: "框架改造",
          items: [
            { text: "说明", link: "/framework/" },
            { text: "react", link: "/framework/react" },
            { text: "vue", link: "/framework/vue" },
            { text: "vite", link: "/framework/vite" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API分类",
          items: [
            { text: "插件相关", link: "/api/widget" },
            { text: "展品获取", link: "/api/exhibit" },
            { text: "集合内作品", link: "/api/collection" },
            { text: "授权相关", link: "/api/auth" },
            { text: "用户相关", link: "/api/user" },
            { text: "特殊功能", link: "/api/share" },
            { text: "网络请求返回状态码", link: "/api/code" },
          ],
        },
      ],
      "/library/": [
        {
          text: "库开发者",
          items: [
            { text: "创作库指南", link: "/library/guide" },
            { text: "库示例-helloworld", link: "/library/helloworld" },
            { text: "库示例-vue库", link: "/library/library-vue" },
            { text: "库示例-react库", link: "/library/library-react" },
            { text: "如何使用库", link: "/library/library-usage" },
          ],
        },
      ],
    },
    lastUpdatedText: "上次更新",

    returnToTopLabel: "返回顶部",
    docFooter: {
      prev: "上一页",

      next: "下一页",
    },
    search: {
      provider: "local",

      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭"
            },
          },
        }, 
      },
    },
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
    // outline: 'deep'
  },
});
