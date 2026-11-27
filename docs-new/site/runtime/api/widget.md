---
outline: 2
---

# 主题/插件相关 API 文档

## nodeInfo

**用途**：获取当前节点的信息，包括节点名称、标签、图标等。

### 使用示例

```ts
const nodeInfo = freelogApp.nodeInfo;
console.log(nodeInfo);
```

### 返回字段说明

| 字段                   | 类型     | 说明       |
| ---------------------- | -------- | ---------- |
| `nodeName`             | `string` | 节点名称   |
| `tags`                 | `string[]` | 标签数组   |
| `nodeLogo`             | `string` | 节点图标，可选   |
| `nodeTitle`            | `string` | 节点标题，可选   |
| `nodeShortDescription` | `string` | 节点简介，可选   |
| `ownerUserName`        | `string` | 节点拥有者 |
| `ownerUserId`          | `number` | 节点拥有者 ID |

### 返回示例

```json
{
  "nodeName": "示例节点",
  "tags": ["开发", "测试"],
  "nodeLogo": "https://cdn.freelog.cn/logo.png",
  "nodeTitle": "示例节点标题",
  "nodeShortDescription": "这是一个节点简介。",
  "ownerUserName": "example",
  "ownerUserId": 123
}
```

## getCurrentUrl

无参数时返回当前节点页面的完整 URL。传入 `path` 时，当前实现会查找现有查询字符串中以自身渲染名为键的项，替换其值并返回节点根路径的 URL。此方式适用于已经有该查询项的 `search` 模式页面。需要主动导航时使用[应用路由](/runtime/integration/router#导航)。

### 参数说明

| 参数   | 类型     | 必填 | 说明                               |
| ------ | -------- | ---- | ---------------------------------- |
| `path` | `string` | 可选 | 当前主题或插件想要指定的路由路径。 |

### 使用示例

```ts
// 获取当前节点的完整 URL,并修改当前主题插件的路由为 /myroute?a=1&b=2
const url = freelogApp.getCurrentUrl("/myroute?a=1&b=2");
console.log(url);
```

## getSelfWidgetRenderName

**用途**：获取插件自身的渲染名称，通常用于单独调试插件时使用（如 dev 模式）。

### 使用示例

```ts
const renderName = freelogApp.getSelfWidgetRenderName();
console.log(renderName);
```

## getTopExhibitId

**用途**：获取依赖树的根 id。

### 使用场景

- **场景 1**：当前应用是展品，获取的是自身的展品 ID。
- **场景 2**：当前应用是插件, 获取的是当前依赖链所属的顶层展品 ID；可以是主题展品，也可以是独立挂载的插件展品。

### 使用示例

```ts
const topExhibitId = freelogApp.getTopExhibitId();
console.log(topExhibitId);
```

## getSelfNid

**用途**：获取当前插件在依赖树中的 ID(即 nid)。

### 使用示例

```ts
const articleNid = freelogApp.getSelfNid();
const exhibitId = freelogApp.getTopExhibitId();

const res = await freelogApp.getExhibitDepInfo(exhibitId, {
  articleNids: articleNid,
});
console.log(res);
```

## getSelfDepForTheme

同步返回当前组件挂载时保存的 `dependencyTree`，缺失时为空数组；不发送请求，不保证线上实时性。

**用途**：获取主题自身的依赖列表，通过 parentNid 与 nid 自行转换树结构。

### 使用示例

```ts
// 这里不需要await,运行时直接提供主题的依赖列表和属性，如需实时数据请使用 getSelfDep
const dependencyTree = freelogApp.getSelfDepForTheme();
console.log(dependencyTree);
```

## getSelfDep

返回 `Promise<AxiosResponse>`，业务数据在 `res.data.data`。当前实现设置了组件 `nid` 时仅保留 `parentNid === nid` 的条目；没有 `nid` 时才返回完整树，不能无条件把此方法当成整树查询。`getSelfDependencyTree` 不是当前公开 API。

**用途**：实时获取主题或插件自身的依赖列表，通过 parentNid 与 nid 自行转换树结构。

### 使用示例

```ts
const res = await freelogApp.getSelfDep();
if (res?.data?.ret === 0 && res.data.errCode === 0) {
  console.log(res.data.data);
}
```

### 返回字段说明

| 字段           | 类型       | 说明                      |
| -------------- | ---------- | ------------------------- |
| `nid`          | `string`   | 依赖 ID                   |
| `articleId`    | `string`   | 作品 ID                   |
| `articleName`  | `string`   | 作品名称                  |
| `articleType`  | `number`   | 作品类型（1：独立资源等） |
| `version`      | `string`   | 版本号                    |
| `resourceType` | `string[]` | 资源类型                  |
| `deep`         | `number`   | 依赖的层级                |
| `parentNid`    | `string`   | 父级依赖 ID               |

## getSelfPropertyForTheme

同步返回当前组件挂载时保存的 `property`，缺失时为空对象；不是 Axios 响应，不自行合并作者配置与节点配置。

**用途**：获取主题的自身的属性。(配置页: 节点管理 > 主题管理 > 编辑 > 更多设置 > 可选配置)

### 使用示例

```ts
// 这里不需要await,运行时直接提供主题的属性，如需实时数据请使用 getSelfProperty
const property = freelogApp.getSelfPropertyForTheme();
console.log(property);
```

## getSelfProperty

返回 `Promise<AxiosResponse>`，业务属性在 `res.data.data`。

> **已知实现限制**：展品分支读取 `versionInfo.exhibitProperty`；依赖插件分支当前调用 `getExhibitDepInfo` 缺少 `await`，会提前返回依赖信息的原始响应，未可靠地提取 `articleProperty` 或更新属性缓存。必要时显式查询 `getExhibitDepInfo(topExhibitId, { articleNids: nid })` 并读取匹配条目的 `articleProperty`。本次只整理文档，不修改实现。

**用途**：实时获取主题、插件自身的属性。

### 使用示例

```ts
// 当前示例适用于展品身份；依赖插件请按上方已知限制处理
const res = await freelogApp.getSelfProperty();
if (res?.data?.ret === 0 && res.data.errCode === 0) {
  console.log(res.data.data);
}
```

## mountExhibitWidget

`property` 和 `dependencyTree` 是传入组件上下文的数据；`renderWidgetOptions.data` 是组件通信，不是持久化的版本属性或可选配置。`widget_entry` 仅在运行时开发模式下替换代码入口，不创建展品、依赖或授权。同一组件多次挂载应传入不同的 `seq`。

**用途**：按展品 ID 加载主题/插件类型的展品；主题启动由运行时负责，主题内加载其他独立插件展品时调用本方法。

### 参数说明

| 参数                  | 类型          | 必填 | 说明                                                |
| --------------------- | ------------- | ---- | --------------------------------------------------- |
| `exhibitId`           | `string`      | 是   | 展品 ID                                             |
| `container`           | `HTMLElement` | 是   | 挂载容器                                            |
| `property`            | `object`      | 否   | 展品或作品的属性                                    |
| `dependencyTree`      | `object[]`    | 否   | 依赖树                                              |
| `renderWidgetOptions` | `object`      | 否   | 渲染选项（如数据传递等）                            |
| `seq`                 | `number`      | 否   | 挂载的序号，加载多次相同插件时必须填写,以保证唯一性 |
| `widget_entry`        | `string`      | 否   | 开发模式下，本地调试地址                            |

### renderWidgetOptions 说明 {#renderwidgetoptions-说明}

| 选项 | 类型 | 用途 |
| --- | --- | --- |
| `iframe` | `boolean` | 使用 iframe 沙箱。使用 Vite 等工具生成浏览器模块脚本的子插件需要此模式。 |
| `router-mode` | `'search' \| 'pure' \| 'state'` | 子插件虚拟路由模式，默认 `search`。 |
| `default-page` | `string` | 没有更优先的路由记录时使用的内部路径。 |
| `keep-router-state` | `boolean` | 常规卸载后保留该实例的路由位置。 |
| `keep-alive` | `boolean` | 隐藏时保留实例，恢复通过 `aftershow` 确认。 |
| `destroy` | `boolean` | 卸载时销毁实例并清理运行时缓存。 |
| `inline` | `boolean` | 将运行时处理的脚本内联执行。 |
| `fiber` | `boolean` | 分批处理资源任务。 |
| `disable-patch-request` | `boolean` | 关闭子应用请求的自动路径补全。 |
| `data` | `object` | 初始业务数据，运行时将注入 `freelogApp`。 |
| `onDataChange` | `(event: CustomEvent) => void` | 监听子插件发送的数据，数据位于 `event.detail.data`。 |
| `lifeCycles` | `object` | 在父应用监听 `created`、`beforemount`、`mounted`、`unmount`、`error` 以及保活的 `afterhidden`、`beforeshow`、`aftershow`。 |

运行时保留沙箱和样式隔离。接口用法见[应用路由](/runtime/integration/router)、[保活](/runtime/integration/keep-alive)和[数据通信](/runtime/integration/data)。


### 使用示例

```ts
const container = document.getElementById("plugin-container");
if (!container) throw new Error("缺少插件挂载容器");

const widgetController = await freelogApp.mountExhibitWidget({
  exhibitId, // 当前节点已配置的插件展品 ID
  container,
  renderWidgetOptions: {
    data: { message: "Hello World" },
  },
});

if (!widgetController.success) throw new Error("插件挂载失败");
```

### 返回对象 widgetController 说明

| 字段或方法 | 行为 |
| --- | --- |
| `success` | 首次挂载收到 `mounted` 时为 `true`、收到 `error` 时为 `false`。读取展品或其文件入口失败也可能在返回控制器之前抛错。 |
| `name` | 运行时生成的实例渲染名称，可用于[路由导航](/runtime/integration/router#导航)。 |
| `unmount(options?)` | 返回 `Promise<boolean>`。保活实例默认隐藏。传入 `{ clearAliveState: true }` 执行卸载，传入 `{ destroy: true }` 时还删除运行时缓存。 |
| `reload(destroy?)` | 重新加载实例，返回 `Promise<boolean>`。可传 `true` 清理运行时缓存后再加载。 |
| `getData()` | 读取子插件发送的数据，尚无消息时可返回 `null`。 |
| `clearData()` | 清除父应用发送给子插件的数据。 |
| `setData(data)` | 向子插件发送一次数据更新，参数为普通对象。 |
| `forceSetData(data)` | 发送数据更新，重复载荷也会触发通知。 |
| `addDataListener(listener, autoTrigger?)` | 监听子插件发送的数据。第二个参数为 `true` 时可立即收到已有数据。 |
| `removeDataListener(listener)` | 移除指定回调，使用原函数引用。 |
| `clearDataListener()` | 清空父应用对该子实例的监听。 |

保活恢复时使用 `lifeCycles.aftershow` 确认，详见[保活与生命周期](/runtime/integration/keep-alive)。


## mountArticleWidget

**用途**：加载当前展品依赖链中的插件，必须提供顶层展品 ID 和链路 `nid`。不负责声明依赖或签约。

### 参数说明

| 参数                  | 类型          | 必填 | 说明                                                            |
| --------------------- | ------------- | ---- | --------------------------------------------------------------- |
| `articleId`           | `string`      | 是   | 作品 ID                                                         |
| `container`           | `HTMLElement` | 是   | 挂载容器                                                        |
| `parentNid`           | `string`      | 是   | 依赖树中的父 id,  可通过 `getSelfDep()` 返回的 `res.data.data` 获取            |
| `nid`                 | `string`      | 是   | 依赖树中自已 id,  可通过 `getSelfDep()` 返回的 `res.data.data` 获取            |
| `topExhibitId`        | `string`      | 是   | 展品 id,  可通过`getTopExhibitId`获取                           |
| `property`            | `object`      | 否   | 展品或作品的属性                                                |
| `dependencyTree`      | `object[]`    | 否   | 依赖树                                                          |
| `renderWidgetOptions` | `object`      | 否   | 渲染选项（参考 mountExhibitWidget 的 renderWidgetOptions 说明） |
| `seq`                 | `number`      | 否   | 挂载的序号，加载多次相同插件时必须填写,以保证唯一性             |
| `widget_entry`        | `string`      | 否   | 开发模式下，本地调试地址                                        |

### renderWidgetOptions 说明

[与 mountExhibitWidget 使用同一组选项](#renderwidgetoptions-说明)。

### 使用示例

先读取可用依赖，再把选中的链路身份传入挂载方法。不能只填任意资源 ID。

```ts
const res = await freelogApp.getSelfDep();
if (res?.data?.ret !== 0 || res.data.errCode !== 0) {
  throw new Error("读取依赖失败");
}
// 同一资源可能出现在多条链路，按已选中的 nid 定位具体依赖
const dependency = res.data.data.find((item) => item.nid === "selectedDependencyNid");
if (!dependency) throw new Error("未找到指定依赖");
const container = document.getElementById("plugin-container");
if (!container) throw new Error("缺少插件挂载容器");
const widgetController = await freelogApp.mountArticleWidget({
  articleId: dependency.articleId,
  parentNid: dependency.parentNid,
  nid: dependency.nid,
  topExhibitId: freelogApp.getTopExhibitId(),
  container,
  seq: 1,
  renderWidgetOptions: { data: { message: "Hello World" } },
});
if (!widgetController.success) throw new Error("依赖插件挂载失败");
```

### 返回对象 widgetController 说明

[参考 mountExhibitWidget](#mountexhibitwidget)。组件挂载不替代资源授权检查。

## reload

**用途**：重载整个网页（仅限主题可用）。

### 使用示例

```ts
freelogApp.reload();
```

## setViewport

**用途**：设置 `viewport` 的 meta 信息（仅主题可用）。

### 使用示例

```ts
freelogApp.setViewport({
  width: "device-width",
  "initial-scale": 1,
  "maximum-scale": 1,
  "user-scalable": "no",
});
```

## getStaticPath

**用途**：获取指定静态资源（如图片、字体等）的正确路径。

### 参数说明

| 参数   | 类型     | 必填 | 说明               |
| ------ | -------- | ---- | ------------------ |
| `path` | `string` | 是   | 以`/` 开头的路径。 |

### 使用示例

```ts
const path = freelogApp.getStaticPath("/assets/image.png");
console.log(path);
```
