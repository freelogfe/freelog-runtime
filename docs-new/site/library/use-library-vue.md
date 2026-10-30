---
outline: deep
---

# Vue 应用使用库

::: info 进阶参考的适用范围
本页从已有文档迁移，保留框架或库的具体示例。先阅读[运行时接入](/runtime/quickstart)及[兼容边界](/runtime/compatibility)。框架示例有各自版本前提，不构成平台统一 Node.js 限制；不能直接组合不同框架或不同年代的配置。
:::
下面我们尝试以主题开发者的视觉，在主题项目开发中使用上面开发的库["库示例-vue"](/library/library-vue)

## 安装环境库

```bash
npm i freelog-runtime@latest -S
```

在入口文件`main.js`中使用

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
const resb = await instance.loadLibraryJs(getUrlsv.jsEntryUrl, getUrlsv.metaJson)
console.log("主题中 cumins/vue-component-002", getUrlsv.version, resb);
instance.loadLibraryCss(getUrlsv.cssEntryUrl)
app.component("Mittle", resb.default)
```

## 使用库

```js
<template>
  <Mittle msg="cumins/vue-component-002 => 1.0.0"></Mittle>
</template>
```
