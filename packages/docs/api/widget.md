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
| `tags`                 | `array`  | 标签数组   |
| `nodeLogo`             | `string` | 节点图标   |
| `nodeTitle`            | `string` | 节点标题   |
| `nodeShortDescription` | `string` | 节点简介   |
| `ownerUserName`        | `string` | 节点拥有者 |

### 返回示例

```json
{
  "nodeName": "示例节点",
  "tags": ["开发", "测试"],
  "nodeLogo": "https://cdn.freelog.cn/logo.png",
  "nodeTitle": "示例节点标题",
  "nodeShortDescription": "这是一个节点简介。"
}
```

## getCurrentUrl

**用途**：获取当前节点的完整 URL；可选传入`path`参数，获取当前主题插件指定自身路由路径的 URL。

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
- **场景 2**：当前应用是插件, 获取的是依赖树中的根 ID(主题 ID)。

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
const exhibitId = await freelogApp.getTopExhibitId();

const res = await freelogApp.getExhibitDepInfo(exhibitId, {
  articleNids: articleNid,
});
console.log(res);
```

## getSelfDepForTheme

**用途**：获取主题自身的依赖列表，通过 parentId 与 nid 自行转换树结构。

### 使用示例

```ts
// 这里不需要await,运行时直接提供主题的依赖列表和属性，如需实时数据请使用 getSelfDep
const dependencyTree = freelogApp.getSelfDepForTheme();
console.log(dependencyTree);
```

## getSelfDep

**用途**：实时获取主题或插件自身的依赖列表，通过 parentId 与 nid 自行转换树结构。

### 使用示例

```ts
const dependencyTree = await freelogApp.getSelfDep();
console.log(dependencyTree);
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

**用途**：获取主题的自身的属性。(配置页: 节点管理 > 主题管理 > 编辑 > 更多设置 > 可选配置)

### 使用示例

```ts
// 这里不需要await,运行时直接提供主题的属性，如需实时数据请使用 getSelfProperty
const property = freelogApp.getSelfPropertyForTheme();
console.log(property);
```

## getSelfProperty

**用途**：实时获取主题、插件自身的属性。

### 使用示例

```ts
// 实时
const property = await freelogApp.getSelfProperty();
console.log(property);
```

## mountExhibitWidget

**用途**：加载展品插件。

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

### renderWidgetOptions 说明

<details>
<summary>点击展开/折叠内容</summary>

```ts
interface RenderWidgetOptions {
  /**
   *  是否切换为iframe沙箱，可选
   */
  iframe?: boolean;
  /**
   * 开启内联模式运行js，可选
   */
  inline?: boolean;
  /**
   * 关闭虚拟路由系统，可选
   */
  "disable-memory-router"?: boolean;
  /**
   * 指定默认渲染的页面，可选
   */
  "default-page"?: string;
  /**
   * 保留路由状态，可选
   */
  "keep-router-state"?: boolean;
  /**
   * 关闭子插件请求的自动补全功能，可选
   */
  "disable-patch-request"?: boolean;
  /**
   * 开启keep-alive模式，可选
   */
  "keep-alive"?: boolean;
  /**
   * 卸载时强制删除缓存资源，可选
   */
  destroy?: boolean;
  /**
   * 开启fiber模式，可选
   */
  fiber?: boolean;
  /**
   * 设置子插件的基础路由，可选
   */
  baseroute?: string;
  /**
   * 开启ssr模式，可选
   */
  ssr?: boolean;
  // shadowDOM?: boolean, // 开启shadowDOM，可选
  /**
   * 传递给子插件的数据，可选
   */
  data?: Object;
  /**
   * 获取子插件发送数据的监听函数，可选
   */
  onDataChange?: Function;
  /**
   * 注册子插件的生命周期
   */
  lifeCycles?: {
    /**
     * 加载资源前触发
     */
    created?(e: CustomEvent): void;
    /**
     * 加载资源完成后，开始渲染之前触发
     */
    beforemount?(e: CustomEvent): void;
    /**
     * 子插件渲染结束后触发
     */
    mounted?(e: CustomEvent): void;
    /**
     * 子插件卸载时触发
     */
    unmount?(e: CustomEvent): void;
    /**
     * 子插件渲染出错时触发
     */
    error?(e: CustomEvent): void;
    /**
     * 子插件推入前台之前触发（keep-alive模式特有）
     */
    beforeshow?(e: CustomEvent): void;
    /**
     * 子插件推入前台之后触发（keep-alive模式特有）
     */
    aftershow?(e: CustomEvent): void;
    /**
     * 子插件推入后台时触发（keep-alive模式特有）
     */
    afterhidden?(e: CustomEvent): void;
  };
}
```

