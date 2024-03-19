---
outline: deep
---
# freelogApp

### 阅读说明

**下面所有接口都挂在 freelogApp 对象上**

**文中参数说明“:”后面的为类型，类型后面是具体解释**

**文中参数类型为 int 的'是否'都用 1 和 0 传递**

## 节点相关

### nodeInfo

**用途：获取节点信息**

```ts
// 目前没有权限控制，主题和插件都可以获取到，后期整体考虑权限时会限制插件使用
// 如果使用到了节点信息，插件开发者应当在使用说明里明确使用到了节点信息以及无法获取到的影响
const nodeInfo = freelogApp.nodeInfo;
```

### devData

**用途：获取当前 dev 数据（url 数据）**

```ts
**用法**
const data = freelogApp.devData;
```

### getSelfArticleId

**用途：获取自身作品 articleId**

```ts
**用法**
const selfArticleId = await freelogApp.getSelfArticleId();
```

### getSelfWidgetId

**用途：获取自身插件 id**

```ts
**用法**
const selfWidgetId = await freelogApp.getSelfWidgetId();
```

### getSelfExhibitId

**用途：获取自身作品 exhibitId**

```ts
**用法**
const selfExhibitId= await freelogApp.getSelfExhibitId();
```

### getSelfConfig

**用途：获取自身配置数据**

```ts
**用法**
const widgetConfig =  freelogApp.getSelfConfig()
```

### getSubDep

**用途：获取插件自身依赖**

```ts
**用法**
const res = await freelogApp.getSubDep()

**返回值**
{
  exhibitName,  展品名称
  exhibitId,   展品id
  articleNid, 作品链路id
  resourceType, 作品类型
  subDep,  子依赖数组
  versionInfo: { exhibitProperty }, 版本信息
  ...response.data.data,  其它信息
}
```

### mountWidget

**用途：加载插件**

```ts
**参数说明**
  paramObj: {
    widget: object,      必传，插件数据
    container: htmlElement, 必传，挂载容器
    topExhibitData: object,  最外层展品数据（子孙插件都需要用）
    jdConfig: {},    配置将合并到microApp.renderApp的配置项中
    config: object,      给到子插件的配置数据，可传递方法用于通信
    seq: string,         如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的
    widget_entry: string, 本地url，dev模式下，可以使用本地url调试子插件
  }

**返回对象说明**
let widgetController = await freelogApp.mountWidget(paramObj)

widgetController: {destory, widgetId}

**具体解释**
destory()  通过widgetController.destory() 卸载插件，但需要插件配置了生命周期，否则请使用 freelogApp.destroyWidget(widgetId),注意widgetId要通过widgetController获取

widgetId: 如果设置了isSetup为true, 通过widgetController.widgetId 获取 widgetId，调用 preloadWidget(widgetId)来预加载
```

**加载自身依赖的插件**

```ts
**用法**
const subData = await freelogApp.getSubDep();
subData.subDep.some((sub, index) => {
  // 参数同上，这里没有一一列出
  await freelogApp.mountWidget({
    widget: sub,
    container:document.getElementById("freelog-single"), // 注意每一个插件都需要不同容器
    topExhibitData: subData,
    config: {},
    seq: string,
  });
});
```

**加载展品插件**

```ts
**用法**
const res = await freelogApp.getExhibitListById({
  articleResourceTypes: "widget",
  isLoadVersionProperty: 1
});
const widgets = res.data.data.dataList;
widgets.some((widget, index) => {
  await freelogApp.mountWidget({
    widget: widget,
    container: document.getElementById("freelog-single"),// 注意每一个插件都需要不同容器
  });
});
```

### preloadWidget

**用途：整个网页重载（仅主题可用，插件可访问主题开发者提供的方法进行全局刷新）**

```ts
**用法**
// 注意 widgetId 要通过widgetController获取 此方法将调用 jd的preloadApp,并合并config配置
freelogApp.preloadWidget(widgetId,config)
```

### destroyWidget

**用途：整个网页重载（仅主题可用，插件可访问主题开发者提供的方法进行全局刷新）**

