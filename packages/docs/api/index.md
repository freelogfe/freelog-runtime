---
outline: deep
---

# freelogApp

### 阅读说明

**下面所有接口都挂在 freelogApp 对象上**

**文中参数说明“:”后面的为类型，类型后面是具体解释**

**文中参数类型为 number 的'是否'都用 1 和 0 传递**

**网络请求使用axios@0.21.1**

[查看返回状态码说明](/api/#ret-一级状态码)

## 插件

### nodeInfo

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

<!-- ### devData

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

### getCurrentUrl

**用途：获取当前 完整 url**

```ts
**用法**
const url = freelogApp.getCurrentUrl();
```

### getSelfWidgetRenderName

**用途：获取插件自身渲染名称，一般用于单独调试某个插件 也就是 dev 的 replace 模式，方便知道自己的渲染名称**

```ts
**用法**
const selfWidgetRenderName = freelogApp.getSelfWidgetRenderName();
```

### getTopExhibitId

**用途：获取当前插件的自身或顶层展品 id，也就是依赖树最上层的展品 id**

**场景一：主当前插件是展品插件，获取自身展品 id**
**场景二：主当前插件是展品依赖树中的资源作为插件，获取最上层的展品 id**

```ts
**用法**
const topExhibitId = freelogApp.getTopExhibitId();
```

### getSelfDependencyTree

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

### getSelfProperty

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

### mountExhibitWidget

### mountArticleWidget

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

### reload

**用途：整个网页重载（仅主题可用，插件可访问主题开发者提供的方法进行全局刷新）**

```ts
**用法**
freelogApp.reload()
```

### setViewport

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

## 展品获取

### getExhibitListByPaging

**用途：分页获取展品**

```ts
**参数说明**
  参见“query 可选参数”

**用法**
const res = await freelogApp.getExhibitListByPaging({
  skip: 0,
  limit: 20,
});
```

**query 可选参数**

| 参数                    | 必选 | 类型及范围    | 说明                                                         |
| :---------------------- | :--- | :------------ | :----------------------------------------------------------- |
| skip                    | 可选 | number        | 跳过的数量.默认为 0.                                         |
| limit                   | 可选 | number        | 本次请求获取的数据条数.一般不允许超过 100                    |
| sort                    | 可选 | string        | 排序,格式为{排序字段}:{1\|-1},1 是正序,-1 是倒序             |
| articleResourceTypes    | 可选 | string        | 作品资源类型,多个用逗号分隔                                  |
| omitArticleResourceType | 可选 | string        | 忽略的作品资源类型,与 resourceType 参数互斥                  |
| onlineStatus            | 可选 | number        | 上线状态 (0:下线 1:上线 2:全部) 默认 1                       |
| tags                    | 可选 | string        | 用户创建 presentable 时设置的自定义标签,多个用","分割        |
| tagQueryType            | 可选 | number        | tags 的查询方式 1:任意匹配一个标签 2:全部匹配所有标签 默认:1 |
| projection              | 可选 | string        | 指定返回的字段,多个用逗号分隔                                |
| keywords                | 可选 | string[1,100] | 搜索关键字,目前支持模糊搜索节点资源名称和资源名称            |
| isLoadVersionProperty   | 可选 | number        | 是否响应展品版本属性                                         |
| isLoadPolicyInfo        | 可选 | number        | 是否加载策略信息.测试环境自动忽略此参数                      |
| isTranslate             | 可选 | number        | 是否同步翻译.测试环境自动忽略此参数                          |

**返回说明：**

| 返回值字段              | 字段类型 | 字段说明                                                     |
| :---------------------- | :------- | :----------------------------------------------------------- |
| exhibitId               | string   | 展品 ID                                                      |
| exhibitName             | string   | 展品名称                                                     |
| exhibitTitle            | string   | 展品标题                                                     |
| tags                    | string[] | 展品标签                                                     |
| intro                   | string   | 展品简介                                                     |
| coverImages             | string[] | 展品封面图                                                   |
| version                 | string   | 展品版本                                                     |
| onlineStatus            | number   | 上线状态 0:下线 1:上线                                       |
| exhibitSubjectType      | number   | 展品对应的标的物类型(1:资源 2:展品 3:用户组)                 |
| userId                  | number   | 展品的创建者 ID                                              |
| nodeId                  | number   | 展品所属节点 ID                                              |
| status                  | number   | 状态(0:正常)                                                 |
| policies                | object[] | 对外授权的策略组                                             |
| \*\* policyId           | string   | 策略 ID                                                      |
| \*\* policyName         | string   | 策略名称                                                     |
| \*\* status             | number   | 策略状态 0:下线(未启用) 1:上线(启用)                         |
| \*\* policyText         | string   | 策略文本                                                     |
| \*\* translateInfo      | object   | 翻译信息<详见策略翻译文档>                                   |
| \*\* fsmDescriptionInfo | object   | 策略状态机描述信息<策略语言编译对象>                         |
| articleInfo             | object   | 展品实际挂载的作品信息                                       |
| \*\* articleId          | string   | 作品 ID                                                      |
| \*\* articleName        | string   | 作品名称                                                     |
| \*\* resourceType       | string[] | 作品资源类型                                                 |
| \*\* articleType        | number   | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象)   |
| \*\* articleOwnerId     | number   | 作品所有者 ID                                                |
| \*\* articleOwnerName   | string   | 作品所有者名称                                               |
| versionInfo             | object   | 展品的版本信息,加载版本属性时,才会赋值                       |
| \*\*exhibitProperty     | object   | 展品的版本属性                                               |
| \*\*dependencyTree      | object[] | 展品的版本依赖树                                             |
| \*\*\*\*nid             | string   | 依赖 ID(指的是此依赖在依赖树上的 id,用来确定依赖的唯一性)    |
| \*\*\*\*articleId       | string   | 作品 ID,配合作品类型一起理解. 例如类型是资源,此处就是资源 ID |
| \*\*\*\*articleName     | string   | 作品名称                                                     |
| \*\*\*\*articleType     | number   | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象)   |
| \*\*\*\*version         | string   | 版本号                                                       |
| \*\*\*\*versionRange    | string   | semver 版本范围                                              |
| \*\*\*\*resourceType    | stirng[] | 作品资源类型                                                 |
| \*\*\*\*deep            | number   | 该依赖在依赖树中的层级                                       |
| \*\*\*\*parentNid       | string   | 父级依赖 ID                                                  |
| createDate              | date     | 创建日期                                                     |
| updateDate              | date     | 更新日期                                                     |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": {
    "skip": 0,
    "limit": 10,
    "totalItem": 10,
    "dataList": [
      {
        "exhibitId": "61430ab27d0f6c002ec76ade",
        "exhibitName": "哥斯达黎加蒙特祖玛的海岸线",
        "exhibitTitle": "哥斯达黎加蒙特祖玛的海岸线",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [
          "https://image.freelog.com/preview-image/3f78173235c2bead482ed68a6489f082195738c5.jpg"
        ],
        "version": "0.1.0",
        "policies": [
          {
            "policyId": "bdddfb1df2e27dedd1f7e65ff19743ed",
            "policyName": "免费订阅（包月）",
            "status": 1
          },
          {
            "policyId": "1a8a1aa4bd3441a2f578d83c1070282c",
            "policyName": "付费订阅（包月）",
            "status": 0
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "61430a71f27e48003f5e230e",
          "articleName": "chtes/哥斯达黎加蒙特祖玛的海岸线",
          "resourceType": "image",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "chtes"
        },
        "status": 0
      },
      {
        "exhibitId": "606568df32ae6505c4e795e5",
        "exhibitName": "markdown-theme",
        "exhibitTitle": "markdown-theme",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [],
        "version": "0.1.3",
        "policies": [
          {
            "policyId": "53eeaec402d6cbc118cb40ed652227bb",
            "policyName": "免费策略",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "605355cb347afb003a54ceea",
          "articleName": "Freelog/markdown-theme",
          "resourceType": "theme",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "Freelog"
        },
        "status": 0
      },
      {
        "exhibitId": "60092955894f9d002e311f94",
        "exhibitName": "基本概念",
        "exhibitTitle": "基本概念",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [],
        "version": "0.1.0",
        "policies": [
          {
            "policyId": "53eeaec402d6cbc118cb40ed652227bb",
            "policyName": "免费策略",
            "status": 1
          },
          {
            "policyId": "bdddfb1df2e27dedd1f7e65ff19743ed",
            "policyName": "免费订阅（包月）",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "60092939973b31003a4fbf3b",
          "articleName": "chtes/基本概念",
          "resourceType": "markdown",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "chtes"
        },
        "status": 0
      },
      {
        "exhibitId": "60079cac135f16002f3b4005",
        "exhibitName": "测试MD依赖图",
        "exhibitTitle": "测试MD依赖图",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [],
        "version": "0.1.0",
        "policies": [
          {
            "policyId": "53eeaec402d6cbc118cb40ed652227bb",
            "policyName": "免费策略",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "60079c59973b31003a4fbf2c",
          "articleName": "chtes/测试MD依赖图",
          "resourceType": "markdown",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "chtes"
        },
        "status": 0
      },
      {
        "exhibitId": "60069b95664533002e72f0eb",
        "exhibitName": "123456789012345678901234567890",
        "exhibitTitle": "狮子",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [
          "https://image.freelog.com/preview-image/6f8b324691c14490156715f125f0247421183432"
        ],
        "version": "0.0.1",
        "policies": [
          {
            "policyId": "53eeaec402d6cbc118cb40ed652227bb",
            "policyName": "免费策略",
            "status": 0
          },
          {
            "policyId": "1a8a1aa4bd3441a2f578d83c1070282c",
            "policyName": "付费订阅（包月）",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "5f2a5b8df2dbae002f1891f7",
          "articleName": "12345676789/123456789012345678901234567890",
          "resourceType": "json",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "12345676789"
        },
        "status": 0
      },
      {
        "exhibitId": "60069481664533002e72f0e9",
        "exhibitName": "pubu",
        "exhibitTitle": "pubu",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [
          "https://image.freelog.com/preview-image/25fed1339632dd0a75d8b96e4a6da7e1b4a89fd8"
        ],
        "version": "0.0.3",
        "policies": [
          {
            "policyId": "53eeaec402d6cbc118cb40ed652227bb",
            "policyName": "免费策略",
            "status": 1
          },
          {
            "policyId": "bdddfb1df2e27dedd1f7e65ff19743ed",
            "policyName": "免费订阅（包月）",
            "status": 1
          },
          {
            "policyId": "1a8a1aa4bd3441a2f578d83c1070282c",
            "policyName": "付费订阅（包月）",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "5f1f8ba540641d002ba34a8e",
          "articleName": "12345676789/pubu",
          "resourceType": "image",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "12345676789"
        },
        "status": 0
      },
      {
        "exhibitId": "60068ce3135f16002f3b4000",
        "exhibitName": "猫头鹰{}",
        "exhibitTitle": "猫头鹰{}",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [
          "https://image.freelog.com/preview-image/4f89e78533c0a82f15339bc049aaaf2ec1055ff8"
        ],
        "version": "0.0.3",
        "policies": [
          {
            "policyId": "53eeaec402d6cbc118cb40ed652227bb",
            "policyName": "免费策略",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "5f39faed57da85002e9e5cc5",
          "articleName": "12345676789/haveDep2",
          "resourceType": "image",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "12345676789"
        },
        "status": 0
      },
      {
        "exhibitId": "60068cb3664533002e72f0e7",
        "exhibitName": "dudu",
        "exhibitTitle": "dudu",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [
          "https://image.freelog.com/preview-image/5efa440b0659eb108ea56e47e7e13348e6b2608b"
        ],
        "version": "0.1.0",
        "policies": [
          {
            "policyId": "1a8a1aa4bd3441a2f578d83c1070282c",
            "policyName": "付费订阅（包月）",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "6005553fb71c95003921aa1a",
          "articleName": "yanghongtian/dudu",
          "resourceType": "image",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "yanghongtian"
        },
        "status": 0
      },
      {
        "exhibitId": "5fec4d7a00bb3f002edda327",
        "exhibitName": "testimage",
        "exhibitTitle": "testimage",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [
          "https://image.freelog.com/preview-image/4db8571f47de3d556a59e39ab5cfe5da7ffdd92b"
        ],
        "version": "4.2.0",
        "policies": [
          {
            "policyId": "53eeaec402d6cbc118cb40ed652227bb",
            "policyName": "免费策略",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "5f9fb45a6bb6b9002e348697",
          "articleName": "chtes/testimage",
          "resourceType": "image",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "chtes"
        },
        "status": 0
      },
      {
        "exhibitId": "5fec4d6d00bb3f002edda325",
        "exhibitName": "西班牙奥尔德萨和佩尔迪多山国家公园中的奥尔德萨峡谷",
        "exhibitTitle": "西班牙奥尔德萨和佩尔迪多山国家公园中的奥尔德萨峡谷",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [
          "https://image.freelog.com/preview-image/81ff6d47fba8e6e79a1e598250b5a6f0ce58d0df"
        ],
        "version": "2.0.2",
        "policies": [
          {
            "policyId": "1a8a1aa4bd3441a2f578d83c1070282c",
            "policyName": "付费订阅（包月）",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "5feacb45b851b5002e59d8cd",
          "articleName": "chtes/西班牙奥尔德萨和佩尔迪多山国家公园中的奥尔德萨峡谷",
          "resourceType": "image",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "chtes"
        },
        "status": 0
      }
    ]
  }
}
```

### getExhibitListById

**用途：查找展品**

```ts
**参数说明**
  query:{
    exhibitIds: string,  展品ids 多个使用","隔开
    isLoadVersionProperty: 0 | 1, 可选，是否加载版本信息,默认0
  }

**用法**
const res = await freelogApp.getExhibitListById(query)
```

**返回说明**

| 返回值字段              | 字段类型 | 字段说明                                                   |
| :---------------------- | :------- | :--------------------------------------------------------- |
| exhibitId               | string   | 展品 ID                                                    |
| exhibitName             | string   | 展品名称                                                   |
| exhibitTitle            | string   | 展品标题                                                   |
| tags                    | string[] | 展品标签                                                   |
| intro                   | string   | 展品简介                                                   |
| coverImages             | string[] | 展品封面图                                                 |
| version                 | string   | 展品版本                                                   |
| onlineStatus            | number   | 上线状态 0:下线 1:上线                                     |
| userId                  | number   | 展品的创建者 ID                                            |
| nodeId                  | number   | 展品所属节点 ID                                            |
| policies                | object[] | 对外授权的策略组                                           |
| \*\* policyId           | string   | 策略 ID                                                    |
| \*\* policyName         | string   | 策略名称                                                   |
| \*\* status             | number   | 策略状态 0:下线(未启用) 1:上线(启用)                       |
| \*\* policyText         | string   | 策略文本                                                   |
| \*\* translateInfo      | object   | 翻译信息<详见策略翻译文档>                                 |
| \*\* fsmDescriptionInfo | object   | 策略状态机描述信息<策略语言编译对象>                       |
| articleInfo             | object   | 展品实际挂载的作品信息                                     |
| \*\* articleId          | string   | 作品 ID                                                    |
| \*\* articleName        | string   | 作品名称                                                   |
| \*\* resourceType       | string   | 作品资源类型                                               |
| \*\* articleType        | number   | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象) |
| \*\* articleOwnerId     | number   | 作品所有者 ID                                              |
| \*\* articleOwnerName   | string   | 作品所有者名称                                             |
| versionInfo             | object   | 展品的版本信息,加载版本属性时,才会赋值                     |
| \*\*exhibitProperty     | object   | 展品的版本属性                                             |
| createDate              | date     | 创建日期                                                   |
| updateDate              | date     | 更新日期                                                   |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "exhibitId": "61430ab27d0f6c002ec76ade",
      "exhibitName": "哥斯达黎加蒙特祖玛的海岸线",
      "exhibitTitle": "哥斯达黎加蒙特祖玛的海岸线",
      "exhibitSubjectType": 2,
      "tags": [],
      "intro": "展品产品侧未提供简介字段",
      "coverImages": [
        "https://image.freelog.com/preview-image/3f78173235c2bead482ed68a6489f082195738c5.jpg"
      ],
      "version": "0.1.0",
      "policies": [
        {
          "policyId": "bdddfb1df2e27dedd1f7e65ff19743ed",
          "policyName": "免费订阅（包月）",
          "status": 1,
          "translateInfo": {
            "audienceInfos": [
              {
                "origin": {
                  "name": "public",
                  "type": "public"
                },
                "content": "公开（所有人可签约）"
              }
            ],
            "fsmInfos": [
              {
                "stateInfo": {
                  "origin": "initial",
                  "content": "初始状态"
                },
                "serviceStateInfos": [
                  {
                    "origin": "active",
                    "content": "已授权"
                  }
                ],
                "eventTranslateInfos": [
                  {
                    "origin": {
                      "id": "51f0371f1c8d49ee8168c69037f04216",
                      "name": "RelativeTimeEvent",
                      "args": {
                        "elapsed": 1,
                        "timeUnit": "month"
                      },
                      "state": "finish"
                    },
                    "content": "1个月之后，进入 终止状态"
                  }
                ]
              },
              {
                "stateInfo": {
                  "origin": "finish",
                  "content": "终止状态"
                },
                "serviceStateInfos": [],
                "eventTranslateInfos": []
              }
            ],
            "content": "\n初始状态[已授权]：\n\t1个月之后，进入 终止状态\n终止状态：\n\t\n"
          },
          "policyText": "for public\n\ninitial[active]:\n  ~freelog.RelativeTimeEvent(\"1\",\"month\") => finish\nfinish:\n  terminate",
          "fsmDescriptionInfo": {
            "initial": {
              "transitions": [
                {
                  "toState": "finish",
                  "service": "freelog",
                  "name": "RelativeTimeEvent",
                  "args": {
                    "elapsed": 1,
                    "timeUnit": "month"
                  },
                  "code": "A103",
                  "isSingleton": false,
                  "eventId": "51f0371f1c8d49ee8168c69037f04216"
                }
              ],
              "serviceStates": ["active"],
              "isInitial": true,
              "isAuth": true,
              "isTestAuth": false
            },
            "finish": {
              "transitions": [],
              "serviceStates": [],
              "isAuth": false,
              "isTestAuth": false,
              "isTerminate": true
            }
          }
        },
        {
          "policyId": "1a8a1aa4bd3441a2f578d83c1070282c",
          "policyName": "付费订阅（包月）",
          "status": 0,
          "translateInfo": {
            "audienceInfos": [
              {
                "origin": {
                  "name": "public",
                  "type": "public"
                },
                "content": "公开（所有人可签约）"
              }
            ],
            "fsmInfos": [
              {
                "stateInfo": {
                  "origin": "initial",
                  "content": "初始状态"
                },
                "serviceStateInfos": [],
                "eventTranslateInfos": [
                  {
                    "origin": {
                      "id": "d0d171a7f64c493da59a3cc80b049b21",
                      "name": "TransactionEvent",
                      "args": {
                        "amount": 10,
                        "account": "self.account"
                      },
                      "state": "auth"
                    },
                    "content": "支付 10枚 羽币，进入 状态auth"
                  }
                ]
              },
              {
                "stateInfo": {
                  "origin": "auth",
                  "content": "状态auth"
                },
                "serviceStateInfos": [
                  {
                    "origin": "active",
                    "content": "已授权"
                  }
                ],
                "eventTranslateInfos": [
                  {
                    "origin": {
                      "id": "b4ae32e9732b4bf0b69f5493bf51b8be",
                      "name": "RelativeTimeEvent",
                      "args": {
                        "elapsed": 1,
                        "timeUnit": "month"
                      },
                      "state": "finish"
                    },
                    "content": "1个月之后，进入 终止状态"
                  }
                ]
              },
              {
                "stateInfo": {
                  "origin": "finish",
                  "content": "终止状态"
                },
                "serviceStateInfos": [],
                "eventTranslateInfos": []
              }
            ],
            "content": "\n初始状态：\n\t支付 10枚 羽币，进入 状态auth\n状态auth[已授权]：\n\t1个月之后，进入 终止状态\n终止状态：\n\t\n"
          },
          "policyText": "for public\n\ninitial:\n  ~freelog.TransactionEvent(\"10\",\"self.account\") => auth\nauth[active]:\n  ~freelog.RelativeTimeEvent(\"1\",\"month\") => finish\nfinish:\n  terminate",
          "fsmDescriptionInfo": {
            "initial": {
              "transitions": [
                {
                  "toState": "auth",
                  "service": "freelog",
                  "name": "TransactionEvent",
                  "args": {
                    "amount": 10,
                    "account": "self.account"
                  },
                  "code": "S201",
                  "isSingleton": true,
                  "eventId": "d0d171a7f64c493da59a3cc80b049b21"
                }
              ],
              "serviceStates": [],
              "isInitial": true,
              "isAuth": false,
              "isTestAuth": false
            },
            "auth": {
              "transitions": [
                {
                  "toState": "finish",
                  "service": "freelog",
                  "name": "RelativeTimeEvent",
                  "args": {
                    "elapsed": 1,
                    "timeUnit": "month"
                  },
                  "code": "A103",
                  "isSingleton": false,
                  "eventId": "b4ae32e9732b4bf0b69f5493bf51b8be"
                }
              ],
              "serviceStates": ["active"],
              "isAuth": true,
              "isTestAuth": false
            },
            "finish": {
              "transitions": [],
              "serviceStates": [],
              "isAuth": false,
              "isTestAuth": false,
              "isTerminate": true
            }
          }
        }
      ],
      "onlineStatus": 1,
      "nodeId": 80000009,
      "userId": 50022,
      "articleInfo": {
        "articleId": "61430a71f27e48003f5e230e",
        "articleName": "chtes/哥斯达黎加蒙特祖玛的海岸线",
        "resourceType": "image",
        "articleType": 1,
        "articleOwnerId": 0,
        "articleOwnerName": "chtes"
      },
      "status": 0,
      "versionInfo": {
        "exhibitId": "61430ab27d0f6c002ec76ade",
        "exhibitProperty": {
          "fileSize": 747917,
          "width": 1920,
          "height": 1080,
          "type": "jpg",
          "mime": "image/jpeg"
        }
      }
    }
  ]
}
```

### getExhibitInfo

**用途：获取单个展品详情**

```ts
**参数说明**
  exhibitId: string,  展品id
  query:{
    isLoadVersionProperty: 0 | 1, 可选，是否加载版本信息,默认0
  }

**用法**
const res = await freelogApp.getExhibitInfo(exhibitId, query)
```

**返回说明**

| 返回值字段              | 字段类型 | 字段说明                                                     |
| :---------------------- | :------- | :----------------------------------------------------------- |
| exhibitId               | string   | 展品 ID                                                      |
| exhibitName             | string   | 展品名称                                                     |
| exhibitTitle            | string   | 展品标题                                                     |
| tags                    | string[] | 展品标签                                                     |
| intro                   | string   | 展品简介                                                     |
| coverImages             | string[] | 展品封面图                                                   |
| version                 | string   | 展品版本                                                     |
| onlineStatus            | number   | 上线状态 0:下线 1:上线                                       |
| exhibitSubjectType      | number   | 展品对应的标的物类型(1:资源 2:展品 3:用户组)                 |
| userId                  | number   | 展品的创建者 ID                                              |
| nodeId                  | number   | 展品所属节点 ID                                              |
| status                  | number   | 状态(0:正常)                                                 |
| policies                | object[] | 对外授权的策略组                                             |
| \*\* policyId           | string   | 策略 ID                                                      |
| \*\* policyName         | string   | 策略名称                                                     |
| \*\* status             | number   | 策略状态 0:下线(未启用) 1:上线(启用)                         |
| \*\* policyText         | string   | 策略文本                                                     |
| \*\* translateInfo      | object   | 翻译信息<详见策略翻译文档>                                   |
| \*\* fsmDescriptionInfo | object   | 策略状态机描述信息<策略语言编译对象>                         |
| articleInfo             | object   | 展品实际挂载的作品信息                                       |
| \*\* articleId          | string   | 作品 ID                                                      |
| \*\* articleName        | string   | 作品名称                                                     |
| \*\* resourceType       | string[] | 作品资源类型                                                 |
| \*\* articleType        | number   | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象)   |
| \*\* articleOwnerId     | number   | 作品所有者 ID                                                |
| \*\* articleOwnerName   | string   | 作品所有者名称                                               |
| versionInfo             | object   | 展品的版本信息,加载版本属性时,才会赋值                       |
| \*\*exhibitProperty     | object   | 展品的版本属性                                               |
| \*\*dependencyTree      | object[] | 展品的版本依赖树                                             |
| \*\*\*\*nid             | string   | 依赖 ID(指的是此依赖在依赖树上的 id,用来确定依赖的唯一性)    |
| \*\*\*\*articleId       | string   | 作品 ID,配合作品类型一起理解. 例如类型是资源,此处就是资源 ID |
| \*\*\*\*articleName     | string   | 作品名称                                                     |
| \*\*\*\*articleType     | number   | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象)   |
| \*\*\*\*version         | string   | 版本号                                                       |
| \*\*\*\*versionRange    | string   | semver 版本范围                                              |
| \*\*\*\*resourceType    | stirng[] | 作品资源类型                                                 |
| \*\*\*\*deep            | number   | 该依赖在依赖树中的层级                                       |
| \*\*\*\*parentNid       | string   | 父级依赖 ID                                                  |
| createDate              | date     | 创建日期                                                     |
| updateDate              | date     | 更新日期                                                     |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": {
    "exhibitId": "61430ab27d0f6c002ec76ade",
    "exhibitName": "哥斯达黎加蒙特祖玛的海岸线",
    "exhibitTitle": "哥斯达黎加蒙特祖玛的海岸线",
    "exhibitSubjectType": 2,
    "tags": [],
    "intro": "展品产品侧未提供简介字段",
    "coverImages": [
      "https://image.freelog.com/preview-image/3f78173235c2bead482ed68a6489f082195738c5.jpg"
    ],
    "version": "0.1.0",
    "policies": [
      {
        "policyId": "bdddfb1df2e27dedd1f7e65ff19743ed",
        "policyName": "免费订阅（包月）",
        "status": 1
      },
      {
        "policyId": "1a8a1aa4bd3441a2f578d83c1070282c",
        "policyName": "付费订阅（包月）",
        "status": 0
      }
    ],
    "onlineStatus": 1,
    "nodeId": 80000009,
    "userId": 50022,
    "articleInfo": {
      "articleId": "61430a71f27e48003f5e230e",
      "articleName": "chtes/哥斯达黎加蒙特祖玛的海岸线",
      "resourceType": "image",
      "articleType": 1,
      "articleOwnerId": 0,
      "articleOwnerName": "chtes"
    },
    "status": 0,
    "versionInfo": {
      "exhibitId": "61430ab27d0f6c002ec76ade",
      "exhibitProperty": {
        "fileSize": 747917,
        "width": 1920,
        "height": 1080,
        "type": "jpg",
        "mime": "image/jpeg"
      }
    }
  }
}
```

### getExhibitFileStream

**用途：获取展品作品文件**

```ts
**参数说明**
  exhibitId: string // 展品id，
  options: {
    returnUrl?: boolean; // 是否只返回url， 例如img标签图片只需要url
    config?: {
      onUploadProgress?: (progressEvent: any) => void;
      onDownloadProgress?: (progressEvent: any) => void;
      responseType?: ResponseType;
    };  // axios的config 目前仅支持"onUploadProgress",  "onDownloadProgress", "responseType"
    subFilePath?: string;  // 漫画中的图片等子文件的路径
  },

**用法**
const res = await freelogApp.getExhibitFileStream(
  exhibitId,
  {
    returnUrl,
    config
  }
)
```

### getExhibitDepInfo

**用途：批量查询展品依赖的作品信息**

```ts
**参数说明**
  exhibitId: string ,  // 展品id
  {articleNids: string}, // 展品依赖的作品NID(依赖树上的节点ID),多个用逗号分隔

**用法**
const res = await freelogApp.getExhibitDepInfo(
  exhibitId,
  {articleNids: string}
)
```

**返回说明**

| 返回值字段      | 字段类型 | 字段说明                                                   |
| :-------------- | :------- | :--------------------------------------------------------- |
| nid             | string   | 作品在展品依赖树上的节点 ID                                |
| articleId       | string   | 作品 ID                                                    |
| articleName     | string   | 作品名称                                                   |
| articleType     | number   | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象) |
| version         | string   | 作品的版本                                                 |
| resourceType    | string   | 作品的资源类型                                             |
| articleProperty | object   | 作品的属性                                                 |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "nid": "608667da52ab",
      "articleId": "60865bb6348128003490ae87",
      "articleName": "Freelog/novel-theme",
      "articleType": 1,
      "version": "0.1.3",
      "resourceType": "theme",
      "articleProperty": {
        "fileSize": 258027,
        "mime": "application/zip"
      }
    },
    {
      "nid": "c5da1573850f",
      "articleId": "607bd7e87d6b53002f251d03",
      "articleName": "Freelog/novel",
      "articleType": 1,
      "version": "0.1.7",
      "resourceType": "widget",
      "articleProperty": {
        "fileSize": 301818,
        "mime": "application/zip"
      }
    }
  ]
}
```

### getExhibitDepFileStream

**用途：获取展品子依赖作品文件**

```ts
**参数说明**
  exhibitId: string, // 自身展品id
  query: {
    parentNid: string; // 依赖树上的父级节点ID,一般获取展品子依赖需要传递
    subArticleId: string; // 子依赖的作品ID
    returnUrl?: boolean; // 是否只返回url， 例如img标签图片只需要url
    config?: {
      onUploadProgress?: (progressEvent: any) => void;
      onDownloadProgress?: (progressEvent: any) => void;
      responseType?: ResponseType;
    },   //  axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"
  }

**用法**
const res = await freelogApp.getExhibitDepFileStream(
  exhibitId,
  query:{
    parentNid,
    subArticleId,
    returnUrl
  }
)
```

### getExhibitSignCount

**用途：查找展品签约数量（同一个用户的多次签约只计算一次）**

```ts
**参数说明**
  exhibitIds: string,  // 用英文逗号隔开的一个或多个展品id

**用法**
const res = await freelogApp.getExhibitSignCount(exhibitIds)
```

**返回说明**

| 返回值字段 | 字段类型 | 字段说明                 |
| :--------- | :------- | :----------------------- |
| subjectId  | string   | 标的物 ID，这里是展品 id |
| count      | number   | 已签约的总数(已去重)     |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "subjectId": "60a754e0587d2500392a2874",
      "count": 5
    },
    {
      "subjectId": "61400b2940808e002e482d32",
      "count": 4
    }
  ]
}
```

### getExhibitAuthStatus

**用途：批量查询展品授权**

```ts
**参数说明**
  exhibitIds: string, // 用英文逗号隔开的一个或多个展品id

**用法**
const res = await freelogApp.getExhibitAuthStatus(exhibitIds)
```

**返回说明**

| 返回值字段            | 字段类型 | 字段说明                                                   |
| :-------------------- | :------- | :--------------------------------------------------------- |
| exhibitId             | string   | 展品 ID                                                    |
| exhibitName           | string   | 展品名称                                                   |
| referee               | number   | 做出授权结果的标的物服务类型(1:资源服务 2:展品服务)        |
| defaulterIdentityType | number   | 授权不通过责任方(0:无 1:资源 2:节点 4:c 端消费者 128:未知) |
| authCode              | number   | 授权码                                                     |
| isAuth                | boolean  | 是否授权通过                                               |
| errorMsg              | string   | 错误信息                                                   |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "exhibitId": "608667da52abf900867dfd48",
      "exhibitName": "novel-theme",
      "authCode": 200,
      "referee": 2,
      "defaulterIdentityType": 0,
      "isAuth": true,
      "errorMsg": ""
    }
  ]
}
```

### getExhibitAvailable

**用途：批量查询展品是否可用（即能否提供给用户签约）**

```ts
**参数说明**
  exhibitIds:: string,  // 用英文逗号隔开的一个或多个展品id

**用法**
const res = await freelogApp.getExhibitAvailable(exhibitIds)
```

**返回说明**

| 返回值字段            | 字段类型 | 字段说明                                                   |
| :-------------------- | :------- | :--------------------------------------------------------- |
| exhibitId             | string   | 展品 ID                                                    |
| exhibitName           | string   | 展品名称                                                   |
| referee               | number   | 做出授权结果的标的物服务类型(1:作品服务 2:展品服务)        |
| defaulterIdentityType | number   | 授权不通过责任方(0:无 1:作品 2:节点 4:c 端消费者 128:未知) |
| authCode              | number   | 授权码                                                     |
| isAuth                | boolean  | 是否授权通过                                               |
| errorMsg              | string   | 错误信息                                                   |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "exhibitId": "608667da52abf900867dfd48",
      "exhibitName": "novel-theme",
      "authCode": 200,
      "referee": 2,
      "defaulterIdentityType": 0,
      "isAuth": true,
      "errorMsg": ""
    }
  ]
}
```

### getSignStatistics

**用途：统计展品签约量**

```ts
**参数说明**
   query?: {
     keywords: string // 标的物名称，这里指展品名称
    }