</details>

### 使用示例

```ts
const widgetController = await freelogApp.mountExhibitWidget({
  exhibitId: "exampleId",
  container: document.getElementById("app"),
  renderWidgetOptions: {
    data: { message: "Hello World" },
  },
});

console.log(widgetController);
```

### 返回对象 widgetController 说明

<details open>
<summary>点击展开/折叠内容</summary>

```ts
interface WidgetController {
  /**
   * 子插件是否成功加载
   */
  success: boolean;
  /**
   * 子插件渲染id  widgetRenderName
   */
  name: string;
  /**
   * 卸载插件
   */
  unmount: (options?: unmountAppParams) => Promise<boolean>;
  /**
   *  @param destroy 重新渲染时是否彻底删除缓存值，可选
   */
  reload: (destroy?: boolean) => Promise<boolean>;
  /**
   * 获取子插件数据
   */
  getData: () => any;
  /**
   * 清除发送给子插件的数据
   */
  clearData: () => any;
  /**
   * 发送数据给子插件，子插件通过 widgetApi.addDataListener 监听获取
   */
  setData: (data: Record<PropertyKey, unknown>) => any;
  /**
   * 方法拥有和 setData 一样的参数和行为，唯一不同的是 forceSetData 会强制发送数据，无论数据是否变化
   */
  forceSetData: (data: Record<PropertyKey, unknown>) => any;
  /**
   * 监听子插件dipatch过来的数据
   * @param dataListener 监听函数
   * @param autoTrigger 是否立刻触发一次监听函数，默认值为 false
   */
  addDataListener: (dataListener: Function, autoTrigger?: boolean) => any;
  /**
   * 解绑监听函数
   * @param dataListener 监听函数
   */
  removeDataListener: (dataListener: Function) => any;
  /**
   * 清空所有绑定的监听函数
   */
  clearDataListener: () => any;
}
```

</details>

## mountArticleWidget

**用途**：加载作品插件，必须是主题或展品的依赖。

### 参数说明

| 参数                  | 类型          | 必填 | 说明                                                            |
| --------------------- | ------------- | ---- | --------------------------------------------------------------- |
| `articleId`           | `string`      | 是   | 作品 ID                                                         |
| `container`           | `HTMLElement` | 是   | 挂载容器                                                        |
| `parentNid`           | `string`      | 是   | 依赖树中的父 id,  可通过`getSelfDependencyTree `获取            |
| `nid`                 | `string`      | 是   | 依赖树中自已 id,  可通过`getSelfDependencyTree `获取            |
| `topExhibitId`        | `string`      | 是   | 展品 id,  可通过`getTopExhibitId`获取                           |
| `property`            | `object`      | 否   | 展品或作品的属性                                                |
| `dependencyTree`      | `object[]`    | 否   | 依赖树                                                          |
| `renderWidgetOptions` | `object`      | 否   | 渲染选项（参考 mountExhibitWidget 的 renderWidgetOptions 说明） |
| `seq`                 | `number`      | 否   | 挂载的序号，加载多次相同插件时必须填写,以保证唯一性             |
| `widget_entry`        | `string`      | 否   | 开发模式下，本地调试地址                                        |

### renderWidgetOptions 说明

[参考 mountExhibitWidget](#mountexhibitwidget)

### 使用示例

```ts
const widgetController = await freelogApp.mountExhibitWidget({
  exhibitId: "exampleId",
  container: document.getElementById("app"),
  renderWidgetOptions: {
    data: { message: "Hello World" },
  },
});

### 返回对象 widgetController 说明

[参考 mountExhibitWidget](#mountexhibitwidget)

console.log(widgetController);
```

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

# 总结

通过以上 API，开发者可以高效地管理 Freelog 插件，包括获取静态资源、节点信息、自身依赖以及插件挂载等功能，满足不同场景的开发需求。
