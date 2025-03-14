---
outline: deep
---

# 库只能作为主题或插件的依赖使用

## 1.库在本平台是什么、能做什么？

- 库是一个包含一个 js 文件和一个 css 文件的工具包。
- 库可以使用 react、vue 或纯 js 实现。
- 库可以为主题或插件提供 js 工具函数，vue、react 组件库等。
- 库可以为主题或插件提供成套的 css 样式。
- 库没有独立沙盒，与引入者在同一上下文内，所以可以影响引入者的 DOM 和样式。
- 库中的 js 与 css 是分开的文件，可以单独引入。

## 2.动机

- 轻便化：目前插件属于重量级 react、vue 应用，体积大，加载慢，运行时处理时间长。
- 独立化：js 与 css 分离，减少体积，按需加载。
- 抽象化：方便维护公共 js 与 css、公共组件库，缩小维护成本，提高复用性。
- 平台授权：平台付费 api 可以开发成库、或被二次开发成 js 库。

## 3.物料

- 打包工具：可选webpack、rollup、vite 等。建议使用 vite。
- 框架：可选react、vue、纯 js。
- 配置文件：meta.json，用于描述打包产物

meta.json举例：固定字段

```js
{
  "nameSpace": "freelogLibrary.Freelog.localModule", 
  "js": {
    "entry": "index.js",  
    "other": []
  },
  "css": {
    "entry": "index.css",
    "other": []
  },
  "other": [
    "meta.json"
  ]
}
```


