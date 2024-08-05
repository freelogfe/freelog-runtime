---
outline: deep
title: 2222
---

# 插件

## getStaticPath

**用途：获取图片字体等静态作品的正确路径**

```ts
**参数说明**
 (
  path: string  以"/"开头的路径
 )

**用法**
const path =  window.freelogApp.getStaticPath(path);
```

## nodeInfo

**用途：获取节点信息**

```ts
const nodeInfo = freelogApp.nodeInfo;
```

**返回说明**：

| 字段                 | 字段类型 | 字段说明 |
| :------------------- | :------- | :------- |
| nodeName             | string   | 节点名称 |
| tags                 | array    | 标签数组 |
| nodeLogo             | string   | 节点图标 |
| nodeTitle            | string   | 节点标题 |
| nodeShortDescription | string   | 节点简介 |

<!-- ## devData

**用途：开发过程中获取当前 url 中 dev 后面的数据，详情解释待完善**

```ts
**用法**
const data = freelogApp.devData;
``` -->

**返回示例**

```json
{
  "type": 1,
  "params": { "dev": "https://localhost:8103", "f27307a": "/exhibit-sub" },
  "config": { "vconsole": false }
}
```

## getCurrentUrl

**用途：获取当前 完整 url**

```ts
**用法**
const url = freelogApp.getCurrentUrl();
```

## getSelfWidgetRenderName

**用途：获取插件自身渲染名称，一般用于单独调试某个插件 也就是 dev 的 replace 模式，方便知道自己的渲染名称**

```ts
**用法**
const selfWidgetRenderName = freelogApp.getSelfWidgetRenderName();
```

## getTopExhibitId

**用途：获取当前插件的自身或顶层展品 id，也就是依赖树最上层的展品 id**

**场景一：主当前插件是展品插件，获取自身展品 id**
**场景二：主当前插件是展品依赖树中的资源作为插件，获取最上层的展品 id**

```ts
**用法**
const topExhibitId = freelogApp.getTopExhibitId();
```

## getSelfDependencyTree

**用途：获取插件自身依赖**

```ts
**用法**
// 运行时加载主题时已经传递了 dependencyTree
// 如果主题或插件调用mountExhibitWidget、mountArticleWidget时传递了dependencyTree
const dependencyTree: ExhibitDependencyNodeInfo = await freelogApp.getSelfDependencyTree();

// 如果没有传递dependencyTree，或者想要强制通过网络从平台获取
const dependencyTree: ExhibitDependencyNodeInfo = await freelogApp.getSelfDependencyTree(true);


**返回对象说明**

interface DepType {
  nid: string;
  articleId: string;
  articleName: string;
  articleType: number;
  version: string;
  versionRange: string;
  resourceType: string[];
  versionId: string;
  deep: number;
  parentNid: string;
}
type ExhibitDependencyNodeInfo =  DepType[]


```

**字段说明：**

| 返回值字段   | 字段类型 | 字段说明                                                     |
| :----------- | :------- | :----------------------------------------------------------- |
| nid          | string   | 依赖 ID(指的是此依赖在依赖树上的 id,用来确定依赖的唯一性)    |
| articleId    | string   | 作品 ID,配合作品类型一起理解. 例如类型是资源,此处就是资源 ID |
| articleName  | string   | 作品名称                                                     |
| articleType  | number   | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象)   |
| version      | string   | 版本号                                                       |
| versionRange | string   | semver 版本范围                                              |
| resourceType | stirng[] | 作品资源类型                                                 |
| deep         | number   | 该依赖在依赖树中的层级                                       |
| parentNid    | string   | 父级依赖 ID                                                  |

## getSelfProperty

**用途：获取插件自身属性**

```ts
**用法**
// 运行时加载主题时已经传递了 property
// 如果主题或插件调用mountExhibitWidget、mountArticleWidget时传递了property
const propery = await freelogApp.getSelfProperty();

// 如果没有传递property，或者想要强制通过网络从平台获取
const propery = await freelogApp.getSelfProperty(true);

**返回对象说明**

propery: 普通对象，上层传递或直接从平台获取的作品与展品配置的属性

```

## mountExhibitWidget

## mountArticleWidget

**用途：mountExhibitWidget 加载展品插件，mountArticleWidget 加载作品插件**

