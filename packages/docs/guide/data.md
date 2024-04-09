# 插件数据通信

`freelog`提供了一套灵活的数据通信机制，方便父插件和子插件之间的数据传输。

父插件和子插件之间的通信是绑定的，父插件只能向指定的子插件发送数据，子插件只能向父插件发送数据，这种方式可以有效的避免数据污染，防止多个子插件之间相互影响。

同时我们也提供了全局通信，方便跨应用之间的数据通信。

## 子插件获取来自父插件的数据

有两种方式获取来自父插件的数据：

### 方式 1：直接获取数据

```ts
import { widgetApi } from "freelog-runtime";
const data = widgetApi.getData(); // 返回父插件下发的data数据
```

### 方式 2：绑定监听函数

```ts
import { widgetApi } from "freelog-runtime";

/**
 * 绑定监听函数，监听函数只有在数据变化时才会触发
 * dataListener: 绑定函数
 * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
 * !!!重要说明: 因为子插件是异步渲染的，而父插件发送数据是同步的，
 * 如果在子插件渲染结束前父插件发送数据，则在绑定监听函数前数据已经发送，在初始化后不会触发绑定函数，
 * 但这个数据会放入缓存中，此时可以设置autoTrigger为true主动触发一次监听函数来获取数据。
 */
widgetApi.addDataListener(dataListener: (data: Object) => any, autoTrigger?: boolean)

// 解绑监听函数
widgetApi.removeDataListener(dataListener: (data: Object) => any)

// 清空当前子插件的所有绑定函数(全局数据函数除外)
widgetApi.clearDataListener()
```

**使用方式：**

```ts
import { widgetApi } from "freelog-runtime";

// 监听函数
function dataListener(data) {
  console.log("来自父插件的数据", data);
}

// 监听数据变化
widgetApi.addDataListener(dataListener);

// 监听数据变化，初始化时如果有数据则主动触发一次
widgetApi.addDataListener(dataListener, true);

// 解绑监听函数
widgetApi.removeDataListener(dataListener);

// 清空当前子插件的所有绑定函数(全局数据函数除外)
widgetApi.clearDataListener();
```

## 子插件向父插件发送数据

```ts
import { widgetApi } from "freelog-runtime";

// dispatch只接受对象作为参数
widgetApi.dispatch({ type: "子插件发送给父插件的数据" });
```

dispatch 只接受对象作为参数，它发送的数据都会被缓存下来。

micro-app 会遍历新旧值中的每个 key 判断值是否有变化，如果所有数据都相同则不会发送（注意：只会遍历第一层 key），如果数据有变化则将**新旧值进行合并**后发送。

例如：

```ts
import { widgetApi } from "freelog-runtime";

// 第一次发送数据，记入缓存值 {name: 'jack'}，然后发送
widgetApi.dispatch({ name: "jack" });
```

```ts
// 第二次发送数据，将新旧值合并为 {name: 'jack', age: 20}，记入缓存值，然后发送
widgetApi.dispatch({ age: 20 });
```

```ts
// 第三次发送数据，新旧值合并为 {name: 'jack', age: 20}，与缓存值相同，不再发送
widgetApi.dispatch({ age: 20 });
```

#### dispatch 是异步执行的，多个 dispatch 会在下一帧合并为一次执行

例如：

```ts
import { widgetApi } from "freelog-runtime";

widgetApi.dispatch({ name: "jack" });
widgetApi.dispatch({ age: 20 });

// 上面的数据会在下一帧合并为对象{name: 'jack', age: 20}一次性发送给父插件
```

#### dispatch 第二个参数为回调函数，它会在数据发送结束后执行

例如：

```ts
import { widgetApi } from "freelog-runtime";

widgetApi.dispatch({ city: "HK" }, () => {
  console.log("数据已经发送完成");
});
```

#### 当数据监听函数有返回值时，会作为 dispatch 回调函数的入参

例如：

_父插件：_

