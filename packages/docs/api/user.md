---
outline: deep
---

# 用户相关

## onLogin

**用途：监听用户登录，登录成功会回调，登录失败不会回调**

```ts
**用法**
// callback: 登录成功的回调，登录失败不会回调
freelogApp.onLogin(callback);
```

## onUserChange

**用途：监听用户登录变化**

```js
**参数说明**
  callback: Function // 一个函数

**用法**
// 当用户在其余页面切换账号，会回调所有函数
freelogApp.onUserChange(callback);
```

## getCurrentUser

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

## setUserData

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

## getUserData

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

## deleteUserData

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

## callLogin

**用途：唤起登录 UI**

**若没有传递 callBack 回调且没有使用 freelogApp.onLogin(callback)监听, 登录成功后会自动刷新整个页面。同时优先执行 onLogin 的回调**

```ts
**参数说明**
// 登录成功：status === freelogApp.resultType.SUCCESS;
// 用户取消：status === freelogApp.resultType.USER_CANCEL;
callback: (status:number)=>any

**用法**
freelogApp.callLogin(callBack)
```

## callLoginOut

**用途：唤起退出登录 UI**

```ts
**用法**
// 登出后会刷新整个页面
freelogApp.callLoginOut()
```

## isUserChange

**用途：用户变化后返回 true，没有变则返回 false**

```ts
**用法**
const flag = freelogApp.isUserChange()
```

<!-- ## pushMessage4Task

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
