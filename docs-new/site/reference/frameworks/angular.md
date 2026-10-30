
::: info 进阶参考的适用范围
本页从已有文档迁移，保留框架或库的具体示例。先阅读[运行时接入](/runtime/quickstart)及[兼容边界](/runtime/compatibility)。框架示例有各自版本前提，不构成平台统一 Node.js 限制；不能直接组合不同框架或不同年代的配置。
:::
# angular

#### 1、在主应用中引入`zone.js`

如果主应用非 angular，那么主应用需要引入`zone.js`才能正确加载 angular 子应用。

步骤 1、安装依赖

```js
npm i zone.js --save
```

步骤 2、在主应用中引入 zone.js

```js
import "zone.js";
```

#### 2、设置跨域支持

angular 官方脚手架创建的项目在开发环境下默认支持跨域访问，不需要特殊处理。

其它项目在`webpack-dev-server`中添加 headers。

```js
headers: {
  'Access-Control-Allow-Origin': '*',
}
```

#### 3、监听卸载事件

子应用被卸载时会接受到一个名为`unmount`的事件，在此可以进行卸载相关操作。

```js
// main.ts
let app: void | NgModuleRef<AppModule>;
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((res: NgModuleRef<AppModule>) => {
    app = res;
  });

// 监听卸载操作
window.unmount = () => {
  app && app.destroy();
  app = undefined;
};
```

完成以上步骤在运行时即可正常渲染。

### 可选设置

以下配置是针对子应用的，它们是可选的，建议根据实际情况选择设置。

#### 1、开启 umd 模式，优化内存和性能

MicroApp 支持两种渲染在运行时的模式，默认模式和 umd 模式。

- **默认模式：**子应用在初次渲染和后续渲染时会顺序执行所有 js，以保证多次渲染的一致性。
- **umd 模式：**子应用暴露出`mount`、`unmount`方法，此时只在初次渲染时执行所有 js，后续渲染只会执行这两个方法，在多次渲染时具有更好的性能和内存表现。

如果子应用渲染和卸载不频繁，那么使用默认模式即可，如果子应用渲染和卸载非常频繁建议使用 umd 模式。

```js
// main.ts
import { NgModuleRef  } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

declare global {
  interface Window {
    microApp: any
    mount: CallableFunction
    unmount: CallableFunction
    __MICRO_APP_ENVIRONMENT__: string
  }
}

let app: void | NgModuleRef<AppModule>
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then((res: NgModuleRef<AppModule>) => {
      app = res
    })
    .catch(err => console.error(err))
}

// 👇 将卸载操作放入 unmount 函数，就是上面步骤2中的卸载函数
window.unmount = () => {
  // angular在部分场景下执行destroy时会删除根元素app-root，导致在此渲染时报错，此时可删除app.destroy()来避免这个问题
  app && app.destroy();
  app = undefined;
}

// 如果不在运行时环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount();
}
```

#### 2、设置 webpack.jsonpFunction

如果在运行时正常运行，则可以忽略这一步。

如果子应用资源加载混乱导致渲染失败，可以尝试设置`jsonpFunction`来解决，因为相同的`jsonpFunction`名称会导致资源污染。

这种情况常见于主应用和子应用都是通过`create-react-app`等脚手架创建的 react 项目，vue 项目中并不常见。

**解决方式：修改子应用的 webpack 配置**

<!-- tabs:start -->

#### ** webpack4 **

```js
// webpack.config.js
module.exports = {
  output: {
    ...
    jsonpFunction: `webpackJsonp_自定义名称`,
    globalObject: 'window',
  },
}
```

#### ** webpack5 **

```js
// webpack.config.js
module.exports = {
  output: {
    ...
    chunkLoadingGlobal: 'webpackJsonp_自定义名称',
    globalObject: 'window',
  },
}
```

<!-- tabs:end -->

#### 3、设置 publicPath

如果子应用出现静态资源地址 404(js、css、图片)，建议设置`publicPath`来尝试解决这个问题。

`publicPath`是 webpack 提供的功能，它可以补全静态资源的地址，详情参考 webpack 文档 [publicPath](https://webpack.docschina.org/guides/public-path/#on-the-fly)

**步骤 1:** 在子应用 src 目录下创建名称为`public-path.ts`的文件，并添加如下内容

```js
// __MICRO_APP_ENVIRONMENT__和__MICRO_APP_PUBLIC_PATH__是由micro-app注入的全局变量
if (window.__MICRO_APP_ENVIRONMENT__) {
  // eslint-disable-next-line
  __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__;
}
```

**步骤 2:** 在子应用入口文件的**最顶部**引入`public-path.ts`

```js
// entry
import "./public-path";
```

#### 4、切换到 iframe 沙箱

MicroApp 有两种沙箱方案：`with沙箱`和`iframe沙箱`。

默认开启 with 沙箱，如果 with 沙箱无法正常运行，可以尝试切换到 iframe 沙箱。

## 常见问题

#### 1、通过 micro-app 数据通信修改 angular 组件数据后视图不更新

**原因：**因为在 angular 区域外调用了内部的代码(主应用和子应用属于不同的 angular 区域)，angular 无法知道状态发生了变化。

**解决方式：**通过`ngZone.run()`触发更改检测，具体方式如下：

![angular-question3](https://img14.360buyimg.com/imagetools/jfs/t1/207551/36/34684/49729/6523aee1F5efef0be/e50e6d782a223dc9.png ":size=800")

#### 2、主应用是 react、nextjs 应用，引入 zone.js 后导致 micro-app 元素生命周期异常

目前无法解决，请暂停使用生命周期函数。
