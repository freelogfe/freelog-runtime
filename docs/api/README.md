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
      sub: 自身依赖中的subDeps中一员,
      container: 所需要将此插件挂载到哪个div下面,
      data: { // 自身数据，以便查找到对应资源，后续后端支持解压访问后会大改
        //@ts-ignore
        presentableId: presentableId,
        entityNid: subData.entityNid,
        subDependId: sub.id,
        resourceInfo: { resourceId: sub.id },
      },
      entry?: string,
      config?: any
    )
```

```ts
 **用法**
const presentableId = await window.freelogApp.getSelfId(window);
const subData = await window.freelogApp.getSubDep(presentableId);
subData.subDeps.some((sub, index) => {
  if (index === 1) return true;
  window.freelogApp.mountWidget(
    sub,
    document.getElementById("freelog-single"),
    {
      //@ts-ignore
      presentableId: presentableId,
      entityNid: subData.entityNid,
      subDependId: sub.id,
      resourceInfo: { resourceId: sub.id },
    },
    ""
  );
});
```

## getPresentablesPaging

**用途：分页获取展品**

```ts

  **参数说明**
    query:{
      skip: "string", // 从第几个开始
      limit: "string", // 取多少个
      resourceType: "string", // 资源类型
      omitResourceType: "string", // 过滤资源类型
      tags: "string", // 展品和资源标签，多个使用","隔开
      projection: "string",
      keywords: "string",
      isLoadVersionProperty: "string", // 是否加载版本
    }
```

```ts
   **用法**
   const res = await window.freelogApp.getPresentablesPaging(query).then((res)=>{

   })
```

## getPresentablesSearch

**用途：查找展品**

```ts
  **参数说明**
    query:{
      presentableIds: "string", // 展品ids 多个使用","隔开
      resourceIds: "string", // 资源ids
      resourceNames: "string", // 资源名称s
    }
```

```ts
 **用法**

 const res = await window.freelogApp.getPresentablesSearch(query).then((res)=>{
 })
```
## getPresentableDetailById

**用途：获取展品详情**
 ```ts
  **参数说明**
   presentableId: 展品id，
    query:{
        projection:  "string", // 需要指定哪些字段
        isLoadVersionProperty: 0 | 1, // 是否需要展品版本属性
        isLoadCustomPropertyDescriptors: 0 | 1, // 是否加载自定义属性信息
        isLoadResourceDetailInfo: 0 | 1, // 是否加载资源详细信息(额外查询了资源的封面,标签,简介等)
        isLoadResourceVersionInfo: 0 | 1, // 	是否加载资源版本信息(额外查询了资源版本的描述,创建日期,更新日期等)
    }
```

```ts
 **用法**
 const res = await window.freelogApp.getPresentableDetailById(presentableId, query).then((res)=>{

 })
```

## getInfoById

**用途：查找展品信息**

```ts
  const res = await window.freelogApp.getInfoById(presentableId)

  **参数说明**
    presentableIds: "string", // 展品id

```

## getInfoByName

**用途：根据资源 id 或名称查找展品信息**

```ts
  const res = await window.freelogApp.getInfoByName(resourceIdOrName)

  **参数说明**

    resourceIdOrName: "string", // 资源id或名称

```

## getResultById

**用途：查找展品标准授权响应结果**

```ts
  window.freelogApp.getResultById(presentableId)

  **参数说明**

    presentableIds: "string", // 展品id

```

## getResultByName

**用途：根据资源 id 或名称查找展品标准授权响应结果**

```ts
  const res = await window.freelogApp.getResultByName(resourceIdOrName)

  **参数说明**

    resourceIdOrName: "string", // 资源id或名称

```

## getFileStreamById

**用途：获取展品资源文件**

```ts
  const res = await window.freelogApp.getFileStreamById(
    presentableId: string | number,
    returnUrl?: boolean,
    config?: any
  )

  **参数说明**

    presentableId: string,  // 展品id
    returnUrl?: boolean, // 是否只返回url， 例如img标签图片只需要url
    config?: any // axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"

```

## getFileStreamByName

**用途：根据资源 id 或名称获取展品资源文件**

```ts
  const res = await window.freelogApp.getFileStreamByName(
    resourceIdOrName, 
    returnUrl, 
    config
  )

  **参数说明**

    presentableId: string,  // 展品id
    returnUrl?: boolean, // 是否只返回url， 例如img标签图片只需要url
    config?: any // axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"

