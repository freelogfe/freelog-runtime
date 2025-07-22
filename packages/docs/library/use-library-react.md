---
outline: deep
---
下面我们尝试以主题开发者的视角，在主题项目开发中使用上面开发的库["库示例-react"](./library-react)

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
