---
outline: deep
---

# 本文档同时适用于主题与插件

## 介绍

### 概念

在 Freelog 平台，插件是指作品类型为插件的功能性作品，一般作为主题的依赖在节点发挥作用，决定节点中内容型展品的访问、展示和交互方式。

插件可以是一个播放器、一个图床、一个目录菜单或者一个小说阅读器。

**技术上来讲，主题是一个作为节点入口的插件，并具有一些特殊权限**

### 通俗解释

**插件是一个运行在我司平台运行时的可管控的一个完整应用或组件，与微前端类似**

**后面出现的运行时皆指平台运行时**

### 特别说明

**文中 resourceName 与 articleName, resourceId 与 articleId 属于同一属性**

<!-- ### 运行原理

**本平台使用京东在运行时框架**
[https://micro-zoe.github.io/micro-app/docs.html#/](https://micro-zoe.github.io/micro-app/docs.html#/) -->

## 示例节点代码仓

[https://github.com/freelogfe/freelog-sample-themes.git](https://github.com/freelogfe/freelog-sample-themes.git)

## 基础使用案例

节点：[https://examples.testfreelog.com](https://examples.testfreelog.com)

代码仓：[https://github.com/freelogfe/freelog-developer-guide-examples.git](https://github.com/freelogfe/freelog-developer-guide-examples.git)

<!-- ### 有意思的怀旧红白机

[https://nes-game.freelog.com](https://nes-game.freelog.com) -->

## 框架改造

[前往框架改造指南](/framework/index)

## 基础开发

### https 证书准备（必须）

**由于浏览器安全限制，本地开发需要本地以 https 启动**

webpack 请参考 webpack-mkcert 工具

[https://www.npmjs.com/package/webpack-mkcert](https://www.npmjs.com/package/webpack-mkcert)

vite 请参考 @vitejs/plugin-basic-ssl 插件

[https://github.com/vitejs/vite-plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl)

### chrome 无法访问 localhost 问题

地址栏输入：chrome://flags/#block-insecure-private-network-requests

把 Block insecure private network requests. 设置为 disabled

如图
![chrome](/chrome.png)

### 创建一个节点和主题

进入 console.freelog.com ---> 节点管理

创建节点后必须建一个主题作品并签约激活

假设节点为https://examples.freelog.com/

用于开发的测试节点为https://examples.freelog.com/

### 连接节点与插件

启动插件，例如‘https://localhost:7101’

在节点 url 的https://examples.freelog.com/后面加上

```ts
"https://examples.freelog.com/?dev=https://localhost:7101";
```

此时插件是作为节点主题（即入口）使用

### URL 说明

<https://examples.testfreelog.com/?theme=%2Fwidget-mount&w910d8e=%2Fwidget%2F&wa4083c1=%2Fwidget%2F>

<https://examples.testfreelog.com>： 节点地址

theme=%2Fwidget-mount：

主题渲染 id=主题的路由 %2Fwidget-mount=encodeURIComponent("/widget-mount")

w910d8e=%2Fwidget%2F:

插件渲染 id=插件的路由 %2Fwidget%2F=encodeURIComponent("/widget/")

wa4083c1=%2Fwidget%2F：

插件渲染 id=插件的路由 %2Fwidget%2F=encodeURIComponent("/widget/")

### 安装 api 库 与初始化 API

```ts
 npm install freelog-runtime
 // 使用前导入
 import { initFreelogApp,freelogApp } from "freelog-runtime"
 // 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  // 必须在mount中初始化
  initFreelogApp()

  render();
};
```

### 获取节点信息

```ts
import { freelogApp } from "freelog-runtime";
// 目前没有权限控制，主题和插件都可以获取到，后期整体考虑权限时会限制插件使用
// 如果使用到了节点信息，插件开发者应当在使用说明里明确使用到了节点信息以及无法获取到的影响
const nodeInfo = freelogApp.nodeInfo;
```

### 加载自身的子依赖插件

[查看 getSelfDependencyTree 详情](/api/#getselfdependencytree)

[查看 mountArticleWidget 详情](/api/#mountarticlewidget)

```ts
import { freelogApp } from "freelog-runtime";
// 运行时加载主题时已经传递了 dependencyTree, 非主题如果父插件没有传递，请使用 freelogApp.getDependencyTree(true)
const subData: ExhibitAuthNodeInfo[] = await freelogApp.getSelfDependencyTree();
subData.forEach(async (sub: ExhibitAuthNodeInfo) => {
  if (sub.articleName === "snnaenu/插件开发演示代码插件") {
    selfWidget = await freelogApp.mountArticleWidget({
      articleId: sub.articleId,
      parentNid: sub.parentNid,
      nid: sub.nid,
      topExhibitId: freelogApp.getTopExhibitId(), //
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

### 加载展品插件

[查看 mountExhibitWidget 详情](/api/#mountexhibitwidget)

```ts
import {
  freelogApp,
  ExhibitAuthNodeInfo,
  WidgetController,
  ExhibitInfo,
  GetExhibitListByPagingResult,
} from "freelog-runtime";
const res: GetExhibitListByPagingResult =
  await freelogApp.getExhibitListByPaging({
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

### 单独调试某个插件

当需要跳过主题直接调试正在运行的子插件或展品插件

定义： `${url}?dev=replace&${widgetRenderName}-freelog=${local_entry}`

url: 节点地址

'${widgetRenderName}-freelog': 渲染名称加-freelog
widgetRenderName 获取方式：1.url 上已有渲染名称，2.如果渲染名称无法区分，插件内可以通过 freelogApp.getSelfWidgetRenderName()获取自身的渲染名称

local_entry: 本地地址

举例：

```ts
https://nes-common.freelog.com/?dev=replace&w680fb7-freelog=https://localhost:7107/
```

<!-- ### 插件卸载

当插件挂载的容器在组件内部或与组件同生同灭时，在组件卸载前需要卸载插件，否则再次加载会有问题。

vue 案例：[前往示例代码](https://github.com/freelogfe/freelog-developer-guide-examples/blob/main/examples/vue3-ts-theme/src/views/widget/WidgetMount.vue)

```ts
// vue示例
onBeforeUnmount(() => {
  exhibitWidget.unmount();
});

// react示例
useEffect(() => {
  return () => {
    freelogApp.destroyWidget(exhibitWidget.widgetId);
  };
});
``` -->

### 获取插件自身属性

```ts
// 运行时加载主题时已经传递了property
// 如果mountExhibitWidget  mountArticleWidget传递了property
const widgetConfig = freelogApp.getSelfProperty();

// 如果mountExhibitWidget  mountArticleWidget没有传递property
const widgetConfig = freelogApp.getSelfProperty(true);
```

### 移动端适配

**除媒体查询外，支持最新的问题最少的最好的 viewport 兼容方案**

**推荐使用 postcss-px-to-viewport 插件, 各框架具体使用方法请百度**

```ts
**viewport修改用法**
freelogApp.setViewport(keys: any)
keys = {
  width: "device-width", // immutable
  height: "device-height", // not supported in browser
  "initial-scale": 1, // 0.0-10.0   available for theme
  "maximum-scale": 1, // 0.0-10.0   available for theme
  "minimum-scale": 1, // 0.0-10.0   available for theme
  "user-scalable": "no", // available for theme
  "viewport-fit": "auto", // not supported in browser
}
```

## 展品相关

### 获取展品

**分页列表**

```ts
const res = await freelogApp.getExhibitListByPaging({
  skip: 0,
  limit: 20,
  isLoadVersionProperty: 0 | 1, // 可选，是否加载版本信息,默认0
});
```

[查看 getExhibitListByPaging 详情](/api/#getexhibitlistbypaging)

**查找展品**

```ts
const res = freelogApp.getExhibitListById(query)

**参数说明**
  query:{
    exhibitIds: string, // 展品ids 多个使用","隔开
    isLoadVersionProperty: 0 | 1, // 可选，是否加载版本信息,默认0
  }
```

[查看 getExhibitListById 详情](/api/#getexhibitlistbyid)

### 获取单个展品详情

```ts
const res = await  freelogApp.getExhibitInfo(exhibitId, query)

**参数说明**
  exhibitId:// 展品id，
  query:{
      isLoadVersionProperty: 0 | 1, // 可选，是否加载版本信息,默认0
  }
```

### 获取展品属性

```ts
// 使用getExhibitListByPaging、getExhibitListById、getExhibitInfo并传递isLoadVersionProperty为1时
// 例如：
const res = await  freelogApp.getExhibitInfo(exhibitId, {
              isLoadVersionProperty: 1
            })
const exhibitProperty =res.data.data.versionInfo.exhibitProperty
```

[查看 getExhibitInfo 详情](/api/#getexhibitinfo)

### 获取展品作品

```ts
const res = await freelogApp.getExhibitFileStream(
  exhibitId,
  options
)

**参数说明**
  exhibitId: // 展品id，
  options: {
    returnUrl?: boolean; // 是否只返回url， 例如img标签图片只需要url
    config?: {
      onUploadProgress?: (progressEvent: any) => void;
      onDownloadProgress?: (progressEvent: any) => void;
      responseType?: ResponseType;
    },   //  axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"
    subFilePath?: string; // 漫画中的图片等子文件的路径
  },
```

### 展品子依赖列表

**在 获取展品 与 获取单个展品详情 接口返回数据中**

```ts
  **如下所示，数组versionInfo.dependencyTree就是该展品的所有子孙依赖列表**
  **第一个为自身，通过自身的nid去找出parentNid为该nid的依赖即为直接子依赖**
  {
	"ret": 0,
	"errCode": 0,
	"errcode": 0,
	"msg": "success",
	"data": {
		"exhibitId": "61b99394c9dacc002e9f5821",
    ...
		"versionInfo": {
			"exhibitId": "61b99394c9dacc002e9f5821",
			"exhibitProperty": {
				"fileSize": 6234,
				"mime": "text/markdown"
			},
			"dependencyTree": [{
				"nid": "61b99394c9da",
				"articleId": "61b993157841ed002e5c96ca",
				"articleName": "ZhuC/测试md",
				"articleType": 1,
				"version": "0.1.1",
				"versionRange": "0.1.1",
				"resourceType": ["markdown"],
				"versionId": "0d786f5b273bc549454b55ea649569a3",
				"deep": 1,
				"parentNid": ""
			}, {
				"nid": "9091f75e23fb",
				"articleId": "61b9a82f2ae3ac002eb7993a",
				"articleName": "ZhuC/元宇宙",
				"articleType": 1,
				"version": "0.1.0",
				"versionRange": "^0.1.0",
				"resourceType": ["video"],
				"versionId": "85fa350f4d003d0adea1fffc2852891d",
				"deep": 2,
				"parentNid": "61b99394c9da"
			}]
		}
	}
}
```

### 批量查询展品依赖的作品信息

```ts
const res = await freelogApp.getExhibitDepInfo(
  exhibitId,
  articleNids
)
**参数说明**
  exhibitId: string ,  // 自身展品id
  articleNids: string, // 例如上面的dependencyTree中的多个nid: "61b99394c9da,9091f75e23fb"
                       // 一个或多个链路id,多个用英文逗号隔开, 在依赖树当中的唯一标识id
```

### 获取子依赖作品文件

```ts
const res = await freelogApp.getExhibitDepFileStream(
  exhibitId,
  query:{
    parentNid,
    subArticleId,
    returnUrl
  }
)

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
```

### 获取作品属性

```ts
// 使用getExhibitDepInfo接口获取作品属性
const res = await  freelogApp.getExhibitDepInfo(exhibitId, articleNids)
const articleProperty =res.data.data[0].articleProperty
```

### 查找展品签约数量

**同一个用户的多次签约只计算一次**

```ts
const res = await freelogApp.getExhibitSignCount(
  exhibitIds: string
)

**参数说明**
  exhibitIds:string // 一个或多个展品id，多个用英文逗号隔开
```

### 批量查询展品授权

```ts
const res = await freelogApp.getExhibitAuthStatus(
  exhibitIds: string
)

**参数说明**
  exhibitIds: string //  一个或多个展品id，多个用英文逗号隔开
```

### 批量查询展品是否可用

**即节点是否完全获得授权，然后才能提供给用户签约**

```ts
const res = await freelogApp.getExhibitAvailable(
  exhibitIds: string
)

**参数说明**
  exhibitIds: //  一个或多个展品id，多个用英文逗号隔开
```

[查看 getExhibitAvailable 详情](/api/#getexhibitavailable)

### 授权处理

**单个呼出授权**

```ts
// 根据展品id获取展品作品
let ch = await freelogApp.getExhibitFileStream(
  chapters[index].exhibitId
);

if (ch.authErrorType) {
  // 提交给运行时处理
  /**
   * addAuth 参数
      exhibitId: string,
      options?: {
        immediate: boolean  // 是否立即弹出授权窗口
      }
  */
  const data = await new Promise((resolve, rej) => {
    const res = await freelogApp.addAuth(ch.data.exhibitId, {
      immediate: true,
    });

   **res返回值说明**
   {status: SUCCESS, data}
   status 枚举判断：
     status === freelogApp.resultType.SUCCESS;  // 成功
     status === freelogApp.resultType.FAILED;   // 失败
     status === freelogApp.resultType.USER_CANCEL; // 用户取消
     status === freelogApp.resultType.DATA_ERROR;  // 数据错误
     status === = freelogApp.resultType.OFFLINE; // 展品已经下线
   data: 如果是DATA_ERROR或OFFLINE，会返回错误数据或展品数据
  });
}
```

**呼出授权**

```ts
// 当addAuth多个未授权展品且没有立刻呼出（或者存在未授权展品且已经addAuth 但用户关闭了，插件想要用户签约时）可以通过callAuth()唤出
freelogApp.callAuth();
```

## 用户相关

### 唤起登录

```ts
// callback: 登录成功的回调，登录失败不会回调
freelogApp.callLogin(callback);
```

### 唤起退出登录

```ts
freelogApp.callLoginOut();
```

### 获取当前登录用户信息

```ts
const res = await freelogApp.getCurrentUser();
```

### 监听用户登录事件

```ts
// callback: 登录成功的回调，登录失败不会回调
freelogApp.onLogin(callback);
```

### 监听用户在其余页面切换账号或登录事件

```ts
// callback: 再次进入页面发现账号变化后会回调所有函数
freelogApp.onUserChange(callback);
```

### 用户数据

```ts
// 更新用户数据   data 为任意对象，
const res = await freelogApp.setUserData(key, data);
// 获取用户数据
const res = await freelogApp.getUserData(key);
```

## 打包上传

**正常 build 后，将打包后的所有文件压缩为一个 zip 文件（无根目录），作为主题 theme 或插件 widget 类型上传为作品**

<!-- ## 模板下载 -->

<!-- [vue模板](https://freelog-docs.freelog.com/$freelog-60a614de12ac83003f09d975=/dev/guide)  -->

<!-- ## 移动端真机调试 vconsole

**将 dev 改成 devconsole**

此时无论移动端还是电脑端都会出现 vconsole

https://examples.freelog.com/?devconsole=https://localhost:8081 -->