```ts
// widgetController为widgetApi.mountWidget的返回对象
widgetController.addDataListener((data) => {
  console.log("来自子插件my-app的数据", data);

  return "返回值1";
});

// widgetController为widgetApi.mountWidget的返回对象
widgetController.addDataListener((data) => {
  console.log("来自子插件my-app的数据", data);

  return "返回值2";
});
```

_子插件：_

```ts
import { widgetApi } from "freelog-runtime";

// 返回值会放入数组中传递给dispatch的回调函数
widgetApi.dispatch({ city: "HK" }, (res: any[]) => {
  console.log(res); // ['返回值1', '返回值2']
});
```

#### forceDispatch：强制发送

forceDispatch 方法拥有和 dispatch 一样的参数和行为，唯一不同的是 forceDispatch 会强制发送数据，无论数据是否变化。

例如：

```ts
import { widgetApi } from "freelog-runtime";

// 强制发送数据，无论缓存中是否已经存在 name: 'jack' 的值
widgetApi.forceDispatch({ name: "jack" }, () => {
  console.log("数据已经发送完成");
});
```

## 父插件向子插件发送数据

父插件向子插件发送数据有两种方式：

### 方式 1: 通过 data 属性发送数据

<!-- tabs:start -->

**开始使用**

```ts
let widgetController = await widgetApi.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-single"), // 给每一个提供不同的容器
  topExhibitData: null,
  config: {},
  renderWidgetOptions: {
    data: { type: "新的数据" }, // 我是data数据，子插件通过widgetApi.getData()获取
  }, // 插件渲染配置
  seq: string,
  widget_entry: string,
});
```

<!-- tabs:end -->

### 方式 2: 手动发送数据

手动发送数据需要通过`name`指定接受数据的子插件，此值和`<micro-app>`元素中的`name`一致。

```ts
// widgetController为widgetApi.mountWidget的返回对象
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

#### setData 是异步执行的，多个 setData 会在下一帧合并为一次执行

例如：

```ts
widgetController.setData({ name: "jack" });
widgetController.setData({ age: 20 });

// 上面的数据会在下一帧合并为对象{name: 'jack', age: 20}一次性发送给子插件my-app
```

#### setData 第三个参数为回调函数，它会在数据发送结束后执行

例如：

```ts
widgetController.setData({ city: "HK" }, () => {
  console.log("数据已经发送完成");
});
```

#### 当数据监听函数有返回值时，会作为 setData 回调函数的入参

例如：

_子插件：_

```ts
import { widgetApi } from "freelog-runtime";

widgetApi.addDataListener((data) => {
  console.log("来自父插件的数据", data);

  return "返回值1";
});

