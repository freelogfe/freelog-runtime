---
outline: deep
---
下面我们尝试以主题开发者的视觉，在主题项目开发中使用上面开发的库["库示例-vue"](./library-vue)

## 处理库打包时external的依赖

```js
import * as Vue from 'vue'

(window as any).Vue = Vue
```

## 加载库

> 注：以异步的方式使用库；

例如: 在main.js中加载这个库并注册为全局组件

```js
const getUrlsv = await instance.getLibraryEntryUrls("cumins/vue-component-002", resourceNameOfApp)
const resb = await instance.loadLibraryJs(getUrlsv.jsEntryUrl, getUrlsv.metaJson, window)
console.log("主题中 cumins/vue-component-002", getUrlsv.version, resb);
instance.loadLibraryCss(getUrlsv.cssEntryUrl, window)
app.config.globalProperties.VueComTest2 = `cumins/vue-component-002 => ${getUrlsv.version}`
app?.component("Mittle", resb.default)
```

## 使用库

```js
<template>
  <Mittle msg="cumins/vue-component-002 => 1.0.0"></Mittle>
</template>
```