```ts
**参数说明**
  mountExhibitWidget(options: MountExhibitWidgetOptions);
  mountArticleWidget(options: MountArticleWidgetOptions);
  interface MountExhibitWidgetOptions {
    /**
     * 展品id
     */
    exhibitId: any;
    /**
     * 挂载的容器
     */
    container: HTMLElement;
    /**
     * 插件渲染可选项，包括数据传递，以及渲染时需要的额外数据
     */
    renderWidgetOptions?: RenderWidgetOptions;
    /**
     * 展品或作品的属性
     */
    property?: PlainObject;
    /**
     * 展品或作品的依赖
     */
    dependencyTree?: ExhibitDependencyNodeInfo[];
    /**
     * 挂载的序号，当同时家载多次时需要
     */
    seq?: number;
    /**
     * 开发模式下，本地调试地址
     */
    widget_entry?: string;
  }
  interface MountArticleWidgetOptions {
    /**
     * 作品id
     */
    articleId: any;
    /**
     * 父展品或作品的链路id
     */
    parentNid: string;
    /**
     * 作品的链路id
     */
    nid: string;
    /**
     * 顶层展品的展品id
     */
    topExhibitId: string;
    /**
     * 挂载的容器
     */
    container: HTMLElement;
    /**
     * 插件渲染可选项，包括数据传递，以及渲染时需要的额外数据
     */
    renderWidgetOptions?: RenderWidgetOptions;
    /**
     * 展品或作品的属性
     */
    property?: PlainObject;
    /**
     * 展品或作品的依赖
     */
    dependencyTree?: ExhibitDependencyNodeInfo[];

    /**
     * 挂载的序号，当同时家载多次时需要
     */
    seq?: number;
    /**
     * 开发模式下，本地调试地址
     */
    widget_entry?: string;
  }
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


**用法**

let widgetController: WidgetController = await freelogApp.mountExhibitedWidget(options)
let widgetController: WidgetController = await freelogApp.mountArticleWidget(options)

**返回对象说明**

interface WidgetController {
  success: boolean;
  name: string; // 子插件渲染id  widgetRenderName
  unmount: (options?: unmountAppParams) => Promise<boolean>;// 卸载插件
  reload: (destroy?: boolean) => Promise<boolean>; // 重载插件
  // 具体信息请参考《数据通信》文档。
  setData: (data: Record<PropertyKey, unknown>) => any; // 发送数据给子插件，子插件通过freelogApp.addDataListener监听获取
  getData:()=>any; // 返回父插件下发的data数据
  forceSetData:(data: Record<PropertyKey, unknown>) => any; // 方法拥有和 setData 一样的参数和行为，唯一不同的是 forceSetData 会强制发送数据，无论数据是否变化
  clearData: ()=> void; // 清除发送给子插件的数据
  addDataListener: (dataListener: Function, autoTrigger?: boolean) => any;// 监听子插件dipatch过来的数据
  removeDataListener: (dataListener: Function) => any;
  clearDataListener: () => any;
}

```

**加载自身依赖的插件示例**

```ts
**用法**
const subData: ExhibitDependencyNodeInfo[] = await freelogApp.getSelfDependencyTree();
subData.forEach(async (sub: ExhibitDependencyNodeInfo) => {
  if (sub.articleName === "snnaenu/插件开发演示代码插件") {
    selfWidget = await freelogApp.mountArticleWidget({
      articleId: sub.articleId,
      parentNid: sub.parentNid,
      nid: sub.nid,
      topExhibitId: freelogApp.getTopExhibitId(),
      container: document.getElementById("freelog-self") as HTMLElement, // 必传，自定义一个让插件挂载的div容器
      renderWidgetOptions: {
        data: {
          name: "自身依赖插件",
          registerApi: (api: any) => {
            selfWidgetApi.value = api;
          },
        },
        lifeCycles: {
          mounted: (e: CustomEvent) => {
            console.log(e, "mounted");
          },
        },
      },
      seq: 0, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
      widget_entry: "https://localhost:8102", // 本地url，dev模式下，可以使用本地url调试子插件
    });
  }
});
```

**加载展品插件示例**

```ts
**用法**
const res: GetExhibitListByPagingResult = await freelogApp.getExhibitListByPaging({
        articleResourceTypes: "插件",
        isLoadVersionProperty: 1,
      });
const widgets = res.data.data?.dataList;

widgets.forEach(async (widget: ExhibitInfo, index: number) => {
  if (widget.articleInfo.articleName == "snnaenu/插件开发演示代码插件") {
    exhibitWidget = await freelogApp.mountExhibitWidget({
      exhibitId: widget.exhibitId,
      container: document.getElementById("freelog-exhibit") as HTMLElement, // 必传，自定义一个让插件挂载的div容器
      property: widget.versionInfo?.exhibitProperty,
      dependencyTree: widget.versionInfo?.dependencyTree,
      renderWidgetOptions: {
        data: {
          name: "展品插件",
          registerApi: (api: any) => {
            exhibitWidgetApi.value = api;
          },
        },
      },
      seq: 1, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
      widget_entry: "https://localhost:8102", // 本地url，dev模式下，可以使用本地url调试子插件
    });
    return true;
  }
  return false;
});
```

## reload

**用途：整个网页重载（仅主题可用，插件可访问主题开发者提供的方法进行全局刷新）**

```ts
**用法**
freelogApp.reload()
```

## setViewport

**用途：设置 viewport 的 meta；仅主题可用**

```ts
**用法**
freelogApp.setViewport(keys: any)
keys = {
  width: "device-width",
  height: "device-height",
  "initial-scale": 1,
  "maximum-scale": 1,
  "minimum-scale": 1,
  "user-scalable": "no",
  "viewport-fit": "auto",
}
```