```

## getSubInfoById

**用途：查找展品子依赖资源信息**

```ts
  const res = await window.freelogApp.getSubInfoById(
      presentableId: string | number,
      parentNid: string,
      subResourceIdOrName: string
  )

  **参数说明**

    presentableId: string,
    parentNid: string,  // 自身链路id
    subResourceIdOrName: string   // 子资源id或名称

```

## getSubInfoByName

**用途：查找展品子依赖资源信息**

```ts
  const res = await window.freelogApp.getSubInfoByName(
      resourceIdOrName: string | number,
      parentNid: string,
      subResourceIdOrName: string
  )

  **参数说明**

    resourceIdOrName: string, // 展品自身的资源名称或id
    parentNid: string,  // 自身链路id
    subResourceIdOrName: string   // 子资源id或名称

```

## getSubResultById

**用途：查找展品子依赖标准授权响应结果**

```ts
  const res = await window.freelogApp.getSubResultById(
      presentableId: string,
      parentNid: string, 
      subResourceIdOrName: string
  )

  **参数说明**

    presentableId: string,
    parentNid: string,  // 自身链路id
    subResourceIdOrName: string   // 子资源id或名称

```

## getSubResultByName

**用途：查找展品子依赖标准授权响应结果**

```ts
  const res = await window.freelogApp.getSubResultByName(
      resourceIdOrName: string | number,
      parentNid: string,
      subResourceIdOrName: string)

  **参数说明**

    resourceIdOrName: string, // 展品自身的资源名称或id
    parentNid: string,  // 自身链路id
    subResourceIdOrName: string   // 子资源id或名称

```

## getSubFileStreamById

**用途：查找展品子依赖资源文件**

```ts
  const res = await window.freelogApp.getSubFileStreamById(
    presentableId: string ,
    parentNid: string,
    subResourceIdOrName: string,
    returnUrl?: boolean,
    config?: any
  )

  **参数说明**

    presentableId: string , // 自身展品id
    parentNid: string,    // 自身链路id
    subResourceIdOrName: string, // 子依赖资源id或名称
    returnUrl?: boolean, // 是否只返回url， 例如img标签图片只需要url
    config?: any // axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"

```

## getSubFileStreamByName

**用途：查找展品信息**

```ts
  const res = await window.freelogApp.getSubFileStreamByName(
    resourceIdOrName: string | number,
    parentNid: string,
    subResourceIdOrName: string,
    returnUrl?: boolean,
    config?: any
  )

  **参数说明**

    resourceIdOrName: string , // 自身资源id或名称
    parentNid: string,    // 自身链路id
    subResourceIdOrName: string, // 子依赖资源id或名称
    returnUrl?: boolean, // 是否只返回url， 例如img标签图片只需要url
    config?: any // axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"

```

## getResourceInfoById

**用途：查找展品资源信息**

```ts
  const res = await window.freelogApp.getResourceInfoById(presentableId)

  **参数说明**

    presentableIds: "string", // 展品id

```

## getResourceInfoByName

**用途：查找展品资源信息**

```ts
  const res = await window.freelogApp.getResourceInfoByName(resourceIdOrName)

  **参数说明**

    resourceIdOrName: "string", // 展品资源id或名称

```

## getSubResourceInfoById

**用途：查找展品的子资源信息**

```ts
 const res = await window.freelogApp.getInfoById(
    presentableId: string | number, 
    parentNid: string, 
    subResourceIdOrName: string
  )

  **参数说明**

    presentableId: string, // 展品id
    parentNid: string,  // 自身链路id
    subResourceIdOrName: string // 子资源id或名称

```

## getSubResourceInfoByName

**用途：查找展品信息**

```ts
  const res = await window.freelogApp.getInfoById(
    resourceIdOrName: string | number,
    parentNid: string,
    subResourceIdOrName: string
  )

  **参数说明**

    resourceIdOrName: string | number, // 自身资源id或名称
    parentNid: string, // 自身链路id
    subResourceIdOrName: string // 子资源id或名称

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

## getSubDep
 
```ts

 **获取自身依赖**
 /**
  * {presentableId: 自身展品id}
 */
 const res = await window.freelogApp.getSubDep(presentableId) 

 **返回值**
  {
    subDeps:  [], // 子依赖数组
    entityNid,  // 自身链路id
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
   {
    presentableId: string,
    resolve: Function,  // 授权成功回调
    reject: Function,  // 授权失败回调
    options?: {
      immediate: boolean  // 是否立即弹出授权窗口
    }
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