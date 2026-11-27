---
outline: [2, 3]
---

# 线上库的加载与返回接口

运行时通过当前主题或插件的依赖树加载前端库。使用库的应用需先[接入节点运行时](/runtime/quickstart)。

## 使用 Freelog 市场中的库

### 添加依赖

找到前端库资源，记下资源标识，例如 `Freelog/library-test-001`。把库声明为当前主题或插件版本的直接依赖，核对版本范围和依赖授权后发行，再让节点使用包含该依赖的版本。[版本工作稿](/cli/06-版本工作稿) · [依赖授权](/cli/授权与支付/依赖授权)

库的解析版本来自实际挂载应用的依赖树。新增本地声明后，应在节点上用包含它的版本验收。

### 在应用代码中加载

以下函数由应用在 `window.mount` 内调用了 `initFreelogApp()` 之后使用。将示例资源标识替换为已声明的库。

```js
async function loadExampleLibrary() {
  const library = window.FreelogLibrary
  const entries = await library.getLibraryEntryUrls('Freelog/library-test-001')
  if (!entries) throw new Error('未获取到前端库入口')

  const exports = await library.loadLibraryJs(entries.jsEntryUrl, entries.metaJson)
  if (!exports) throw new Error('前端库未导出声明的命名空间')

  if (entries.metaJson.css?.entry) {
    library.loadLibraryCss(entries.cssEntryUrl)
  }
  return exports
}
```

加载的脚本和样式在引入者的应用内运行。库有外置的 React 或 Vue 依赖时，消费方需提供对应全局对象，见 [React](/library/use-library-react) 和 [Vue](/library/use-library-vue) 示例。

## FreelogLibrary 实例方法及属性

### getLibraryEntryUrls

`getLibraryEntryUrls(resourceName)` 返回 Promise。传入平台资源标识，当前实现按依赖资源名、`前端库` 类型和当前应用链路选择依赖。找到库后读取根目录的 `meta.json` 并返回：

| 字段 | 含义 |
| --- | --- |
| `jsEntryUrl` | JS 入口的访问地址 |
| `cssEntryUrl` | 以 JS 所在目录拼接出的 CSS 地址，仅在实际配置了 `metaJson.css.entry` 时使用 |
| `metaJson` | 读取到的库描述文件 |
| `baseUrl` | JS 入口所在目录的 URL |
| `version` | 依赖树中解析到的版本 |

找不到匹配依赖或读取 `meta.json` 未成功时，当前实现可返回 `undefined`。还应检查请求异常、依赖和实际文件授权。

### loadLibraryJs

`loadLibraryJs(jsEntryUrl, metaJson)` 插入脚本并异步读取 `metaJson.nameSpace` 下的 UMD 导出，使用 `getLibraryEntryUrls` 返回的完整 URL。脚本执行但命名空间缺失时可能得到 `undefined`。当前实现只等脚本的 `load` 事件，网络错误时也应检查浏览器请求和错误日志。

### loadLibraryCss

`loadLibraryCss(cssEntryUrl)` 插入样式链接。此方法返回 `void`，样式是否成功加载应在浏览器验证。

### dependencyTrees

当前运行时以顶层展品 ID 为键缓存查询到的依赖数据。此属性用于排查当前实例的解析过程，需要实时依赖时使用 [getSelfDep](/runtime/api/widget#getselfdep)。