**用法**
const res = await freelogApp.getSignStatistics(query)
```

**返回说明**

| 返回值字段     | 字段类型 | 字段说明                           |
| :------------- | :------- | :--------------------------------- |
| subjectId      | string   | 标的物 ID，这里指展品 id,exhibitId |
| subjectName    | string   | 标的物名称                         |
| policyIds      | string[] | 签约的策略                         |
| latestSignDate | date     | 最后签约日期                       |
| count          | number   | 签约次数                           |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "subjectId": "61e7b893f04747002e473d63",
      "subjectName": "nes",
      "policyIds": ["7daf80d238c6750761b21b5ac2af20c9"],
      "latestSignDate": "2022-01-20T06:48:55.720Z",
      "count": 1
    },
    {
      "subjectId": "61e9046637cb3c002ea8776a",
      "subjectName": "nes-redwhite",
      "policyIds": ["7daf80d238c6750761b21b5ac2af20c9"],
      "latestSignDate": "2022-01-20T06:48:55.081Z",
      "count": 1
    },
    {
      "subjectId": "61e6724d9dc4d5002e5b20c1",
      "subjectName": "hdjshdjka",
      "policyIds": ["bdddfb1df2e27dedd1f7e65ff19743ed"],
      "latestSignDate": "2022-01-18T07:55:28.558Z",
      "count": 1
    },
    {
      "subjectId": "61400b2940808e002e482d32",
      "subjectName": "gallery-theme",
      "policyIds": ["2665bd4e6e035c9dc0260cf8c7ee01b1"],
      "latestSignDate": "2022-01-18T03:24:58.641Z",
      "count": 1
    },
    {
      "subjectId": "60f92963a7f4d8002ef06d01",
      "subjectName": "novel-word",
      "policyIds": ["3104b19e139f132b9407c9b89c32f637"],
      "latestSignDate": "2022-01-18T03:21:02.855Z",
      "count": 1
    },
    {
      "subjectId": "60ef9ca6f35f70002eccd1e4",
      "subjectName": "novel-theme",
      "policyIds": ["3104b19e139f132b9407c9b89c32f637"],
      "latestSignDate": "2022-01-18T03:21:01.988Z",
      "count": 1
    },
    {
      "subjectId": "61e6282ff07610002e1c9446",
      "subjectName": "设计规范文档",
      "policyIds": ["d4922410431ed4796fb8be04579ea66c"],
      "latestSignDate": "2022-01-18T02:44:01.346Z",
      "count": 1
    },
    {
      "subjectId": "61b99394c9dacc002e9f5821",
      "subjectName": "测试md的",
      "policyIds": ["f70e09b0698a7db9fcf720d583169f3a"],
      "latestSignDate": "2022-01-18T02:15:07.530Z",
      "count": 1
    },
    {
      "subjectId": "617665044f0b48002ef2eb26",
      "subjectName": "blog-theme",
      "policyIds": ["2665bd4e6e035c9dc0260cf8c7ee01b1"],
      "latestSignDate": "2022-01-18T02:14:57.665Z",
      "count": 1
    },
    {
      "subjectId": "61e53bfd9d23c2002e1f73eb",
      "subjectName": "blog-theme",
      "policyIds": ["d4922410431ed4796fb8be04579ea66c"],
      "latestSignDate": "2022-01-17T10:01:38.319Z",
      "count": 1
    },
    {
      "subjectId": "5fec4d7a00bb3f002edda327",
      "subjectName": "testimage",
      "policyIds": ["53eeaec402d6cbc118cb40ed652227bb"],
      "latestSignDate": "2022-01-17T09:25:52.551Z",
      "count": 1
    },
    {
      "subjectId": "60068ce3135f16002f3b4000",
      "subjectName": "猫头鹰{}",
      "policyIds": ["53eeaec402d6cbc118cb40ed652227bb"],
      "latestSignDate": "2022-01-17T09:25:52.510Z",
      "count": 1
    },
    {
      "subjectId": "60069481664533002e72f0e9",
      "subjectName": "pubu",
      "policyIds": ["53eeaec402d6cbc118cb40ed652227bb"],
      "latestSignDate": "2022-01-17T09:25:52.481Z",
      "count": 1
    },
    {
      "subjectId": "6142ebf67d0f6c002ec7696a",
      "subjectName": "gallery-theme",
      "policyIds": ["2665bd4e6e035c9dc0260cf8c7ee01b1"],
      "latestSignDate": "2022-01-17T09:25:51.548Z",
      "count": 1
    },
    {
      "subjectId": "61dbd630779333002e7cd2c9",
      "subjectName": "novel-theme",
      "policyIds": ["2665bd4e6e035c9dc0260cf8c7ee01b1"],
      "latestSignDate": "2022-01-17T09:23:27.205Z",
      "count": 1
    },
    {
      "subjectId": "61dd3697779333002e7d0dd6",
      "subjectName": "西游记（小说）",
      "policyIds": ["d4922410431ed4796fb8be04579ea66c"],
      "latestSignDate": "2022-01-17T09:10:14.181Z",
      "count": 1
    },
    {
      "subjectId": "60079cac135f16002f3b4005",
      "subjectName": "测试MD依赖图",
      "policyIds": ["53eeaec402d6cbc118cb40ed652227bb"],
      "latestSignDate": "2022-01-17T09:10:14.146Z",
      "count": 1
    },
    {
      "subjectId": "60092955894f9d002e311f94",
      "subjectName": "基本概念",
      "policyIds": ["53eeaec402d6cbc118cb40ed652227bb"],
      "latestSignDate": "2022-01-17T09:10:14.040Z",
      "count": 1
    },
    {
      "subjectId": "61b9b67467dd96002ec62ba4",
      "subjectName": "blog-theme",
      "policyIds": ["bdddfb1df2e27dedd1f7e65ff19743ed"],
      "latestSignDate": "2022-01-17T09:10:11.059Z",
      "count": 1
    },
    {
      "subjectId": "607bc554b188330065fddfb8",
      "subjectName": "飞致开元",
      "policyIds": ["8a06d9d54789215782a748f1b4634a5e"],
      "latestSignDate": "2022-01-17T07:21:34.137Z",
      "count": 1
    },
    {
      "subjectId": "608667da52abf900867dfd48",
      "subjectName": "novel-theme",
      "policyIds": ["1a8a1aa4bd3441a2f578d83c1070282c"],
      "latestSignDate": "2022-01-17T07:21:13.620Z",
      "count": 1
    }
  ]
}
```

