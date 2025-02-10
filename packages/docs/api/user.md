# 用户相关 API 文档

## callLogin

**用途**：打开登录界面，处理用户登录逻辑。  
**说明**：  
- 如果没有提供回调函数，登录成功后页面会自动刷新。  
- 如果已经监听了 `onLogin`，登录成功后会优先执行 `onLogin` 的回调。

### **参数**  
- `callback`：登录结果回调函数  
  - **`freelogApp.resultType.SUCCESS`**：登录成功  
  - **`freelogApp.resultType.USER_CANCEL`**：用户取消登录  

### **示例代码**  
```ts
freelogApp.callLogin((status) => {
  if (status === freelogApp.resultType.SUCCESS) {
    console.log("登录成功");
  } else if (status === freelogApp.resultType.USER_CANCEL) {
    console.log("用户取消了登录");
  }
});
```


## callLoginOut

**用途**：退出当前账号登录状态。  
**说明**：登出后页面会自动刷新。

### **示例代码**  
```ts
freelogApp.callLoginOut();
```


## onLogin

**用途**：监听用户登录事件，捕获登录成功或失败的回调。  

### **参数**  
- `resolve`：登录成功后的回调函数  
- `reject`：用户关闭登录窗口后的回调函数  

### **示例代码**  
```ts
freelogApp.onLogin(
  () => {
    console.log("登录成功");
  },
  () => {
    console.log("用户关闭了登录窗口");
  }
);
```


## onUserChange

**用途**：监听用户在其他页面切换账号的事件，并在当前页面触发回调。  

### **参数**  
- `callback`：账号切换时触发的回调函数

### **示例代码**  
```ts
freelogApp.onUserChange(() => {
  console.log("检测到账号切换，刷新数据");
});
```


## isUserChange

**用途**：检测用户在其他页面是否切换了账号。

### **返回值**  
- `true`：账号已发生变化  
- `false`：账号未变化

### **示例代码**  
```ts
const hasChanged = freelogApp.isUserChange();
if (hasChanged) {
  console.log("检测到账号变化，重新加载数据");
}
```


## getCurrentUser

**用途**：获取当前登录用户的基本信息。

### **返回值**  
| 字段       | 类型     | 说明       |
|------------|----------|------------|
| `username` | `string` | 用户名称   |
| `headImage`| `string` | 用户头像地址|

### **示例代码**  
```ts
const userInfo = freelogApp.getCurrentUser();
if (userInfo) {
  console.log("用户名：", userInfo.username);
  console.log("用户头像：", userInfo.headImage);
} else {
  console.log("用户未登录");
}
```


## setUserData

**用途**：保存或更新当前用户的自定义数据。

### **参数**  
- `key`：自定义数据的键名  
- `data`：要保存的数据对象

### **示例代码**  
```ts
const userData = {
  visitCount: 55,
  adCount: 33,
};
freelogApp.setUserData("testData", userData).then((res) => {
  console.log("数据保存成功：", res.data);
});
```

**成功返回示例**：
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

**用途**：获取指定 `key` 下保存的用户数据。

### **参数**  
- `key`：自定义数据的键名

### **示例代码**  
```ts
freelogApp.getUserData("testData").then((res) => {
  console.log("获取到用户数据：", res.data);
});
```

**成功返回示例**：
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


## deleteUserData

**用途**：删除指定 `key` 下保存的用户数据。

### **参数**  
- `key`：自定义数据的键名

### **示例代码**  
```ts
freelogApp.deleteUserData("testData").then((res) => {
  console.log("数据删除成功");
});
```

**成功返回示例**：
```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": null
}
```

