# freelogApp

**下面所有接口都挂在 window.freelogApp 对象上**

**文中参数类型为 int 的'是否'都用 1 和 0 传递**

## getStaticPath

**用途：获取图片字体等静态作品的正确路径**

```ts

```

```ts
 **用法**
  const path = await window.freelogApp.getStaticPath(path);

  **参数说明**
    (
      path: 以/开头的正常路径
    )
```

## mountWidget

**用途：加载插件**

```ts

  **参数说明**
  (
    widget,      // 插件数据
    container,   // 挂载容器
    commonData,  // 最外层展品数据（子孙插件都需要用）孙插件暂未完善
    config,      // 配置数据
    seq,        // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的 
    widget_entry: string, // 本地url，dev模式下，可以使用本地url调试子插件
  )
```

### 加载自身依赖的插件

```ts
 **用法**
const subData = await window.freelogApp.getSubDep();
subData.subDep.some((sub, index) => {
  if (index === 1) return true;
  await window.freelogApp.mountWidget(
    sub,
    document.getElementById("freelog-single"),
    subData, // 父数据
    config: {}, // 子插件配置数据，需要另外获取作品上的配置数据（待提供方法）
    seq: string, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号
  );
});
```

### 加载展品插件

```ts
 **用法**
 const res = await window.freelogApp.getExhibitListById({
    articleResourceTypes: "widget",
    isLoadVersionProperty: 1
  });
  const widgets = res.data.data.dataList;
  widgets.some((widget, index) => {
    await window.freelogApp.mountWidget(
      widget,
      document.getElementById("freelog-single"),// 给每一个提供不同的容器
    );
  });
```

## getExhibitListByPaging

**用途：分页获取展品**

```ts
const res = await window.freelogApp.getExhibitListByPaging({
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
| \*\* resourceType       | string   | 作品作品类型                                               |
| \*\* articleType        | int      | 作品类型 (1:独立作品 2:组合作品 3:节点组合作品 4:存储对象) |
| \*\* articleOwnerId     | int      | 作品所有者 ID                                              |
| \*\* articleOwnerName   | string   | 作品所有者名称                                             |
| versionInfo             | object   | 展品的版本信息,加载版本属性时,才会赋值                     |
| \*\*exhibitProperty     | object   | 展品的版本属性                                             |

## getExhibitListById

**用途：查找展品**

```ts
  **参数说明**
    query:{
      exhibitIds: "string", // 展品ids 多个使用","隔开
      isLoadVersionProperty: "string", // 是否加载版本信息
    }

 **用法**

 const res = await window.freelogApp.getExhibitListById(query).then((res)=>{
 })
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
| \*\* resourceType       | string   | 作品作品类型                                               |
| \*\* articleType        | int      | 作品类型 (1:独立作品 2:组合作品 3:节点组合作品 4:存储对象) |
| \*\* articleOwnerId     | int      | 作品所有者 ID                                              |
| \*\* articleOwnerName   | string   | 作品所有者名称                                             |
| versionInfo             | object   | 展品的版本信息,加载版本属性时,才会赋值                     |
| \*\*exhibitProperty     | object   | 展品的版本属性                                             |

## getExhibitInfo

**用途：获取单个展品详情**

```ts
  const res = await window.freelogApp.getExhibitInfo(exhibitId, query)

  **参数说明**
    exhibitId: "string", // 展品id
    query:{
      isLoadVersionProperty: 0 | 1, // 是否需要展品版本属性
    }
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
| \*\* resourceType       | string   | 作品作品类型                                               |
| \*\* articleType        | int      | 作品类型 (1:独立作品 2:组合作品 3:节点组合作品 4:存储对象) |
| \*\* articleOwnerId     | int      | 作品所有者 ID                                              |
| \*\* articleOwnerName   | string   | 作品所有者名称                                             |
| versionInfo             | object   | 展品的版本信息,加载版本属性时,才会赋值                     |
| \*\*exhibitProperty     | object   | 展品的版本属性                                             |

## getExhibitFileStream

**用途：获取展品作品文件**

```ts
  const res = await window.freelogApp.getExhibitFileStream(
    exhibitId: string | number,
    returnUrl?: boolean,
    config?: any
  )

  **参数说明**

    exhibitId: string,  // 展品id
    returnUrl?: boolean, // 是否只返回url， 例如img标签图片只需要url
    config?: any // axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"

