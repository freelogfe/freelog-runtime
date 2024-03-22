---
outline: deep
---

# 指南

## 介绍

### 概念

在 Freelog 平台，插件是指作品类型为插件的功能性作品，一般作为主题的依赖在节点发挥作用，决定节点中内容型展品的访问、展示和交互方式。

插件可以是一个播放器、一个图床、一个目录菜单或者一个小说阅读器。

### 通俗解释

**插件是一个运行在我司平台运行时的可管控的一个完整应用或组件**

**后面出现的运行时皆指平台运行时**

### 运行原理

**本平台使用腾讯京东微前端框架**
[https://micro-zoe.github.io/micro-app/docs.html#/](https://micro-zoe.github.io/micro-app/docs.html#/)

## 示例节点代码仓

[https://github.com/freelogfe/freelog-sample-themes.git](https://github.com/freelogfe/freelog-sample-themes.git)

## 基础使用案例代码仓

[https://github.com/freelogfe/freelog-developer-guide-examples.git](https://github.com/freelogfe/freelog-developer-guide-examples.git)

### 有意思的怀旧红白机

[https://nes-game.freelog.com](https://nes-game.freelog.com)

### 框架改造

**参考下面链接**
[https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/framework/introduce](https://micro-zoe.github.io/micro-app/docs.html#/zh-cn/framework/introduce)

## 基础开发

### https 证书准备（必须）

**由于浏览器安全限制，本地开发需要本地以 https 启动**

webpack 请参考 webpack-mkcert 工具

[https://www.npmjs.com/package/webpack-mkcert](https://www.npmjs.com/package/webpack-mkcert)

vite 请参考 @vitejs/plugin-basic-ssl 插件

[https://github.com/vitejs/vite-plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl)

### chrome 无法访问 localhost 问题

地址栏输入：chrome://flags/#block-insecure-private-network-requests

把 Block insecure private network requests. 设置为 disabled

如图
![chrome](/chrome.png)

### 创建一个节点和主题

进入 console.freelog.com ---> 节点管理

创建节点后必须建一个主题作品并签约激活

假设节点为https://examples.freelog.com/

用于开发的测试节点为https://t.examples.freelog.com/

### 连接节点与插件

启动插件，例如‘https://localhost:7101’

在节点 url 的https://t.examples.freelog.com/后面加上

```ts
"https://t.examples.freelog.com/?dev=https://localhost:7101";
```

此时插件是作为节点主题（即入口）使用

### 安装 api 库

```ts
 npm install freelog-runtime
 // 使用前导入
 import { freelogApp } from "freelog-runtime"
```

### 获取节点信息

```ts
import { freelogApp } from "freelog-runtime";
// 目前没有权限控制，主题和插件都可以获取到，后期整体考虑权限时会限制插件使用
// 如果使用到了节点信息，插件开发者应当在使用说明里明确使用到了节点信息以及无法获取到的影响
const nodeInfo = freelogApp.nodeInfo;
```

### 加载自身的子依赖插件

[查看 mountWidget 详情](/api/#mountwidget)

```ts
import { freelogApp } from "freelog-runtime";
const subData = await freelogApp.getSubDep();
// 示范代码，这里只加载一个
subData.subDep.some((sub, index) => {
  if (index === 1) return true;
  let widgetController = await freelogApp.mountWidget({
    widget: sub, // 必传，子插件数据
    container: document.getElementById("freelog-single"), // 必传，自定义一个让插件挂载的div容器
    topExhibitData: subData, // 必传，最外层展品数据（子孙插件都需要用）
    renderWidgetOptions: {}, // 插件渲染配置
    config: {}, // 子插件配置数据, 子插件可以通过freelogApp.getSelfConfig()获取配置数据
    seq: string, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
    widget_entry: string, // 本地url，dev模式下，可以使用本地url调试子插件
  });
});
```

### 加载展品插件

[查看 mountWidget 详情](/api/#mountwidget)

```ts
import { freelogApp } from "freelog-runtime";
const res = await freelogApp.getExhibitListById({
  articleResourceTypes: "widget",
  isLoadVersionProperty: 1,
});
const widgets = res.data.data.dataList;
// 示范代码，这里只加载一个
widgets.some((widget, index) => {
  if (index === 1) return true;
  // mountWidget最终使用jd的freelogApp.renderApp来加载主题插件
  let widgetController = await freelogApp.mountWidget({
    widget: widget,
    container: document.getElementById("freelog-single"), // 给每一个提供不同的容器
    topExhibitData: null,
    config: {},
    renderWidgetOptions: {}, // 插件渲染配置
    seq: string,
    widget_entry: string,
  });
});
```

### 父子插件入口通信

```ts
// 父插件（或主题）
import { freelogApp } from "freelog-runtime";
const res = await freelogApp.getExhibitListById({
  articleResourceTypes: "widget",
  isLoadVersionProperty: 1,
});
const widgets = res.data.data.dataList;
// 示范代码，这里只加载一个
widgets.some((widget, index) => {
  if (index === 1) return true;
  // mountWidget最终使用jd的freelogApp.renderApp来加载主题插件
  let widgetController = await freelogApp.mountWidget({
    widget: widget,
    container: document.getElementById("freelog-single"), // 给每一个提供不同的容器
    topExhibitData: null,
    config: {},
    renderWidgetOptions: {}, // 配置将合并到freelogApp.renderApp的配置项中
    seq: string,
    widget_entry: string,
  });
});
// 父插件获取子插件注册的api
widgets.getApi().changeMe();

// 子插件，在入口处执行
freelogApp.registerApi({
  changeMe: () => {
    const store = useCounterStore();
    store.increment();
  },
});
```

### 单独调试某个插件

当需要跳过主题直接调试正在运行的子插件或展品插件

定义： `${url}?dev=replace&${widgetId}=${local_entry}`

url: 节点地址

widgetId: 插件 ID 这里用的是插件的作品 ID: articleId
获取方式：插件内可以通过 freelogApp.getSelfWidgetId()获取，但先有鸡才能有蛋，后续要在作品管理页面以及测试节点提供获取途径。
目前开发者可以 F12 去找一下。

local_entry: 本地地址

举例：

```ts
https://nes-common.freelog.com/?dev=replace&62270c5cf670b2002e800193=https://localhost:7107/
```

<!-- ### 插件卸载

当插件挂载的容器在组件内部或与组件同生同灭时，在组件卸载前需要卸载插件，否则再次加载会有问题。

vue 案例：[前往示例代码](https://github.com/freelogfe/freelog-developer-guide-examples/blob/main/examples/vue3-ts-theme/src/views/widget/WidgetMount.vue)

```ts
// vue示例
onBeforeUnmount(() => {
  freelogApp.destroyWidget(exhibitWidget.widgetId);
});

// react示例
useEffect(() => {
  return () => {
    freelogApp.destroyWidget(exhibitWidget.widgetId);
  };
});
``` -->

### 获取插件自身配置数据

```ts
// 父插件的传递过来的config数据也会在这里
const widgetConfig = freelogApp.getSelfConfig();
```

### 移动端适配

**除媒体查询外，支持最新的问题最少的最好的 viewport 兼容方案**

**推荐使用 postcss-px-to-viewport 插件, 各框架具体使用方法请百度**

```ts
**viewport修改用法**
freelogApp.setViewport(keys: any)
keys = {
  width: "device-width", // immutable
  height: "device-height", // not supported in browser
  "initial-scale": 1, // 0.0-10.0   available for theme
  "maximum-scale": 1, // 0.0-10.0   available for theme
  "minimum-scale": 1, // 0.0-10.0   available for theme
  "user-scalable": "no", // available for theme
  "viewport-fit": "auto", // not supported in browser
}
```

## 插件数据通信

`freelog`提供了一套灵活的数据通信机制，方便父插件和子插件之间的数据传输。

父插件和子插件之间的通信是绑定的，父插件只能向指定的子插件发送数据，子插件只能向父插件发送数据，这种方式可以有效的避免数据污染，防止多个子插件之间相互影响。

同时我们也提供了全局通信，方便跨应用之间的数据通信。

### 子插件获取来自父插件的数据

有两种方式获取来自父插件的数据：

#### 方式 1：直接获取数据

```ts
const data = freelogApp.getData(); // 返回父插件下发的data数据
```

#### 方式 2：绑定监听函数

```ts
/**
 * 绑定监听函数，监听函数只有在数据变化时才会触发
 * dataListener: 绑定函数
 * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
 * !!!重要说明: 因为子插件是异步渲染的，而父插件发送数据是同步的，
 * 如果在子插件渲染结束前父插件发送数据，则在绑定监听函数前数据已经发送，在初始化后不会触发绑定函数，
 * 但这个数据会放入缓存中，此时可以设置autoTrigger为true主动触发一次监听函数来获取数据。
 */
freelogApp.addDataListener(dataListener: (data: Object) => any, autoTrigger?: boolean)

// 解绑监听函数
freelogApp.removeDataListener(dataListener: (data: Object) => any)

// 清空当前子插件的所有绑定函数(全局数据函数除外)
freelogApp.clearDataListener()
```

**使用方式：**

```ts
// 监听函数
function dataListener(data) {
  console.log("来自父插件的数据", data);
}

// 监听数据变化
freelogApp.addDataListener(dataListener);

// 监听数据变化，初始化时如果有数据则主动触发一次
freelogApp.addDataListener(dataListener, true);

// 解绑监听函数
freelogApp.removeDataListener(dataListener);

// 清空当前子插件的所有绑定函数(全局数据函数除外)
freelogApp.clearDataListener();
```

### 子插件向父插件发送数据

```ts
// dispatch只接受对象作为参数
freelogApp.dispatch({ type: "子插件发送给父插件的数据" });
```

dispatch 只接受对象作为参数，它发送的数据都会被缓存下来。

micro-app 会遍历新旧值中的每个 key 判断值是否有变化，如果所有数据都相同则不会发送（注意：只会遍历第一层 key），如果数据有变化则将**新旧值进行合并**后发送。

例如：

```ts
// 第一次发送数据，记入缓存值 {name: 'jack'}，然后发送
freelogApp.dispatch({ name: "jack" });
```

```ts
// 第二次发送数据，将新旧值合并为 {name: 'jack', age: 20}，记入缓存值，然后发送
freelogApp.dispatch({ age: 20 });
```

```ts
// 第三次发送数据，新旧值合并为 {name: 'jack', age: 20}，与缓存值相同，不再发送
freelogApp.dispatch({ age: 20 });
```

##### dispatch 是异步执行的，多个 dispatch 会在下一帧合并为一次执行

例如：

```ts
freelogApp.dispatch({ name: "jack" });
freelogApp.dispatch({ age: 20 });

// 上面的数据会在下一帧合并为对象{name: 'jack', age: 20}一次性发送给父插件
```

##### dispatch 第二个参数为回调函数，它会在数据发送结束后执行

例如：

```ts
freelogApp.dispatch({ city: "HK" }, () => {
  console.log("数据已经发送完成");
});
```

##### 当数据监听函数有返回值时，会作为 dispatch 回调函数的入参

例如：

_父插件：_

```ts
// widgetController为freelogApp.mountWidget的返回对象
widgetController.addDataListener((data) => {
  console.log("来自子插件my-app的数据", data);

  return "返回值1";
});

// widgetController为freelogApp.mountWidget的返回对象
widgetController.addDataListener((data) => {
  console.log("来自子插件my-app的数据", data);

  return "返回值2";
});
```

_子插件：_

```ts
// 返回值会放入数组中传递给dispatch的回调函数
freelogApp.dispatch({ city: "HK" }, (res: any[]) => {
  console.log(res); // ['返回值1', '返回值2']
});
```

##### forceDispatch：强制发送

forceDispatch 方法拥有和 dispatch 一样的参数和行为，唯一不同的是 forceDispatch 会强制发送数据，无论数据是否变化。

例如：

```ts
// 强制发送数据，无论缓存中是否已经存在 name: 'jack' 的值
freelogApp.forceDispatch({ name: "jack" }, () => {
  console.log("数据已经发送完成");
});
```

### 父插件向子插件发送数据

父插件向子插件发送数据有两种方式：

#### 方式 1: 通过 data 属性发送数据

<!-- tabs:start -->

**开始使用**

```ts
let widgetController = await freelogApp.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-single"), // 给每一个提供不同的容器
  topExhibitData: null,
  config: {},
  renderWidgetOptions: {
    data: { type: "新的数据" }, // 我是data数据，子插件通过freelogApp.getData()获取
  }, // 插件渲染配置
  seq: string,
  widget_entry: string,
});
```

<!-- tabs:end -->

#### 方式 2: 手动发送数据

手动发送数据需要通过`name`指定接受数据的子插件，此值和`<micro-app>`元素中的`name`一致。

```ts
// widgetController为freelogApp.mountWidget的返回对象
widgetController.setData({ type: "新的数据" });
```

setData 第一个参数为子插件名称，第二个参数为传递的数据，它发送的数据都会被缓存下来。

micro-app 会遍历新旧值中的每个 key 判断值是否有变化，如果所有数据都相同则不会发送（注意：只会遍历第一层 key），如果数据有变化则将**新旧值进行合并**后发送。

例如：

```ts
// 第一次发送数据，记入缓存值 {name: 'jack'}，然后发送
widgetController.setData({ name: "jack" });
```

```ts
// 第二次发送数据，将新旧值合并为 {name: 'jack', age: 20}，记入缓存值，然后发送
widgetController.setData({ age: 20 });
```

```ts
// 第三次发送数据，新旧值合并为 {name: 'jack', age: 20}，与缓存值相同，不再发送
widgetController.setData({ age: 20 });
```

##### setData 是异步执行的，多个 setData 会在下一帧合并为一次执行

例如：

```ts
widgetController.setData({ name: "jack" });
widgetController.setData({ age: 20 });

// 上面的数据会在下一帧合并为对象{name: 'jack', age: 20}一次性发送给子插件my-app
```

##### setData 第三个参数为回调函数，它会在数据发送结束后执行

例如：

```ts
widgetController.setData({ city: "HK" }, () => {
  console.log("数据已经发送完成");
});
```

##### 当数据监听函数有返回值时，会作为 setData 回调函数的入参

例如：

_子插件：_

```ts
freelogApp.addDataListener((data) => {
  console.log("来自父插件的数据", data);

  return "返回值1";
});

freelogApp.addDataListener((data) => {
  console.log("来自父插件的数据", data);

  return "返回值2";
});
```

_父插件：_

```ts
// 返回值会放入数组中传递给setData的回调函数
widgetController.setData({ city: "HK" }, (res: any[]) => {
  console.log(res); // ['返回值1', '返回值2']
});
```

##### forceSetData：强制发送

forceSetData 方法拥有和 setData 一样的参数和行为，唯一不同的是 forceSetData 会强制发送数据，无论数据是否变化。

例如：

```ts
// 强制发送数据，无论缓存中是否已经存在 name: 'jack' 的值
widgetController.forceSetData({ name: "jack" }, () => {
  console.log("数据已经发送完成");
});
```

### 父插件获取来自子插件的数据

父插件获取来自子插件的数据有三种方式：

#### 方式 1：直接获取数据

```ts
const childData = widgetController.getData(); // 返回子插件的data数据
```

#### 方式 2: 监听自定义事件 (datachange)

<!-- tabs:start -->

**开始使用**

```ts
let widgetController = await freelogApp.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-single"), // 给每一个提供不同的容器
  topExhibitData: null,
  config: {},
  renderWidgetOptions: {
    data: { type: "新的数据" }, // 我是data数据，子插件通过freelogApp.getData()获取
    onDataChange: (e) => console.log("来自子插件的数据：", e.detail.data), // 我是监听来自子插件的数据
  }, // 插件渲染配置
  seq: string,
  widget_entry: string,
});
```

<!-- tabs:end -->

注意：`datachange`绑定函数的返回值不会作为子插件 dispatch 回调函数的入参，它的返回值没有任何作用。

#### 方式 3: 绑定监听函数

绑定监听函数需要通过`name`指定子插件，此值和`<micro-app>`元素中的`name`一致。

```ts


/**
 * 绑定监听函数
 * dataListener: 绑定函数
 * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
 */
widgetController.addDataListener(dataListener: (data: Object) => any, autoTrigger?: boolean)

// 解绑监听子插件的函数
widgetController.removeDataListener(dataListener: (data: Object) => any)

// 清空监听子插件的函数
widgetController.clearDataListener()
```

**使用方式：**

```ts
// 监听函数
function dataListener(data) {
  console.log("来自子插件的数据", data);
}

// 监听来自子插件当前的数据
widgetController.addDataListener(dataListener);

// 解绑监听当前子插件的函数
widgetController.removeDataListener(dataListener);

// 清空所有监听当前子插件的函数
widgetController.clearDataListener();
```

### 清空数据

由于通信的数据会被缓存，即便子插件被卸载也不会清空，这可能会导致一些困扰，此时可以主动清空缓存数据来解决。

<!-- tabs:start -->

##### 父插件

<!-- #### 方式一：配置项 - clear-data

- 使用方式: `<micro-app clear-data></micro-app>`

当设置了`clear-data`，子插件卸载时会同时清空父插件发送给当前子插件，和当前子插件发送给父插件的数据。

[destroy](/zh-cn/configure?id=destroy)也有同样的效果。 -->

###### 手动清空 - clearData

```ts
// 清空父插件发送给当前子插件的数据
widgetController.clearData();
```

#### 子插件

##### 手动清空 - clearData

```ts
// 清空当前子插件发送给父插件的数据
freelogApp.clearData();
```

<!-- tabs:end -->

### 全局数据通信

全局数据通信会向父插件和所有子插件发送数据，在跨应用通信的场景中适用。

#### 发送全局数据

<!-- tabs:start -->

**父插件**

```ts
// setGlobalData只接受对象作为参数
freelogApp.setGlobalData({ type: "全局数据" });
```

**子插件**

```ts
// setGlobalData只接受对象作为参数
freelogApp.setGlobalData({ type: "全局数据" });
```

<!-- tabs:end -->

setGlobalData 只接受对象作为参数，它发送的数据都会被缓存下来。

micro-app 会遍历新旧值中的每个 key 判断值是否有变化，如果所有数据都相同则不会发送（注意：只会遍历第一层 key），如果数据有变化则将**新旧值进行合并**后发送。

例如：

<!-- tabs:start -->

**父插件**

```ts
// 第一次发送数据，记入缓存值 {name: 'jack'}，然后发送
freelogApp.setGlobalData({ name: "jack" });
```

```ts
// 第二次发送数据，将新旧值合并为 {name: 'jack', age: 20}，记入缓存值，然后发送
freelogApp.setGlobalData({ age: 20 });
```

```ts
// 第三次发送数据，新旧值合并为 {name: 'jack', age: 20}，与缓存值相同，不再发送
freelogApp.setGlobalData({ age: 20 });
```

**子插件**

```ts
// 第一次发送数据，记入缓存值 {name: 'jack'}，然后发送
freelogApp.setGlobalData({ name: "jack" });
```

```ts
// 第二次发送数据，将新旧值合并为 {name: 'jack', age: 20}，记入缓存值，然后发送
freelogApp.setGlobalData({ age: 20 });
```

```ts
// 第三次发送数据，新旧值合并为 {name: 'jack', age: 20}，与缓存值相同，不再发送
freelogApp.setGlobalData({ age: 20 });
```

<!-- tabs:end -->

**setGlobalData 是异步执行的，多个 setGlobalData 会在下一帧合并为一次执行**

例如：

<!-- tabs:start -->

**父插件**

```ts
freelogApp.setGlobalData({ name: "jack" });
freelogApp.setGlobalData({ age: 20 });

// 上面的数据会在下一帧合并为对象{name: 'jack', age: 20}一次性发送给父插件
```

**子插件**

```ts
freelogApp.setGlobalData({ name: "jack" });
freelogApp.setGlobalData({ age: 20 });

// 上面的数据会在下一帧合并为对象{name: 'jack', age: 20}一次性发送给父插件
```

<!-- tabs:end -->

**setGlobalData 第二个参数为回调函数，它会在数据发送结束后执行**

例如：

<!-- tabs:start -->

**父插件**

```ts
freelogApp.setGlobalData({ city: "HK" }, () => {
  console.log("数据已经发送完成");
});
```

**子插件**

```ts
freelogApp.setGlobalData({ city: "HK" }, () => {
  console.log("数据已经发送完成");
});
```

<!-- tabs:end -->

**当全局数据的监听函数有返回值时，会作为 setGlobalData 回调函数的入参**

例如：

<!-- tabs:start -->

**父插件**

```ts
freelogApp.addGlobalDataListener((data) => {
  console.log("全局数据", data);

  return "返回值1";
});

freelogApp.addGlobalDataListener((data) => {
  console.log("全局数据", data);

  return "返回值2";
});
```

```ts
// 返回值会放入数组中传递给setGlobalData的回调函数
freelogApp.setGlobalData({ city: "HK" }, (res: any[]) => {
  console.log(res); // ['返回值1', '返回值2']
});
```

**子插件**

```ts
freelogApp.addGlobalDataListener((data) => {
  console.log("全局数据", data);

  return "返回值1";
});

freelogApp.addGlobalDataListener((data) => {
  console.log("全局数据", data);

  return "返回值2";
});
```

```ts
// 返回值会放入数组中传递给setGlobalData的回调函数
freelogApp.setGlobalData({ city: "HK" }, (res: any[]) => {
  console.log(res); // ['返回值1', '返回值2']
});
```

<!-- tabs:end -->

**forceSetGlobalData：强制发送**

forceSetGlobalData 方法拥有和 setGlobalData 一样的参数和行为，唯一不同的是 forceSetGlobalData 会强制发送数据，无论数据是否变化。

例如：

<!-- tabs:start -->

**父插件**

```ts
// 强制发送数据，无论缓存中是否已经存在 name: 'jack' 的值
freelogApp.forceSetGlobalData({ name: "jack" }, () => {
  console.log("数据已经发送完成");
});
```

**子插件**

```ts
// 强制发送数据，无论缓存中是否已经存在 name: 'jack' 的值
freelogApp.forceSetGlobalData({ name: "jack" }, () => {
  console.log("数据已经发送完成");
});
```

<!-- tabs:end -->

#### 获取全局数据

<!-- tabs:start -->

##### 父插件

```ts
// 直接获取数据
const globalData = freelogApp.getGlobalData() // 返回全局数据

function dataListener (data) {
  console.log('全局数据', data)
}

/**
 * 绑定监听函数
 * dataListener: 绑定函数
 * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
 */
freelogApp.addGlobalDataListener(dataListener: (data: Object) => any, autoTrigger?: boolean)

// 解绑监听函数
freelogApp.removeGlobalDataListener(dataListener: (data: Object) => any)

// 清空父插件绑定的所有全局数据监听函数
freelogApp.clearGlobalDataListener()
```

##### 子插件

```ts
// 直接获取数据
const globalData = freelogApp.getGlobalData() // 返回全局数据

function dataListener (data) {
  console.log('全局数据', data)
}

/**
 * 绑定监听函数
 * dataListener: 绑定函数
 * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
 */
freelogApp.addGlobalDataListener(dataListener: (data: Object) => any, autoTrigger?: boolean)

// 解绑监听函数
freelogApp.removeGlobalDataListener(dataListener: (data: Object) => any)

// 清空当前子插件绑定的所有全局数据监听函数
freelogApp.clearGlobalDataListener()
```

<!-- tabs:end -->

#### 清空全局数据

<!-- tabs:start -->

##### 父插件

```ts
// 清空全局数据
freelogApp.clearGlobalData();
```

##### 子插件

```ts
// 清空全局数据
freelogApp.clearGlobalData();
```

## 展品相关

### 获取展品

**分页列表**

```ts
const res = await freelogApp.getExhibitListByPaging({
  skip: 0,
  limit: 20,
});
```

[查看 getExhibitListByPaging 详情](/api/#getexhibitlistbypaging)

**查找展品**

```ts
const res = freelogApp.getExhibitListById(query)

**参数说明**
  query:{
    exhibitIds: string,  展品ids 多个使用","隔开
    isLoadVersionProperty: 0 | 1, 可选，是否加载版本信息,默认0
  }
```

[查看 getExhibitListById 详情](/api/#getexhibitlistbyid)

### 获取单个展品详情

```ts
const res = await  freelogApp.getExhibitInfo(exhibitId, query)

**参数说明**
  exhibitId: 展品id，
  query:{
      isLoadVersionProperty: 0 | 1, // 是否需要展品版本属性
  }
```

[查看 getExhibitInfo 详情](/api/#getexhibitinfo)

### 获取展品作品

```ts
const res = await freelogApp.getExhibitFileStream(
  exhibitId,
  options
)

**参数说明**
  exhibitId: // 展品id，
  options: {
    returnUrl?: boolean; // 是否只返回url， 例如img标签图片只需要url
    config?: any; // axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"
    subFilePath?: string; // 漫画中的图片等子文件的路径
  },
```

### 展品子依赖列表

**在 获取展品 与 获取单个展品详情 接口返回数据中**

```ts
  **如下所示，数组versionInfo.dependencyTree就是该展品的所有子孙依赖列表**
  **第一个为自身，通过自身的nid去找出parentNid为该nid的依赖即为直接子依赖**
  {
	"ret": 0,
	"errCode": 0,
	"errcode": 0,
	"msg": "success",
	"data": {
		"exhibitId": "61b99394c9dacc002e9f5821",
    ...
		"versionInfo": {
			"exhibitId": "61b99394c9dacc002e9f5821",
			"exhibitProperty": {
				"fileSize": 6234,
				"mime": "text/markdown"
			},
			"dependencyTree": [{
				"nid": "61b99394c9da",
				"articleId": "61b993157841ed002e5c96ca",
				"articleName": "ZhuC/测试md",
				"articleType": 1,
				"version": "0.1.1",
				"versionRange": "0.1.1",
				"resourceType": ["markdown"],
				"versionId": "0d786f5b273bc549454b55ea649569a3",
				"deep": 1,
				"parentNid": ""
			}, {
				"nid": "9091f75e23fb",
				"articleId": "61b9a82f2ae3ac002eb7993a",
				"articleName": "ZhuC/元宇宙",
				"articleType": 1,
				"version": "0.1.0",
				"versionRange": "^0.1.0",
				"resourceType": ["video"],
				"versionId": "85fa350f4d003d0adea1fffc2852891d",
				"deep": 2,
				"parentNid": "61b99394c9da"
			}]
		}
	}
}
```

### 批量查询展品依赖的作品信息

```ts
const res = await freelogApp.getExhibitDepInfo(
  exhibitId,
  articleNids
)
**参数说明**
  exhibitId: string ,  自身展品id
  articleNids: string, 链路id
```

### 获取子依赖作品文件

```ts
const res = await freelogApp.getExhibitDepFileStream(
  exhibitId: string ,
  parentNid: string,
  subArticleIdOrName: string,
  returnUrl?: boolean,
  config?: any
)

**参数说明**
  exhibitId: string , // 自身展品id
  parentNid: string,    // 自身链路id
  subArticleIdOrName: string, // 子依赖作品id或名称
  returnUrl?: boolean, // 是否只返回url， 例如img标签图片只需要url
  config?: any // axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"
```

### 查找展品签约数量

**同一个用户的多次签约只计算一次**

```ts
const res = await freelogApp.getExhibitSignCount(
  exhibitIds: string
)

**参数说明**
  exhibitIds: 用英文逗号隔开的展品id
```

### 批量查询展品授权

```ts
const res = await freelogApp.getExhibitAuthStatus(
  exhibitIds: string
)

**参数说明**
  exhibitIds:  用英文逗号隔开的展品id
```

### 批量查询展品是否可用（即能否提供给用户签约）

```ts
const res = await freelogApp.getExhibitAvailalbe(
  exhibitIds: string
)

**参数说明**
  exhibitIds:  用英文逗号隔开的展品id
```

[查看 getexhibitavailalbe 详情](/api/#getexhibitavailalbe)

### 授权错误返回值

```ts
  **存在但未授权**
  {
    authErrorType: 1,// 存在但未授权
    authCode: resData.authCode,
    exhibitName,
    exhibitId,
    articleNid,
    resourceType,
    subDep,
    versionInfo: {exhibitProperty},
    ...resData, // 原始数据
  }
  **不存在**
  {
    authErrorType: 2,// 不存在
    authCode: resData.authCode,
    exhibitName,
    exhibitId,
    articleNid,
    resourceType,
    subDep,
    versionInfo: {exhibitProperty},
    ...resData, // 原始数据
  }
```

### 授权处理

**单个呼出授权**

```ts
// 根据展品id获取展品作品
let ch = await freelogApp.getExhibitFileStream(
  chapters[index].exhibitId
);

if (ch.authErrorType) {
  // 提交给运行时处理
  /**
   * addAuth 参数
      exhibitId: string,
      options?: {
        immediate: boolean  // 是否立即弹出授权窗口
      }
  */
  const data = await new Promise((resolve, rej) => {
    const res = await freelogApp.addAuth(ch.data.exhibitId, {
      immediate: true,
    });

     **res返回值说明**
   {status: SUCCESS, data}
   status 枚举判断：
     status === freelogApp.resultType.SUCCESS;  // 成功
     status === freelogApp.resultType.FAILED;   // 失败
     status === freelogApp.resultType.USER_CANCEL; // 用户取消
     status === freelogApp.resultType.DATA_ERROR;  // 数据错误
     status === = freelogApp.resultType.OFFLINE; // 展品已经下线
   data: 如果是DATA_ERROR或OFFLINE，会返回错误数据或展品数据
  });
}
```

**呼出授权**

```ts
// 当addAuth多个未授权展品且没有立刻呼出（或者存在未授权展品且已经addAuth 但用户关闭了，插件想要用户签约时）可以通过callAuth()唤出
freelogApp.callAuth();
```

## 用户相关

### 唤起登录

```ts
// callback: 登录成功的回调，登录失败不会回调,这里需要考虑一下，
freelogApp.callLogin(callback);
```

### 唤起退出登录

```ts
freelogApp.callLoginOut();
```

### 获取当前登录用户信息

```ts
const res = await freelogApp.getCurrentUser();
```

### 监听用户登录事件

```ts
// callback: 登录成功的回调，登录失败不会回调
freelogApp.onLogin(callback);
```

### 监听用户在其余页面切换账号或登录事件

```ts
// callback: 再次进入页面发现账号变化后会回调所有函数
freelogApp.onUserChange(callback);
```

### 用户数据

```ts
/**
 * 本地开发时： 如果本地开发的与线上主题或插件不是同一个资源，可以通过freelogApp.setSelfResourceNameForDev("Freelog/dev-docs") 主题或插件本身的作品名称,
 * 这样可以保证更换到线上是一致的
 */

// 更新用户数据   data 为任意对象，
const res = await freelogApp.setUserData(key, data);
// 获取用户数据
const res = await freelogApp.getUserData(key);
```

## 打包上传

**正常 build 后，将打包后的所有文件压缩为一个 zip 文件（无根目录），作为主题 theme 或插件 widget 类型上传为作品**

<!-- ## 模板下载 -->

<!-- [vue模板](https://freelog-docs.freelog.com/$freelog-60a614de12ac83003f09d975=/dev/guide)  -->

<!-- ## 移动端真机调试 vconsole

**将 dev 改成 devconsole**

此时无论移动端还是电脑端都会出现 vconsole

https://examples.freelog.com/?devconsole=https://localhost:8081 -->
