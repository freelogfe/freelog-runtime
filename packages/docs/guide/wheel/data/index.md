# 插件数据通信

`freelog` 提供了一套灵活的数据通信机制，方便父插件和子插件之间的数据传输，同时支持全局通信，方便跨应用的数据交换。

父插件与子插件的通信是绑定的：
- **父插件**只能向指定的子插件发送数据。
- **子插件**只能向父插件发送数据。

这种绑定机制有效避免了数据污染，确保多个子插件之间不会互相干扰。


## 子插件获取父插件的数据

子插件有两种方式获取父插件发送的数据：

### 方法 1：直接获取数据

```javascript
import { widgetApi } from "freelog-runtime";
const data = widgetApi.getData(); // 获取父插件下发的数据
```

### 方法 2：监听数据变化

绑定监听函数，实时监听父插件的数据更新。

#### 使用方式

```javascript
import { widgetApi } from "freelog-runtime";

function dataListener(data) {
  console.log("接收到父插件的数据:", data);
}

// 监听数据变化
widgetApi.addDataListener(dataListener);

// 初次绑定时主动触发一次监听函数
widgetApi.addDataListener(dataListener, true);

// 解绑监听函数
widgetApi.removeDataListener(dataListener);

// 清空所有绑定的监听函数
widgetApi.clearDataListener();
```

> **提示**：由于父插件发送数据是同步的，而子插件渲染是异步的，可能会错过初次发送的数据。设置 `autoTrigger` 为 `true` 可以主动触发一次监听函数以获取缓存中的数据。


## 子插件向父插件发送数据

子插件可以使用 `dispatch` 方法向父插件发送数据。

```javascript
import { widgetApi } from "freelog-runtime";

widgetApi.dispatch({ type: "子插件发送的数据" });
```

### 特性

- `dispatch` 只接受对象作为参数。
- 如果数据内容没有变化，将不会触发发送。
- 如果数据有变化，会将新旧数据合并后发送。
- 支持在数据发送完成后执行回调函数。

#### 示例

```javascript
import { widgetApi } from "freelog-runtime";

// 第一次发送数据
widgetApi.dispatch({ name: "jack" });

// 第二次发送数据，将新数据与旧数据合并
widgetApi.dispatch({ age: 20 }); // 合并后 { name: "jack", age: 20 }

// 使用回调函数
widgetApi.dispatch({ city: "HK" }, () => {
  console.log("数据发送完成");
});
```

#### 强制发送数据

使用 `forceDispatch` 方法可以强制发送数据，无论数据是否变化。

```javascript
widgetApi.forceDispatch({ name: "jack" }, () => {
  console.log("强制发送完成");
});
```


## 父插件向子插件发送数据

父插件可以通过以下两种方式向子插件发送数据：

### 方法 1：通过 `data` 属性发送

在初始化子插件时通过 `data` 属性发送数据。

```javascript
let widgetController = await widgetApi.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-single"),
  renderWidgetOptions: {
    data: { type: "初始化数据" },
  },
});
```

### 方法 2：动态发送数据

通过 `setData` 方法动态发送数据。

```javascript
widgetController.setData({ type: "动态数据" });
```

### 特性

- 数据会被缓存，新旧数据合并后发送。
- 支持在数据发送完成后执行回调函数。

#### 示例

```javascript
// 第一次发送数据
widgetController.setData({ name: "jack" });

// 第二次发送数据，将新数据与旧数据合并
widgetController.setData({ age: 20 }); // 合并后 { name: "jack", age: 20 }

// 使用回调函数
widgetController.setData({ city: "HK" }, () => {
  console.log("数据发送完成");
});
```

#### 强制发送数据

使用 `forceSetData` 方法可以强制发送数据，无论数据是否变化。

```javascript
widgetController.forceSetData({ name: "jack" }, () => {
  console.log("强制发送完成");
});
```


## 父插件获取子插件的数据

父插件可以通过以下三种方式获取子插件的数据：

### 方法 1：直接获取数据

```javascript
const childData = widgetController.getData();
```

### 方法 2：监听数据变化

通过 `onDataChange` 监听子插件的数据变化。

```javascript
let widgetController = await widgetApi.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-single"),
  renderWidgetOptions: {
    onDataChange: (e) => console.log("子插件的数据:", e.detail.data),
  },
});
```

### 方法 3：绑定监听函数

```javascript
function dataListener(data) {
  console.log("来自子插件的数据:", data);
}

// 绑定监听函数
widgetController.addDataListener(dataListener);

// 解绑监听函数
widgetController.removeDataListener(dataListener);

// 清空所有监听函数
widgetController.clearDataListener();
```

## 全局数据通信

全局数据通信允许父插件和所有子插件之间共享数据。

### 发送全局数据

```javascript
import { widgetApi } from "freelog-runtime";

// 设置全局数据
widgetApi.setGlobalData({ type: "全局数据" });

// 使用回调函数
widgetApi.setGlobalData({ city: "HK" }, () => {
  console.log("全局数据发送完成");
});
```

### 获取全局数据

```javascript
const globalData = widgetApi.getGlobalData();

function globalDataListener(data) {
  console.log("全局数据:", data);
}

// 监听全局数据变化
widgetApi.addGlobalDataListener(globalDataListener);

// 解绑监听函数
widgetApi.removeGlobalDataListener(globalDataListener);

// 清空所有全局数据监听函数
widgetApi.clearGlobalDataListener();
```

### 强制发送全局数据

```javascript
widgetApi.forceSetGlobalData({ name: "jack" }, () => {
  console.log("强制发送全局数据完成");
});
```

### 清空全局数据

```javascript
window.microApp.clearGlobalData()
```