## 授权处理相关

### callAuth

**用途：呼出授权**

```ts
**用法说明：当addAuth多个未授权展品且没有立刻呼出（或者存在未授权展品且已经addAuth 但用户关闭了，插件想要用户签约时）可以通过callAuth()唤出**
freelogApp.callAuth();
```

### addAuth

**用途：对未授权展品添加进待授权队列**

```ts
**参数说明**
  exhibitId: string,  // 展品id
  options?: {
    immediate: boolean  // 是否立即弹出授权窗口
  }

**用法**
const res =  await freelogApp.addAuth(exhibitId,options)

**返回值说明**
res: {status: SUCCESS, data}

status 枚举判断：
  status === freelogApp.resultType.SUCCESS;  // 成功
  status === freelogApp.resultType.FAILED;   // 失败
  status === freelogApp.resultType.USER_CANCEL; // 用户取消
  status === freelogApp.resultType.DATA_ERROR;  // 数据错误
  status === = freelogApp.resultType.OFFLINE; // 展品已经下线
data: 如果是DATA_ERROR或OFFLINE，会返回错误数据或展品数据
```

### resultType

**用途：授权状态枚举**

```ts
**用法**
const res =  await freelogApp.addAuth(exhibitId,options)

**返回值说明**
res: {status: SUCCESS, data}

status 枚举判断：
  status === freelogApp.resultType.SUCCESS;  // 成功
  status === freelogApp.resultType.FAILED;   // 失败
  status === freelogApp.resultType.USER_CANCEL; // 用户取消
  status === freelogApp.resultType.DATA_ERROR;  // 数据错误
  status === = freelogApp.resultType.OFFLINE; // 展品已经下线
data: 如果是DATA_ERROR或OFFLINE，会返回错误数据或展品数据
```

