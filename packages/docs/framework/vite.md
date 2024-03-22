# 本篇介绍了`vite`的接入方式

vite 作为子应用只需`切换到iframe沙箱`，其它操作参考各框架接入文档。

##### 切换到 iframe 沙箱

```html
<micro-app name="xxx" url="xxx" iframe></micro-app>
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