```ts
**用法**
// 注意 widgetId 要通过widgetController获取, 此方法将调用 jd的destroyApp
freelogApp.destroyWidget(widgetId)
```

### reload

**用途：整个网页重载（仅主题可用，插件可访问主题开发者提供的方法进行全局刷新）**

```ts
**用法**
freelogApp.reload()
```

### setViewport

**用途：设置 viewport 的 meta**

```ts
**用法**
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

## 展品获取

### getExhibitListByPaging

**用途：分页获取展品**

```ts
**用法**
const res = await freelogApp.getExhibitListByPaging({
  skip: 0,
  limit: 20,
});
```

**query 可选参数**

| 参数                    | 必选 | 类型及范围    | 说明                                                                   |
| :---------------------- | :--- | :------------ | :--------------------------------------------------------------------- |
| skip                    | 可选 | int           | 跳过的数量.默认为 0.                                                   |
| limit                   | 可选 | int           | 本次请求获取的数据条数.一般不允许超过 100                              |
| sort                    | 可选 | string        | 排序,格式为{排序字段}:{1 或-1},1 是正序,-1 是倒序，例如"updateDate:-1" |
| articleResourceTypes    | 可选 | string        | 作品作品类型,多个用逗号分隔                                            |
| omitArticleResourceType | 可选 | string        | 忽略的作品作品类型,与 resourceType 参数互斥                            |
| onlineStatus            | 可选 | int           | 上线状态 (0:下线 1:上线 2:全部) 默认 1                                 |
| tags                    | 可选 | string        | 用户创建 presentable 时设置的自定义标签,多个用","分割                  |
| projection              | 可选 | string        | 指定返回的字段,多个用逗号分隔                                          |
| keywords                | 可选 | string[1,100] | 搜索关键字,目前支持模糊搜索节点作品名称和作品名称                      |
| isLoadVersionProperty   | 可选 | int           | 是否响应展品版本属性                                                   |
| isLoadPolicyInfo        | 可选 | int           | 是否加载策略信息                                                       |
| isTranslate             | 可选 | int           | 是否加载翻译信息                                                       |
| tagQueryType            | 可选 | int           | tags 的查询方式 1:任意匹配一个标签 2:全部匹配所有标签 默认:1           |

**返回说明：**

| 返回值字段              | 字段类型 | 字段说明                                                   |
| :---------------------- | :------- | :--------------------------------------------------------- |
| exhibitId               | string   | 展品 ID                                                    |
| exhibitName             | string   | 展品名称                                                   |
| exhibitTitle            | string   | 展品标题                                                   |
| tags                    | string[] | 展品标签                                                   |
| intro                   | string   | 展品简介                                                   |
| coverImages             | string[] | 展品封面图                                                 |
| version                 | string   | 展品版本                                                   |
| onlineStatus            | int      | 上线状态 0:下线 1:上线                                     |
| userId                  | int      | 展品的创建者 ID                                            |
| nodeId                  | int      | 展品所属节点 ID                                            |
| policies                | object[] | 对外授权的策略组                                           |
| \*\* policyId           | string   | 策略 ID                                                    |
| \*\* policyName         | string   | 策略名称                                                   |
| \*\* status             | int      | 策略状态 0:下线(未启用) 1:上线(启用)                       |
| \*\* policyText         | string   | 策略文本                                                   |
| \*\* translateInfo      | object   | 翻译信息<详见策略翻译文档>                                 |
| \*\* fsmDescriptionInfo | object   | 策略状态机描述信息<策略语言编译对象>                       |
| articleInfo             | object   | 展品实际挂载的作品信息                                     |
| \*\* articleId          | string   | 作品 ID                                                    |
| \*\* articleName        | string   | 作品名称                                                   |
| \*\* resourceType       | [string] | 作品作品类型                                               |
| \*\* articleType        | int      | 作品类型 (1:独立作品 2:组合作品 3:节点组合作品 4:存储对象) |
| \*\* articleOwnerId     | int      | 作品所有者 ID                                              |
| \*\* articleOwnerName   | string   | 作品所有者名称                                             |
| versionInfo             | object   | 展品的版本信息,加载版本属性时,才会赋值                     |
| \*\*exhibitProperty     | object   | 展品的版本属性                                             |

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
| onlineStatus            | int      | 上线状态 0:下线 1:上线                                     |
| userId                  | int      | 展品的创建者 ID                                            |
| nodeId                  | int      | 展品所属节点 ID                                            |
| policies                | object[] | 对外授权的策略组                                           |
| \*\* policyId           | string   | 策略 ID                                                    |
| \*\* policyName         | string   | 策略名称                                                   |
| \*\* status             | int      | 策略状态 0:下线(未启用) 1:上线(启用)                       |
| \*\* policyText         | string   | 策略文本                                                   |
| \*\* translateInfo      | object   | 翻译信息<详见策略翻译文档>                                 |
| \*\* fsmDescriptionInfo | object   | 策略状态机描述信息<策略语言编译对象>                       |
| articleInfo             | object   | 展品实际挂载的作品信息                                     |
| \*\* articleId          | string   | 作品 ID                                                    |
| \*\* articleName        | string   | 作品名称                                                   |
| \*\* resourceType       | [string] | 作品作品类型                                               |
| \*\* articleType        | int      | 作品类型 (1:独立作品 2:组合作品 3:节点组合作品 4:存储对象) |
| \*\* articleOwnerId     | int      | 作品所有者 ID                                              |
| \*\* articleOwnerName   | string   | 作品所有者名称                                             |
| versionInfo             | object   | 展品的版本信息,加载版本属性时,才会赋值                     |
| \*\*exhibitProperty     | object   | 展品的版本属性                                             |

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

| 返回值字段              | 字段类型 | 字段说明                                                   |
| :---------------------- | :------- | :--------------------------------------------------------- |
| exhibitId               | string   | 展品 ID                                                    |
| exhibitName             | string   | 展品名称                                                   |
| exhibitTitle            | string   | 展品标题                                                   |
| tags                    | string[] | 展品标签                                                   |
| intro                   | string   | 展品简介                                                   |
| coverImages             | string[] | 展品封面图                                                 |
| version                 | string   | 展品版本                                                   |
| onlineStatus            | int      | 上线状态 0:下线 1:上线                                     |
| userId                  | int      | 展品的创建者 ID                                            |
| nodeId                  | int      | 展品所属节点 ID                                            |
| policies                | object[] | 对外授权的策略组                                           |
| \*\* policyId           | string   | 策略 ID                                                    |
| \*\* policyName         | string   | 策略名称                                                   |
| \*\* status             | int      | 策略状态 0:下线(未启用) 1:上线(启用)                       |
| \*\* policyText         | string   | 策略文本                                                   |
| \*\* translateInfo      | object   | 翻译信息<详见策略翻译文档>                                 |
| \*\* fsmDescriptionInfo | object   | 策略状态机描述信息<策略语言编译对象>                       |
| articleInfo             | object   | 展品实际挂载的作品信息                                     |
| \*\* articleId          | string   | 作品 ID                                                    |
| \*\* articleName        | string   | 作品名称                                                   |
| \*\* resourceType       | [string] | 作品作品类型                                               |
| \*\* articleType        | int      | 作品类型 (1:独立作品 2:组合作品 3:节点组合作品 4:存储对象) |
| \*\* articleOwnerId     | int      | 作品所有者 ID                                              |
| \*\* articleOwnerName   | string   | 作品所有者名称                                             |
| versionInfo             | object   | 展品的版本信息,加载版本属性时,才会赋值                     |
| \*\*exhibitProperty     | object   | 展品的版本属性                                             |

### getExhibitFileStream

**用途：获取展品作品文件**

```ts
**参数说明**
  exhibitId: 展品id，
  options: {
    returnUrl?: boolean; 是否只返回url， 例如img标签图片只需要url
    config?: any;   axios的config 目前仅支持"onUploadProgress",  "onDownloadProgress", "responseType"
    subFilePath?: string;   漫画中的图片等子文件的路径
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
  exhibitId: string ,  自身展品id
  articleNids: string, 链路id

**用法**
const res = await freelogApp.getExhibitDepInfo(
  exhibitId,
  articleNids
)
```

### getExhibitDepFileStream

**用途：获取展品子依赖作品文件**

```ts
**参数说明**
  exhibitId: string ,  自身展品id
  parentNid: string,     自身链路id
  subArticleIdOrName: string,   子依赖作品id或名称
  returnUrl?: boolean, 是否只返回url， 例如img标签图片只需要url
  config?: object,    axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"

**用法**
const res = await freelogApp.getExhibitDepFileStream(
  exhibitId,
  parentNid,
  subArticleIdOrName,
  returnUrl,
  config
)
```

### getExhibitSignCount

**用途：查找展品签约数量（同一个用户的多次签约只计算一次）**

```ts
**参数说明**
  exhibitIds: string,  用英文逗号隔开的展品id

**用法**
const res = await freelogApp.getExhibitSignCount(exhibitIds)
```

### getExhibitAuthStatus

**用途：批量查询展品授权**

```ts
**参数说明**
  exhibitIds: string, 用英文逗号隔开的展品id

**用法**
const res = await freelogApp.getExhibitAuthStatus(exhibitIds)
```

### getExhibitAvailalbe

**用途：批量查询展品是否可用（即能否提供给用户签约）**

```ts
**参数说明**
  exhibitIds:: string,  用英文逗号隔开的展品id

**用法**
const res = await freelogApp.getExhibitAvailalbe(exhibitIds)
```

**返回说明**

| 返回值字段            | 字段类型 | 字段说明                                                   |
| :-------------------- | :------- | :--------------------------------------------------------- |
| exhibitId             | string   | 展品 ID                                                    |
| exhibitName           | string   | 展品名称                                                   |
| referee               | int      | 做出授权结果的标的物服务类型(1:作品服务 2:展品服务)        |
| defaulterIdentityType | int      | 授权不通过责任方(0:无 1:作品 2:节点 4:c 端消费者 128:未知) |
| authCode              | int      | 授权码                                                     |
| isAuth                | boolean  | 是否授权通过                                               |
| errorMsg              | string   | 错误信息                                                   |

### getSignStatistics

**用途：统计展品签约量**

```ts
**参数说明**
    keywords: string | number 搜索关键字

**用法**
const res = await freelogApp.getSignStatistics(keywords)
```

**返回说明**

| 返回值字段     | 字段类型 | 字段说明     |
| :------------- | :------- | :----------- |
| subjectId      | string   | 标的物 ID    |
| subjectName    | string   | 标的物名称   |
| policyIds      | string[] | 签约的策略   |
| latestSignDate | date     | 最后签约日期 |
| count          | int      | 签约次数     |

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
  exhibitId: string,
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
// callback: 登录成功的回调，登录失败不会回调,这里需要考虑一下，
freelogApp.onLogin(callback);
```

### onUserChange

**用途：监听用户登录变化**

```js
**用法**
// 监听用户在其余页面切换账号或登录事件  callback: 再次进入页面发现账号变化后会回调所有函数
freelogApp.onUserChange(callback);
```

### getCurrentUser

**用途：获取当前登录的用户信息**

```ts
**用法**
const loginUser = await freelogApp.getCurrentUser();

// TODO
**返回值说明**

```

### setUserData

**用途：改变当前登录的用户在当前插件保存的数据**

```ts
**用法**
const res = await freelogApp.setUserData(key, data);
```

### getUserData

**用途：获取当前登录的用户在当前插件保存的数据**

```ts
**用法**
const userData = await freelogApp.getUserData(key);
```

### callLogin

**用途：唤起登录 UI**

```ts
**用法**
// callback: 登录成功的回调，登录失败不会回调,这里需要考虑一下，
freelogApp.callLogin(callBack)
```

### callLoginOut

**用途：唤起退出登录 UI**

```ts
**用法**
freelogApp.callLoginOut()
```

### isUserChange

**用途：调用此方法发现用户切换后会刷新网页，否则返回 false**

```ts
**用法**
freelogApp.isUserChange()
```

### pushMessage4Task

**用途：推送任务消息埋点**

```ts
**参数说明**
  data:{
    taskConfigCode: string,  // 任务配置编号
    meta: {} // 数据
  }

**用法**

freelogApp.pushMessage4Task(data).then((res)=>{})
```