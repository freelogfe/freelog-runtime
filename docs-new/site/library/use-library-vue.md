---
outline: deep
---

# Vue 应用使用库

下面我们尝试以主题开发者的视觉，在主题项目开发中使用上面开发的库["库示例-vue"](/library/library-vue)

## 安装环境库

```bash
npm install freelog-runtime@^5.0.7
```

在入口文件 `main.js` 的 `window.mount` 内调用 `initFreelogApp()` 初始化运行时接入。

```js
import { initFreelogApp } from "freelog-runtime";

// 初始化
initFreelogApp()
```

## 处理库打包时external的依赖

```js
import * as Vue from 'vue'

window.Vue = Vue
```

## 加载库

> tip：freelog平台中的库都需要以异步的方式使用;

例如: 在main.js中加载这个库并注册为全局组件

```js
// 获取实例
const instance = window.FreelogLibrary
const getUrlsv = await instance.getLibraryEntryUrls("cumins/vue-component-002")
if (!getUrlsv) throw new Error('未获取到前端库入口')
const resb = await instance.loadLibraryJs(getUrlsv.jsEntryUrl, getUrlsv.metaJson)
if (!resb) throw new Error('前端库未导出声明的命名空间')
console.log("主题中 cumins/vue-component-002", getUrlsv.version, resb);
if (getUrlsv.metaJson.css?.entry) instance.loadLibraryCss(getUrlsv.cssEntryUrl)
app.component("Mittle", resb.default)
```

## 使用库

```js
<template>
  <Mittle msg="cumins/vue-component-002 => 1.0.0"></Mittle>
</template>
```