```

## getExhibitDepFileStream

**用途：获取展品子依赖作品文件**

```ts
  const res = await window.freelogApp.getExhibitDepFileStream(
    exhibitId: string ,
    parentNid: string,
    subArticleIdOrName: string,
    returnUrl?: boolean,
    config?: any
  )

  **参数说明**

    exhibitId: string , // 自身展品id
    parentNid: string,    // 自身链路id
    subArticleIdOrName: string, // 子依赖作品id或名称
    returnUrl?: boolean, // 是否只返回url， 例如img标签图片只需要url
    config?: any // axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"

```

## getExhibitSignCount

**用途：查找展品签约数量（同一个用户的多次签约只计算一次）**

```ts
  const res = await window.freelogApp.getExhibitSignCount(
    exhibitIds: string
  )

  **参数说明**

    exhibitIds: 用英文逗号隔开的展品id

```

## getExhibitAuthStatus

**批量查询展品授权**

```ts
  const res = await window.freelogApp.getExhibitAuthStatus(
    exhibitIds: string
  )

  **参数说明**

    exhibitIds: 用英文逗号隔开的展品id

```

## getExhibitAvailalbe

**批量查询展品是否可用（即能否提供给用户签约）**

```ts
  const res = await window.freelogApp.getExhibitAvailalbe(
    exhibitIds: string
  )

  **参数说明**

    exhibitIds:  用英文逗号隔开的展品id

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

## getSignStatistics

**统计展品签约量**

```ts
  const res = await window.freelogApp.getSignStatistics(
    keywords: string
  )

  **参数说明**

    keywords: 搜索关键字

```

**返回说明**

| 返回值字段     | 字段类型 | 字段说明     |
| :------------- | :------- | :----------- |
| subjectId      | string   | 标的物 ID    |
| subjectName    | string   | 标的物名称   |
| policyIds      | string[] | 签约的策略   |
| latestSignDate | date     | 最后签约日期 |
| count          | int      | 签约次数     |

## devData

**普通对象非函数：获取当前 dev 数据（url 数据）**

```ts
const data = window.freelogApp.devData;
```

## autoMoutSubWdigets

**用途：自动加载自身的子插件**

```ts
  // 目前存在问题
  window.freelogApp.autoMoutSubWdigets(config)
  config:
```

## getSelfId

```ts
const selfId = await window.freelogApp.getSelfId();
```

## getSelfConfig

```ts

 **获取自身配置数据**

 const widgetConfig =  window.freelogApp.getSelfConfig()

```

## getSubDep

```ts

 **获取插件自身依赖**

 const res = await window.freelogApp.getSubDep()

 **返回值**
  {
    exhibitName,
    exhibitId,
    articleNid,
    resourceType,
    subDep, // 子依赖数组
    versionInfo: { exhibitProperty },
    ...response.data.data,
  }
```

## callAuth

**用途：呼出授权**

```ts
// 当addAuth多个未授权展品且没有立刻呼出（或者存在未授权展品且已经addAuth 但用户关闭了，插件想要用户签约时）可以通过callAuth()唤出
window.freelogApp.callAuth();
```

## addAuth

**用途：对未授权展品添加进待授权队列**

```ts
 const res =  await window.freelogApp.addAuth(exhibitId,options)

 **参数说明**
    exhibitId: string,
    options?: {
      immediate: boolean  // 是否立即弹出授权窗口
    }

 **返回值说明**
 {status: SUCCESS, data}
 status 枚举：
   SUCCESS = 0;
   FAILED = 1;
   USER_CANCEL = 2;
   DATA_ERROR = 3;
 data: 如果是DATA_ERROR，会返回错误数据
```

## onLogin

**监听用户登录**

```ts
// callback: 登录成功的回调，登录失败不会回调,这里需要考虑一下，
window.freelogApp.onLogin(callback);
```

## getCurrentUser

**获取当前登录的用户信息**

```ts
const loginUser = await window.freelogApp.getCurrentUser();
```

## setUserData

**获取当前登录的用户在当前插件保存的数据**

```ts
const res = await window.freelogApp.setUserData(key, data);
```

## getUserData

**获取当前登录的用户在当前插件保存的数据**

```ts
const userData = await window.freelogApp.getUserData(key);
```

## callLogin

```ts
 **唤起登录**
 // callback: 登录成功的回调，登录失败不会回调,这里需要考虑一下，
 window.freelogApp.callLogin(callBack)

```

## callLoginOut

```ts
 **唤起退出登录**
 window.freelogApp.callLoginOut()
```

## reload

```ts
 **整个网页重载（仅主题可用，插件可访问主题开发者提供的方法进行全局刷新）**
 window.freelogApp.reload()
```

## isUserChange

```ts
 **调用此方法发现用户切换后会刷新网页，否则返回false**
 window.freelogApp.isUserChange()
```

## setViewport

```ts

**设置viewport的meta**

window.freelogApp.setViewport(keys: any)
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
