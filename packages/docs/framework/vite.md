# 本篇介绍了`vite`的接入方式

vite 作为子应用只需`切换到iframe沙箱`，其它操作参考各框架接入文档。

##### 配置主题或插件的基础属性 bundleTool 为 vite，会自动切换到 iframe 沙箱

![bundle](/bundle.png)

##### 没有配置基础属性，可以手动配置切换到 iframe 沙箱

```js
await freelogApp.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-exhibit"),
  topExhibitData: null,
  renderWidgetOptions: {
    iframe: true,
  },
});
```

## 常见问题

#### 1、子应用中操作 location 异常

**原因：**vite 构建 script 的 type 为 module，导致无法拦截 location 操作。

**解决方式：** 使用 MicroApp 提供的 location 进行操作

如：

```js
window.microApp.location.host;
window.microApp.location.origin;
window.microApp.location.href = "xxx";
window.microApp.location.pathname = "xxx";
```
