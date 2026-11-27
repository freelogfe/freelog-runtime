---
outline: 2
---

# 本地开发与调试前端库

先构建出包含 UMD 入口的[库产物](/library/guide)，再在真实主题或插件中验证本地文件。正式依赖读取流程见[线上库加载](./library-usage.md)。

## 1. 开启 HTTPS 的 Web 服务

把本地静态 HTTPS 服务的根目录指向构建产物目录。证书必须匹配地址且受当前浏览器信任。服务需允许节点来源访问需要跨域读取的文件。已经有项目的 HTTPS 服务时可直接复用；Vite 工程见 [HTTPS 开发配置](/reference/frameworks/vite#开发服务)。

依次在浏览器打开本地入口 JS 和 CSS 的 URL，确认能正常读到文件。用明确的完整 URL，例如 `https://localhost:8894/vue-helloworld.umd.js`。

## 2. 加载库

从已接入运行时的应用调用，先在挂载入口运行 `initFreelogApp()`。本地示例指定构建时的 UMD 命名空间和完整 URL：

```js
const library = window.FreelogLibrary
const exports = await library.loadLibraryJs(
  'https://localhost:8894/vue-helloworld.umd.js',
  { nameSpace: 'freelogLibrary.Freelog.vueHelloworld' }
)
if (!exports) throw new Error('本地库未导出声明的命名空间')
library.loadLibraryCss('https://localhost:8894/helloworld-vue.css')
```

如果 UMD 库外置了 Vue，按 [Vue 消费方示例](./use-library-vue.md)先提供 `window.Vue`。验证节点中的应用实际加载本地脚本、样式和导出的组件。发行前切回[依赖树加载](./library-usage.md)并在正式文件地址复验。
