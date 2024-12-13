# Vite 接入指南

本篇介绍了基于 **Vite** 的微前端接入方式，帮助开发者快速完成接入配置与问题解决。


## 1. 修改 Vite 配置文件

### 修改 `vite.config.js`
将 `base` 属性设置为相对路径 `./`，确保资源路径正确加载：

```js
import { defineConfig } from "vite";

export default defineConfig({
  base: "./", // 设置为相对路径
  ...
});
```


## 2. 切换到 iframe 沙箱

### 通过基础属性自动切换

在微前端运行时，可以通过 `bundleTool` 配置为 `vite`，此时会自动切换到 iframe 沙箱模式：

- **配置示意图：**

![bundle](/bundle.png)

- **加载插件时传递属性：**
   
```js
await freelogApp.mountWidget({
  widget: widget, // 插件
  container: document.getElementById("freelog-exhibit"),
  topExhibitData: null,
  property: property, // 展品或作品的属性
});
```

### 手动切换到 iframe 沙箱

如果基础属性未配置或未传递 `property`，可以手动开启 iframe 沙箱模式：

```js
await freelogApp.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-exhibit"),
  topExhibitData: null,
  property: property, // 展品或作品的属性
  renderWidgetOptions: {
    iframe: true, // 手动开启 iframe 沙箱
  },
});
```


## 常见问题

### 1. 子应用中操作 `location` 异常

**问题原因：**
Vite 构建的脚本默认使用 `type="module"`，导致无法正常拦截 `window.location` 操作。

**解决方案：**
使用 MicroApp 提供的 `location` 对象进行操作，替代原生 `window.location`。

**示例代码：**

```js
// 访问属性
window.microApp.location.host;
window.microApp.location.origin;

// 修改地址
window.microApp.location.href = "https://example.com";
window.microApp.location.pathname = "/new-path";
```


## 总结

以上步骤包括 Vite 的基本配置修改、切换 iframe 沙箱模式以及解决常见问题，确保 Vite 构建的子应用能够顺利接入微前端框架并正常运行。根据实际情况选择适合的配置方案，确保资源加载和沙箱模式的稳定性。
