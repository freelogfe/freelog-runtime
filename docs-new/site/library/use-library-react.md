---
outline: deep
---

# React 应用使用库

::: info 进阶参考的适用范围
本页从已有文档迁移，保留框架或库的具体示例。先阅读[运行时接入](/runtime/quickstart)及[兼容边界](/runtime/compatibility)。框架示例有各自版本前提，不构成平台统一 Node.js 限制；不能直接组合不同框架或不同年代的配置。
:::
下面我们尝试以主题开发者的视角，在主题项目开发中使用上面开发的库["库示例-react"](/library/library-react)

## 安装环境库

```bash
npm i freelog-runtime@latest -S
```

在入口文件`main.jsx`中使用

```js
import { initFreelogApp } from "freelog-runtime";

// 初始化
initFreelogApp()

```

## 处理库打包时external的依赖

```js
import * as react from "react";
import * as jsxRuntime from "react/jsx-runtime";

window.react = react;
window.jsxRuntime = jsxRuntime;
```

## 加载库

> tip：freelog平台中的库都需要以异步的方式使用；

```js
const LazyComponentB = lazy(async () => {
  // 获取实例
  const instance = window.FreelogLibrary
  const getUrls = await instance.getLibraryEntryUrls("cumins/react-component-002")
  const res = await instance.loadLibraryJs(getUrls.jsEntryUrl, getUrls.metaJson)
  instance.loadLibraryCss(getUrls.cssEntryUrl)
  console.log("主题 helllo", res);
  const { HelloWorld } = res
  const Temp = () => {
    return (
      <div>
        <HelloWorld></HelloWorld>
      </div>
    )
  }
  return {
    default: Temp
  }
});
```

## 使用库

```js
<Suspense fallback={<div>Loading...</div>}>
  <LazyComponentB></LazyComponentB>
</Suspense>
```