## 用户相关

### onLogin

**用途：监听用户登录**

```ts
**用法**
// callback: 登录成功的回调，登录失败不会回调
freelogApp.onLogin(callback);
```

### onUserChange

**用途：监听用户登录变化**

```js
**参数说明**
  callback: Function // 一个函数

**用法**
// 当用户在其余页面切换账号，会回调所有函数
freelogApp.onUserChange(callback);
```

### getCurrentUser

**用途：获取当前登录的用户信息**

```ts
**用法**
const loginUser =  freelogApp.getCurrentUser();
```

**返回字段说明：**

| 返回值字段 | 字段类型 | 字段说明     |
| :--------- | :------- | :----------- |
| username   | string   | 用户名称     |
| headImage  | string   | 用户头像地址 |

### setUserData

**用途：创建或改变当前登录的用户在当前插件对应 key 的数据**

```ts
setUserData(key, data)
**参数说明**
  key: string, // 自定义key
  data: any, // 自定义数据

**用法**
const res = await freelogApp.setUserData("testData", {
  visitCount: 55,
  adCount:33
});
```

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": {
    "visitCount": 55,
    "adCount": 33
  }
}
```

### getUserData

**用途：获取当前登录的用户在当前插件保存的对应 key 的数据**

```ts
getUserData(key)
**参数说明**
  key: string, // 自定义key

