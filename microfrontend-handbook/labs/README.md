# 机制实验台

[返回实验路线](../11-分层实验与验收矩阵.md) · [实际验证记录](../VALIDATION.md)

在仓库根目录运行：

```powershell
node microfrontend-handbook/labs/serve.mjs
```

浏览器打开终端输出的地址，默认是 `http://127.0.0.1:4318/`。端口已占用时用 `--port 4321`；`Ctrl+C` 停止。服务固定只监听本机，不需要账号、不访问 Freelog 平台、不安装依赖。

它真实加载本仓库现有的 `packages/micro-app2/lib/index.esm.js`，页面会显示版本与 SHA-256。该文件是 **bundler ESM**：虽然没有外部 import，但仍含 `process.env.NODE_ENV` 条件，不能据此称为无环境要求的浏览器原生模块。实验宿主在 module 加载前明确提供 `window.process.env.NODE_ENV = 'development'` 作为教学环境桥接，服务传输的引擎字节保持原样；这不是建议在业务页面伪造完整 Node process。

本实验没有把 `src` 重建成新产物，所以能证明的范围是“当前 lib 在当前浏览器与上述桥接条件中的行为”。文件缺失时服务明确启动失败；先按手册维护流程准备产物，不使用远端 CDN 冒充本地引擎。课堂阅读宿主只扮演装配角色，Freelog 真实主题仍是主应用管理的一个子应用。

## 第一轮怎么做

1. 保持 `with / search / 保留隐藏状态`，分别挂载 A、B。
2. 在快照中找 `probe.owner`、`queryIsSelf`、`rawHasOwner`：预测之后再确认两份同源代码有没有串实例。
3. 在 A 内点击“内部导航”：比较子应用路径和浏览器地址。点击“同步发送两次消息”：观察宿主的一条最终合并数据。
4. 隐藏 A，间隔一秒刷新快照：A 的计数应按子应用主动暂停逻辑停止，B 继续增长。显示 A：`mounts` 应保持，计数恢复。
5. 销毁 A：A 出现在已销毁状态，`cleanups` 增加，框架列表不再有 A；B 应继续运行。
6. 销毁后把 A 切到 iframe 再挂载，对比 `sameArrayConstructor`。这是一份**经典脚本**样本，不能证明原生 ES Module 依赖也经过自定义 fetch/loader。

上述是预期与操作说明，不是本文件自动生成的浏览器通过记录。实际执行结果以手册 `VALIDATION.md` 为准。

## 实验页 API

测试代码只在这个独立实验页面使用 `window.__HANDBOOK_LAB__`；这是观察接口，不是产品 SDK。

```js
const lab = window.__HANDBOOK_LAB__
// 先等待 lab.ready === true，确认引擎与来源信息初始化完成。
await lab.mount('reader-a', {
  sandbox: 'with',       // with | iframe；这里都是经典脚本
  routerMode: 'search',  // search | state | pure
  keepAlive: true,
})
await lab.mount('reader-b')
lab.navigate('reader-a', '/chapter/2')
lab.merge('reader-a')
await lab.wait(50) // 仅给教学通信派发观察留一轮时间，不是生命周期同步合同
console.log(lab.snapshot())
await lab.unmount('reader-a') // keepAlive=true 时隐藏
await lab.mount('reader-a')   // 恢复原实例，等待 aftershow
await lab.unmount('reader-a', { clearAliveState: true }) // 真实卸载但保留引擎可复用状态
await lab.unmount('reader-b', { destroy: true })
```

`mount/unmount` 等待加了 7 秒诊断超时；超时不会谎报成功，也不表示底层异步工作自动取消。为避免教学台自身制造并发竞态，同一实例操作进行中会拒绝下一次切换。新选项只有销毁后重新创建才生效。

`snapshot()` 中 `activeApps/visibleApps/allApps` 来自真实引擎；`apps[name].status` 来自生命周期；`probe` 来自子应用上报，记录 mount/resume 时的对象与节点关系；`ticks` 是实时计时证据；`messages/lastMessage` 是宿主实际收到的通信；`cleanups` 是子应用实际执行 cleanup 的次数。一次 mounted 不能代替这些不同证据。

## 本地 HTTP 合同检查

```powershell
node --test microfrontend-handbook/labs/server.test.mjs
```

这些测试检查页面、真实引擎、子应用资源与 MIME 能被取回，仓库文件及路径穿越不可访问，HTTP 方法与端口参数受控。它们不执行 JavaScript 沙箱，不替代浏览器验证。服务只提供固定白名单，不把整个仓库挂到静态目录。
