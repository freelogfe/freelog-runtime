---
outline: deep
---

# API 调用与返回约定

适用于主题、插件内获得的 `freelogApp`，不是 CLI 或 tools-lib API。组件身份由运行时绑定；源码函数内部首参 `name` 不需要业务代码传入。

| 类别 | 返回形态 | 读取方式 |
| --- | --- | --- |
| 平台 JSON 网络接口 | `Promise<AxiosResponse>` | `res.data` 是业务响应，数据通常在 `res.data.data` |
| 文件默认模式 | `Promise<AxiosResponse>` | 内容取决于接口、`responseType` 和服务端实际响应 |
| 文件 URL 模式 | `Promise<string>` | 直接得到 URL，不发送文件请求，不证明授权成功 |
| 同步上下文与缓存 | 直接对象、数组或标量 | 如 `nodeInfo`、`getCurrentUser()` 和两个 `ForTheme` 方法 |
| 授权与挂载 | 方法专用结果 | 如 `addAuth()` 的结果对象、组件控制器 |

各页 JSON 示例展示业务响应体，不是完整 Axios 对象。请求完成不等于业务成功。

```ts
const res = await freelogApp.getExhibitById("exampleExhibitId");
if (res?.data?.ret !== 0 || res.data.errCode !== 0) {
  throw new Error(res?.data?.msg || "展品查询失败");
}
console.log(res.data.data);
```

当前依赖声明 Axios `^1.9.0`，旧文档的 `0.21.1` 不是 SDK 契约。当前响应拦截器在网络失败时可能使结果为 `undefined`，调用方不能只依赖 `catch`，仍需检查响应是否存在。

数字型开关按对应接口传 `1` / `0`；布尔开关传 `true` / `false`。网络请求最后的 `config` 当前透传 `onUploadProgress`、`onDownloadProgress`、`responseType`、`timeout`；文件 URL 选项位置以各方法页为准，尤其是合集单品依赖文件接口。

[业务状态码](./code.md) · [API 目录](./index.md)
