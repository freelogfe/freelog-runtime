# 本篇介绍了`vite`的接入方式

## 1. 修改配置文件。

##### 修改 vite.config.js 文件，将 base 属性设置为相对路径 "./"

```js
export default defineConfig({
  base: "./",
  ...
});
```

## 2. 切换到 iframe 沙箱。

##### 配置主题或插件的基础属性 bundleTool 为 vite，运行时加载主题会自动切换到 iframe 沙箱

##### 加载插件时通过 property 传递展品或作品的属性

![bundle](/bundle.png)

##### 没有配置基础属性或配置了但没有传递 property，可以手动配置切换到 iframe 沙箱

```js
await freelogApp.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-exhibit"),
  topExhibitData: null,
  property: property, // 展品或作品的属性
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
