# freelogApp

**下面所有接口都挂在 window.freelogApp 对象上**

**接口返回值先自行看，后面再整理**

## getStaticPath

 **用途：获取图片字体等静态资源的正确路径**

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
    seq,         // 一个节点内可以使用多个插件，但需要传递序号，
  )
```

### 加载自身依赖的插件



```ts
 **用法**
const subData = await window.freelogApp.getSubDep();
subData.subDeps.some((sub, index) => {
  if (index === 1) return true;
  window.freelogApp.mountWidget(
    sub,
    document.getElementById("freelog-single"),
    subData, // 父数据
    config: {}, // 子插件配置数据，需要另外获取资源上的配置数据（待提供方法）
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
    window.freelogApp.mountWidget(
      widget,
      document.getElementById("freelog-single"),// 给每一个提供不同的容器
    );
  });
```



## getExhibitListByPaging

**用途：分页获取展品**

```ts

  **参数说明**
    query:{
      skip: "string", // 从第几个开始
      limit: "string", // 取多少个
      articleResourceTypes: "string", // 资源类型
      omitResourceType: "string", // 过滤资源类型
      tags: "string", // 展品和资源标签，多个使用","隔开
      projection: "string",
      keywords: "string",
      isLoadVersionProperty: "string", // 是否加载版本信息
    }
```

```ts
   **用法**
   const res = await window.freelogApp.getExhibitListByPaging(query).then((res)=>{

   })
```

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

## getExhibitInfo

**用途：获取单个展品详情**

```ts
  const res = await window.freelogApp.getExhibitInfo(exhibitId, query)

  **参数说明**
    exhibitId: "string", // 展品id
    query: {
      isLoadVersionProperty: "int", // 是否加载版本信息
    }
```

## getExhibitFileStream

**用途：获取展品资源文件**

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

**用途：查找展品子依赖资源文件**

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
    subArticleIdOrName: string, // 子依赖资源id或名称
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

## devData

**普通对象非函数：获取当前 dev 数据（url 数据）**
```ts
 const data =  window.freelogApp.devData 
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
 const selfId = await window.freelogApp.getSelfId() 

``` 

## getSelfConfig

```ts

 **获取自身配置数据**

 const widgetConfig = await window.freelogApp.getSelfConfig() 

``` 

## getSubDep
 
```ts

 **获取自身依赖**
 
 const res = await window.freelogApp.getSubDep() 

 **返回值**
  {
    subDeps:  [], // 子依赖数组
    workNid,  // 自身链路id
    data: data, // 自身信息
  }
```



## callAuth

**用途：呼出授权**

```ts
// 当addAuth多个未授权展品且没有立刻呼出（或者存在未授权展品且已经addAuth 但用户关闭了，插件想要用户签约时）可以通过callAuth()唤出
window.freelogApp.callAuth() 
```
## addAuth

**用途：对未授权展品添加授权**

```ts
window.freelogApp.addAuth(data) 
 
 **参数说明**
    exhibitId: string,
    resolve: Function,  // 授权成功回调
    reject: Function,  // 授权失败回调
    options?: {
      immediate: boolean  // 是否立即弹出授权窗口
    } 
```
## onLogin

**监听用户登录**

```ts
// callback: 登录成功的回调，登录失败不会回调
window.freelogApp.onLogin(callback) 
 
```
## getCurrentUser

**获取当前登录的用户信息**

```ts

 const loginUser = await window.freelogApp.getCurrentUser() 
 
```

## setUserData

**获取当前登录的用户在当前插件保存的数据**

```ts

 const res = await window.freelogApp.setUserData(key, data) 
 
```
## getUserData

**获取当前登录的用户在当前插件保存的数据**

```ts

 const userData = await window.freelogApp.getUserData(key)
 
```

## callLogin 
```ts
 **唤起登录**
 window.freelogApp.callLogin()
```

## callLoginOut 
```ts
 **唤起退出登录**
 window.freelogApp.callLoginOut()
```