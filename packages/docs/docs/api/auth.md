---
outline: deep
---

# 授权处理相关

## callAuth

**用途：呼出授权**

```ts
**用法说明：当addAuth多个未授权展品且没有立刻呼出（或者存在未授权展品且已经addAuth 但用户关闭了，插件想要用户签约时）可以通过callAuth()唤出**
freelogApp.callAuth();
```

## addAuth

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

## resultType

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
