---
outline: deep
---
下面我们尝试以主题开发者的视觉，在主题项目开发中使用上面开发的库["库示例-react"](./library-react)

## 处理库打包时external的依赖

```js
import * as react from "react";
import * as jsxRuntime from "react/jsx-runtime";

(window as any).react = react;
(window as any).jsxRuntime = jsxRuntime;


```

## 加载库

> 注：以异步的方式使用库；

```js
const LazyComponentB = lazy(async () => {
  const getUrls = await instance.getLibraryEntryUrls("cumins/react-component-002", resourceNameOfApp, 'umd')
  const res = await instance.loadLibraryJs(getUrls.jsEntryUrl, getUrls.metaJson, window)
  instance.loadLibraryCss(getUrls.cssEntryUrl, window)
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
