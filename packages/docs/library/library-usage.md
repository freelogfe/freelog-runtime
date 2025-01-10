---
outline: deep
---
## 使用freelog市场中的库

本指南, 主要介绍主题/插件/库开发者如何使用在资源市场中的库;

比如你在开发主题时, 你主题资源标识为"xxx/主题", 你在资源市场中看中了一个"资源标识"为"Freelog/library-test-001"的库, 你打算在你的代码中使用这个库

* step1: 在"资源管理"页面中, 点击"我的资源"找到此主题, 点击"更新", 点击"更多设置", 点击"添加依赖", 并添加此库作为新依赖, 点击"发行"; 并到"节点管理">"主题管理"中, 编辑对应主题并进行一次版本切换动作, 以触发新依赖树的构建;

```js
// 1. 获取实例
const instance = (window as any).rawWindow.FreelogLibrary

// 2. 获取依赖树
console.log(instance.dependencyTree)
```


* step2: 你可以在主题的代码中如下使用:

```js
// 1. 获取实例
const instance = (window as any).rawWindow.FreelogLibrary

// 2. 调用实例方法getLibraryEntryUrls获取js和css的地址对象, 第一个参数为你要使用的库的"资源标识", 第二个参数为使用者的"资源标识"
const getUrlsPa = await instance.getLibraryEntryUrls("Freelog/library-test-001", "xxx/主题")

// 3. 调用实例方法loadLibraryJs加载js入口文件获取库, 第一个参数是js地址, 第二个参数是meta.json数据, 第三个是当前的window
const resPa = await instance.loadLibraryJs(getUrlsPa.jsEntryUrl, getUrlsPa.metaJson, window)

// 使用库去做点什么
console.log(resPa)
```

> 我们通过在平台中给资源添加依赖的方式来管理库的版本问题, 而非在代码里指定要加载的库的版本;

## FreelogLibrary实例方法及属性说明

### getLibraryEntryUrls

是一个返回Promise的函数, 用于获取入口文件的地址

```typescript
function getLibraryEntryUrls(libraryResourceName: string, libraryConsumerResourceName: string): Promise<{
    jsEntryUrl: string,
    cssEntryUrl: string,
    metaJson: any,
    baseUrl: string,
    version: string
}>
```

参数说明

```plaintext
第一个参数: 为你要使用的库的"资源标识";
第二个参数: 为使用者的"资源标识";
```

### loadLibraryJs

是一个返回Promise的函数, 用于加载js文件

```js
function loadLibraryJs(jsUrl: string, metaJson: any, env: any): Promise<any>
```

参数说明

```plaintext
第一个参数: 为getLibraryEntryUrls返回的jsEntryUrl, 或者metaJson里的js地址;
第二个参数: 为getLibraryEntryUrls返回的metaJson;
第三个参数: 为当前的window;
```

### loadLibraryCss

是一个无返回值的函数, 用于加载css文件

```typescript
function loadLibraryCss(cssUrl: string, env: any): void
```

参数说明

```plaintext
第一个参数: css文件地址, 为getLibraryEntryUrls返回的cssEntryUrl, 或者metaJson里的css地址;
第二个参数: 当前的window环境;
```

### dependencyTree

是一个属性, 用于获取当前库的依赖树
