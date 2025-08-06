import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "freelog开发者文档",
  description: "freelog开发者文档",
  lang: "zh-CN",
  base: "/v1",
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
    socialLinks: [
      { icon: "github", link: "https://github.com/freelogfe/freelog-runtime" },
    ],
    editLink: {
      pattern:
        "https://github.com/freelogfe/freelog-runtime/edit/fix-docs-tokyo/packages/docs/:path",
      text: "为此页提供修改建议",
    },
    nav: [
      { text: "首页", link: "/" },
      { text: "指南", link: "/guide/", activeMatch: "/guide/" },
      { text: "框架接入", link: "/framework/", activeMatch: "/framework/" },
      { text: "参考API", link: "/api/widget", activeMatch: "/api/" },
      { text: "库开发者", link: "/library/guide", activeMatch: "/library/" },
      {
        text: "访问最新版本",
        link: "https://widget-docs.testfreelog.com/",
      },
    ],
    sidebar: {
      // 当用户位于 `guide` 目录时，会显示此侧边栏
      "/guide/": [
        {
          text: "主题/插件指南",
          items: [
            { text: "概述", link: "/guide/" },
            { text: "脚手架", link: "/guide/cli" },
            { text: "主题-vue示例", link: "/guide/theme-vue" },
            { text: "主题-react示例", link: "/guide/theme-react" },
            { text: "插件-vue示例", link: "/guide/plugin-vue" },
            { text: "插件-react示例", link: "/guide/plugin-react" },
            { text: "插件开发者-调试篇(vue)", link: "/guide/use-plugin-vue" },
            {
              text: "插件开发者-调试篇(react)",
              link: "/guide/use-plugin-react",
            },
            { text: "如何发布主题和插件", link: "/guide/release" },
            { text: "如何启用主题/切换版本", link: "/guide/use-theme" },
            { text: "官方主题和插件参考", link: "/guide/official" },
            // {
            //   text: "功能",
            //   link: "",
            //   items: [
            //     { text: "资源系统", link: "/guide/wheel/static-source" },
            //     { text: "虚拟路由系统", link: "/guide/wheel/router" },
            //     { text: "数据通信", link: "/guide/wheel/data" },
            //   ],
            // },
          ],
        },
      ],

      "/framework/": [
        {
          text: "主题/插件框架接入",
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
          text: "主题/插件API分类",
          items: [
            { text: "基础", link: "/api/widget" },
            { text: "展品获取", link: "/api/exhibit" },
            { text: "合集相关", link: "/api/collection" },
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
            { text: "介绍", link: "/library/intro" },
            { text: "创作库指南", link: "/library/guide" },
            { text: "库示例-helloworld", link: "/library/helloworld" },
            { text: "库示例-vue库", link: "/library/library-vue" },
            { text: "库示例-react库", link: "/library/library-react" },
            { text: "如何使用库", link: "/library/library-usage" },
            { text: "使用库示例(vue)", link: "/library/use-library-vue" },
            { text: "使用库示例(react)", link: "/library/use-library-react" },
            { text: "库的本地开发调试", link: "/library/local-dev" },
            { text: "附: 生成meta.json的脚本", link: "/library/meta-gen" },
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
    // outline: 'deep'
  },
  vite: {
    server: {
      host: true,
    },
  },
});