**用法**
const userData = await freelogApp.getUserData("testData");
```

**返回示例**

```ts
// 通过setUserData保存的对应key的数据
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": {
    "visitCount": 55,
    "adCount": 33
  }
}
```

### deleteUserData

**用途：删除当前登录的用户在当前插件保存的对应 key 的数据**

```ts
deleteUserData(key)
**参数说明**
  key: string, // 自定义key

**用法**
const userData = await freelogApp.deleteUserData("testData");
```

**返回示例**

```ts
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data":null
}
```

### callLogin

**用途：唤起登录 UI**

```ts
**参数说明**
callback: Function // 登录成功的回调，若没有传递callBack回调, 登录成功后会自动刷新整个页面，

**用法**
freelogApp.callLogin(callBack)
```

### callLoginOut

**用途：唤起退出登录 UI**

```ts
**用法**
// 登出后会刷新整个页面
freelogApp.callLoginOut()
```

### isUserChange

**用途：用户变化后返回 true，没有变则返回 false**

```ts
**用法**
const flag = freelogApp.isUserChange()
```

<!-- ### pushMessage4Task

**用途：推送任务消息埋点**

```ts
**参数说明**
  data:{
    taskConfigCode: string,  // 任务配置编号
    meta: {} // 数据
  }

**用法**

