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
    editLink: {
      pattern: 'https://github.com/freelogfe/freelog-runtime/edit/fix-docs-tokyo/packages/docs/:path',
      text: '为此页提供修改建议',
    },
    nav: [
      { text: "首页", link: "/" },
      { text: "指南", link: "/guide/", activeMatch: "/guide/" },
      { text: "框架接入", link: "/framework/", activeMatch: "/framework/" },
      { text: "API", link: "/api/widget", activeMatch: "/api/" },
    ],
    sidebar: {
      // 当用户位于 `guide` 目录时，会显示此侧边栏
      "/guide/": [
        {
          items: [
            { text: "指南", link: "/guide" },
            {
              text: "功能",
              link: "",
              items: [
                { text: "资源系统", link: "/guide/wheel/static-source" },
                { text: "虚拟路由系统", link: "/guide/wheel/router" },
                { text: "数据通信", link: "/guide/wheel/data" },
              ],
            },
          ],
        },
      ],

      "/framework/": [
        {
          text: "框架接入",
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
            { text: "合集相关", link: "/api/collection" },
            { text: "授权相关", link: "/api/auth" },
            { text: "用户相关", link: "/api/user" },
            { text: "特殊功能", link: "/api/share" },
            { text: "网络请求返回状态码", link: "/api/code" },
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
              closeText: "关闭",
            },
          },
        },
      },
    },
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  },
});