widgetApi.addDataListener((data) => {
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

#### forceSetData：强制发送

forceSetData 方法拥有和 setData 一样的参数和行为，唯一不同的是 forceSetData 会强制发送数据，无论数据是否变化。

例如：

```ts
// 强制发送数据，无论缓存中是否已经存在 name: 'jack' 的值
widgetController.forceSetData({ name: "jack" }, () => {
  console.log("数据已经发送完成");
});
```

## 父插件获取来自子插件的数据

父插件获取来自子插件的数据有三种方式：

### 方式 1：直接获取数据

```ts
const childData = widgetController.getData(); // 返回子插件的data数据
```

### 方式 2: 监听自定义事件 (datachange)

<!-- tabs:start -->

**开始使用**

```ts
let widgetController = await widgetApi.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-single"), // 给每一个提供不同的容器
  topExhibitData: null,
  config: {},
  renderWidgetOptions: {
    data: { type: "新的数据" }, // 我是data数据，子插件通过widgetApi.getData()获取
    onDataChange: (e) => console.log("来自子插件的数据：", e.detail.data), // 我是监听来自子插件的数据
  }, // 插件渲染配置
  seq: string,
  widget_entry: string,
});
```

<!-- tabs:end -->

注意：`datachange`绑定函数的返回值不会作为子插件 dispatch 回调函数的入参，它的返回值没有任何作用。

### 方式 3: 绑定监听函数

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

## 清空数据

由于通信的数据会被缓存，即便子插件被卸载也不会清空，这可能会导致一些困扰，此时可以主动清空缓存数据来解决。

<!-- tabs:start -->

#### 父插件

<!-- ### 方式一：配置项 - clear-data

- 使用方式: `<micro-app clear-data></micro-app>`

当设置了`clear-data`，子插件卸载时会同时清空父插件发送给当前子插件，和当前子插件发送给父插件的数据。

[destroy](/zh-cn/configure?id=destroy)也有同样的效果。 -->

#### 手动清空 - clearData

```ts
// 清空父插件发送给当前子插件的数据
widgetController.clearData();
```

### 子插件

#### 手动清空 - clearData

```ts
import { widgetApi } from "freelog-runtime";

// 清空当前子插件发送给父插件的数据
widgetApi.clearData();
```

<!-- tabs:end -->

## 全局数据通信

全局数据通信会向父插件和所有子插件发送数据，在跨应用通信的场景中适用。

### 发送全局数据

<!-- tabs:start -->

**父插件**

```ts
// 全局数据直接使用widgetApi调用
import { widgetApi } from "freelog-runtime";

// setGlobalData只接受对象作为参数
widgetApi.setGlobalData({ type: "全局数据" });
```

**子插件**

```ts
import { widgetApi } from "freelog-runtime";

// setGlobalData只接受对象作为参数
widgetApi.setGlobalData({ type: "全局数据" });
```

<!-- tabs:end -->

setGlobalData 只接受对象作为参数，它发送的数据都会被缓存下来。

micro-app 会遍历新旧值中的每个 key 判断值是否有变化，如果所有数据都相同则不会发送（注意：只会遍历第一层 key），如果数据有变化则将**新旧值进行合并**后发送。

例如：

<!-- tabs:start -->

**父插件**

```ts
import { widgetApi } from "freelog-runtime";

// 第一次发送数据，记入缓存值 {name: 'jack'}，然后发送
widgetApi.setGlobalData({ name: "jack" });
```

```ts
import { widgetApi } from "freelog-runtime";

// 第二次发送数据，将新旧值合并为 {name: 'jack', age: 20}，记入缓存值，然后发送
widgetApi.setGlobalData({ age: 20 });
```

```ts
import { widgetApi } from "freelog-runtime";

// 第三次发送数据，新旧值合并为 {name: 'jack', age: 20}，与缓存值相同，不再发送
widgetApi.setGlobalData({ age: 20 });
```

**子插件**

```ts
import { widgetApi } from "freelog-runtime";

// 第一次发送数据，记入缓存值 {name: 'jack'}，然后发送
widgetApi.setGlobalData({ name: "jack" });
```

```ts
import { widgetApi } from "freelog-runtime";

// 第二次发送数据，将新旧值合并为 {name: 'jack', age: 20}，记入缓存值，然后发送
widgetApi.setGlobalData({ age: 20 });
```

```ts
import { widgetApi } from "freelog-runtime";

// 第三次发送数据，新旧值合并为 {name: 'jack', age: 20}，与缓存值相同，不再发送
widgetApi.setGlobalData({ age: 20 });
```

<!-- tabs:end -->

**setGlobalData 是异步执行的，多个 setGlobalData 会在下一帧合并为一次执行**

例如：

<!-- tabs:start -->

**父插件**

```ts
import { widgetApi } from "freelog-runtime";

widgetApi.setGlobalData({ name: "jack" });
widgetApi.setGlobalData({ age: 20 });

// 上面的数据会在下一帧合并为对象{name: 'jack', age: 20}一次性发送给父插件
```

**子插件**

```ts
import { widgetApi } from "freelog-runtime";

widgetApi.setGlobalData({ name: "jack" });
widgetApi.setGlobalData({ age: 20 });

// 上面的数据会在下一帧合并为对象{name: 'jack', age: 20}一次性发送给父插件
```

<!-- tabs:end -->

**setGlobalData 第二个参数为回调函数，它会在数据发送结束后执行**

例如：

<!-- tabs:start -->

**父插件**

```ts
import { widgetApi } from "freelog-runtime";

widgetApi.setGlobalData({ city: "HK" }, () => {
  console.log("数据已经发送完成");
});
```

**子插件**

```ts
import { widgetApi } from "freelog-runtime";

widgetApi.setGlobalData({ city: "HK" }, () => {
  console.log("数据已经发送完成");
});
```

<!-- tabs:end -->

**当全局数据的监听函数有返回值时，会作为 setGlobalData 回调函数的入参**

例如：

<!-- tabs:start -->

**父插件**

```ts
import { widgetApi } from "freelog-runtime";

widgetApi.addGlobalDataListener((data) => {
  console.log("全局数据", data);

  return "返回值1";
});

widgetApi.addGlobalDataListener((data) => {
  console.log("全局数据", data);

  return "返回值2";
});
```

```ts
import { widgetApi } from "freelog-runtime";

// 返回值会放入数组中传递给setGlobalData的回调函数
widgetApi.setGlobalData({ city: "HK" }, (res: any[]) => {
  console.log(res); // ['返回值1', '返回值2']
});
```

**子插件**

```ts
import { widgetApi } from "freelog-runtime";

widgetApi.addGlobalDataListener((data) => {
  console.log("全局数据", data);

  return "返回值1";
});

widgetApi.addGlobalDataListener((data) => {
  console.log("全局数据", data);

  return "返回值2";
});
```

```ts
import { widgetApi } from "freelog-runtime";

// 返回值会放入数组中传递给setGlobalData的回调函数
widgetApi.setGlobalData({ city: "HK" }, (res: any[]) => {
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
import { widgetApi } from "freelog-runtime";

// 强制发送数据，无论缓存中是否已经存在 name: 'jack' 的值
widgetApi.forceSetGlobalData({ name: "jack" }, () => {
  console.log("数据已经发送完成");
});
```

**子插件**

```ts
import { widgetApi } from "freelog-runtime";

// 强制发送数据，无论缓存中是否已经存在 name: 'jack' 的值
widgetApi.forceSetGlobalData({ name: "jack" }, () => {
  console.log("数据已经发送完成");
});
```

<!-- tabs:end -->

### 获取全局数据

<!-- tabs:start -->

#### 父插件

```ts
import { widgetApi } from "freelog-runtime";

// 直接获取数据
const globalData = widgetApi.getGlobalData() // 返回全局数据

function dataListener (data) {
  console.log('全局数据', data)
}

/**
 * 绑定监听函数
 * dataListener: 绑定函数
 * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
 */
widgetApi.addGlobalDataListener(dataListener: (data: Object) => any, autoTrigger?: boolean)

// 解绑监听函数
widgetApi.removeGlobalDataListener(dataListener: (data: Object) => any)

// 清空父插件绑定的所有全局数据监听函数
widgetApi.clearGlobalDataListener()
```

#### 子插件

```ts
import { widgetApi } from "freelog-runtime";

// 直接获取数据
const globalData = widgetApi.getGlobalData() // 返回全局数据

function dataListener (data) {
  console.log('全局数据', data)
}

/**
 * 绑定监听函数
 * dataListener: 绑定函数
 * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
 */
widgetApi.addGlobalDataListener(dataListener: (data: Object) => any, autoTrigger?: boolean)

// 解绑监听函数
widgetApi.removeGlobalDataListener(dataListener: (data: Object) => any)

// 清空当前子插件绑定的所有全局数据监听函数
widgetApi.clearGlobalDataListener()
```

<!-- tabs:end -->

### 清空全局数据

<!-- tabs:start -->

#### 父插件

```ts
import { widgetApi } from "freelog-runtime";

// 清空全局数据
widgetApi.clearGlobalData();
```

#### 子插件

```ts
import { widgetApi } from "freelog-runtime";

// 清空全局数据
widgetApi.clearGlobalData();
```