freelogApp.pushMessage4Task(data).then((res)=>{})
``` -->

## 特殊功能：通用分享链接

### getShareUrl

**用途：获取某个展品的通用分享链接**

```ts
**参数说明**
  exhibitId：string, // 展品ID
  type: string  // 自定义分享类型，例如detail,content。规则：只允许包括下划线的任何单词字符  正则：[A-Za-z0-9_]

**用法**
freelogApp.getShareUrl(exhibitId, "detail")
```

### mapShareUrl

**用途：映射分享链接到自身正确的路由，运行时会转换分享链接到返回的对应路由**

**注意：只有在路由加载之前使用才有效**

```ts
**参数说明**
  {
    // key为多个包括下划线的任何单词字符  正则：[A-Za-z0-9_]
    key?: (exhibitId:string)=> url: string
  }

**用法**
  freelogApp.mapShareUrl({
    detail: (exhibitId)=>{
      return `/mydetailroute/${exhibitId}`
    }
    content: (exhibitId)=>{
      return `/mycontentroute/${exhibitId}`
    }
  })
```

## 网络请求返回状态码

### ret 一级状态码

| **值** | **含义**                                         |
| :----- | :----------------------------------------------- |
| -10    | 服务器维护中                                     |
| 0      | 正常结果                                         |
| 1      | 应用程序内部错误,一般系统自动捕捉,属于非正常流程 |
| 4      | 网关代理相关错误                                 |

**说明: 一级状态码主要指服务器的一些错误,还未到达具体应用层**

### errCode 二级状态码

| **值** | **含义**                                                  |
| :----- | :-------------------------------------------------------- |
| 0      | 正常结果                                                  |
| 1      | 应用程序内部错误,一般系统自动捕捉,属于非正常流程          |
| 2      | 应用程序错误,一般是业务内部主动抛出的未指定错误类型的错误 |
| 3      | 授权错误,一般指获得操作授权                               |
| 4      | 参数错误,一般指参数校验失败                               |
| 5      | 内部 API 调用错误                                         |
| 6      | 业务规则中的逻辑错误                                      |
| 7      | 网络相关错误                                              |
| 30     | 认证错误,一般指身份认证失败,需要登录                      |
| 31     | 网关代理组件调用出现异常                                  |
| 32     | 网关服务入口处 URL 路由不匹配错误                         |
| 33     | 网关服务器调用上游源服务器出现错误                        |

**说明: 具体应用层返回的错误**
