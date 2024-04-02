运行时通过拦截浏览器路由事件以及自定义的 location、history，实现了一套虚拟路由系统，子插件运行在这套虚拟路由系统中，和父插件的路由进行隔离，避免相互影响。

虚拟路由系统还提供了丰富的功能，帮助用户提升开发效率和使用体验。

## 路由模式

虚拟路由系统分为四种模式：`search`、`pure`

<!-- tabs:start -->

#### ** search 模式 **

search 是默认模式，通常不需要特意设置，search 模式下子插件的路由信息会作为 query 参数同步到浏览器地址上，如下：

![alt](https://img12.360buyimg.com/imagetools/jfs/t1/204018/30/36539/9736/6523add2F41753832/31f5ad7e48ea6570.png ":size=700")

**使用方式：**

设置单个子插件：

```js
await freelogApp.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-exhibit"),
  topExhibitData: null,
  renderWidgetOptions:{
   "router-mode": "search"
  }
  seq: 1,
 });
```

#### ** pure 模式 **

pure 模式下子插件独立于浏览器进行渲染，即不会修改浏览器地址，也不会受其影响，其表现和 iframe 类似。

**使用方式：**

设置单个子插件：

```js
await freelogApp.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-exhibit"),
  topExhibitData: null,
  renderWidgetOptions:{
   "router-mode": "pure"
  }
  seq: 1,
 });
```

<!-- 全局设置：

```js


microApp.start({
  "router-mode": "pure",
});
``` -->

<!-- tabs:end -->

## 配置项

#### 1、保留路由状态

默认情况下，子插件卸载后重新渲染，将和首次加载一样渲染子插件的首页。

设置`keep-router-state`可以保留子插件路由状态，在卸载后重新渲染时将恢复卸载前的页面（页面中的状态不保留）。

**使用方式：**

1、保留某个子插件的路由状态

```js
await freelogApp.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-exhibit"),
  topExhibitData: null,
  renderWidgetOptions:{
   "keep-router-state": true,
  }
  seq: 1,
 });
```

注意：

1. 如果关闭了虚拟路由系统，`keep-router-state`也将失效。
2. 当设置了`default-page`时`keep-router-state`将失效，因为它的优先级小于`default-page`

## 导航

通过虚拟路由系统，我们可以方便的进行跨应用的跳转，如：

1. 父插件控制子插件跳转
2. 子插件控制父插件跳转
3. 子插件控制其它子插件跳转

由于 nextjs 的路由系统非常特殊，当子插件是 nextjs 时无法直接控制跳转，参考[通过数据通信控制跳转](/zh-cn/jump?id=方式二、通过数据通信控制跳转)

<!-- tabs:start -->

#### ** 父插件 **

### router.push

**介绍：**控制子插件跳转，并向路由堆栈添加一条新的记录

```js
/**
 * @param {string} name 必填，子插件的name
 * @param {string} path 必填，子插件除域名外的全量地址(也可以带上域名)
 * @param {boolean} replace 可选，是否使用replace模式，不新增堆栈记录，默认为false
 */
router.push({
  name: widgetRenderName,
  path: "页面地址",
  replace: 是否使用replace模式,
});
```

**示例：**

```js
// 不带域名的地址，控制子插件widgetRenderName跳转/page1
freelogApp.router.push({ name: widgetRenderName, path: "/page1" });

// 带查询参数，控制子插件widgetRenderName跳转/page1?id=9527
freelogApp.router.push({ name: widgetRenderName, path: "/page1?id=9527" });

// 带hash，控制子插件widgetRenderName跳转/page1#hash
freelogApp.router.push({ name: widgetRenderName, path: "/page1#hash" });

// 使用replace模式，等同于 router.replace({name: 'widgetRenderName', path: '/page1'})
freelogApp.router.push({
  name: widgetRenderName,
  path: "/page1",
  replace: true,
});
```

### router.replace

**介绍：**控制子插件跳转，但不会向路由堆栈添加新的记录，而是替换最新的堆栈记录。

```js
/**
 * @param {string} name 必填，子插件的name
 * @param {string} path 必填，子插件除域名外的全量地址(也可以带上域名)
 * @param {boolean} replace 可选，是否使用replace模式，默认为true
 */
router.replace({
  name: widgetRenderName,
  path: "页面地址",
  replace: 是否使用replace模式,
});
```

**示例：**

```js
// 不带域名的地址
freelogApp.router.replace({ name: widgetRenderName, path: "/page1" });

// 带域名的地址
freelogApp.router.replace({
  name: widgetRenderName,
  path: "http://localhost:3000/page1",
});

// 带查询参数
freelogApp.router.replace({ name: widgetRenderName, path: "/page1?id=9527" });

// 带hash
freelogApp.router.replace({ name: widgetRenderName, path: "/page1#hash" });

// 关闭replace模式，等同于 router.push({name: 'widgetRenderName', path: '/page1'})
freelogApp.router.replace({
  name: widgetRenderName,
  path: "/page1",
  replace: false,
});
```

### router.go

**介绍：**它的功能和 window.history.go(n)一致，表示在历史堆栈中前进或后退多少步。

```js
/**
 * @param {number} n 前进或后退多少步
 */
router.go(n);
```

**示例：**

```js
// 返回一条记录
freelogApp.router.go(-1);

// 前进 3 条记录
freelogApp.router.go(3);
```

### router.back

**介绍：**它的功能和 window.history.back()一致，表示在历史堆栈中后退一步。

```js
router.back();
```

**示例：**

```js
// 返回一条记录
freelogApp.router.back();
```

### router.forward

**介绍：**它的功能和 window.history.forward()一致，表示在历史堆栈中前进一步。

```js
router.forward();
```

**示例：**

```js
// 前进一条记录
freelogApp.router.forward();
```

#### ** 子插件 **

子插件的路由 API 和父插件保持一致，不同点是`microApp`挂载在 window 上。

### 子插件控制父插件跳转

默认情况下，子插件无法直接控制父插件的跳转，为此我们提供了一个 API，将父插件的路由对象传递给子插件。

**父插件**

```js
// 注册父插件路由
freelogApp.router.setBaseAppRouter(父插件的路由对象);
```

**子插件**

```js
// 获取父插件路由
const baseRouter = freelogApp.router.getBaseAppRouter()

// 控制父插件跳转
baseRouter.父插件路由的方法(...)
```

### 控制其他子插件跳转

### router.push

**介绍：**控制其它子插件跳转，并向路由堆栈添加一条新的记录

```js
/**
 * @param {string} name 必填，子插件的name
 * @param {string} path 必填，子插件除域名外的全量地址(也可以带上域名)
 * @param {boolean} replace 可选，是否使用replace模式，不新增堆栈记录，默认为false
 */
router.push({
  name: widgetRenderName,
  path: "页面地址",
  replace: 是否使用replace模式,
});
```

**示例：**

```js
// 不带域名的地址，控制子插件widgetRenderName跳转/page1
freelogApp.router.push({ name: widgetRenderName, path: "/page1" });

// 带域名的地址，控制子插件widgetRenderName跳转/page1
freelogApp.router.push({
  name: widgetRenderName,
  path: "http://localhost:3000/page1",
});

// 带查询参数，控制子插件widgetRenderName跳转/page1?id=9527
freelogApp.router.push({ name: widgetRenderName, path: "/page1?id=9527" });

// 带hash，控制子插件widgetRenderName跳转/page1#hash
freelogApp.router.push({ name: widgetRenderName, path: "/page1#hash" });

// 使用replace模式，等同于 router.replace({name: 'widgetRenderName', path: '/page1'})
freelogApp.router.push({
  name: widgetRenderName,
  path: "/page1",
  replace: true,
});
```

### router.replace

**介绍：**控制其它子插件跳转，但不会向路由堆栈添加新的记录，而是替换最新的堆栈记录。

```js
/**
 * @param {string} name 必填，子插件的name
 * @param {string} path 必填，子插件除域名外的全量地址(也可以带上域名)
 * @param {boolean} replace 可选，是否使用replace模式，默认为true
 */
router.replace({
  name: widgetRenderName,
  path: "页面地址",
  replace: 是否使用replace模式,
});
```

**示例：**

```js
// 不带域名的地址
freelogApp.router.replace({ name: widgetRenderName, path: "/page1" });

// 带域名的地址
freelogApp.router.replace({
  name: widgetRenderName,
  path: "http://localhost:3000/page1",
});

// 带查询参数
freelogApp.router.replace({ name: widgetRenderName, path: "/page1?id=9527" });

// 带hash
freelogApp.router.replace({ name: widgetRenderName, path: "/page1#hash" });

// 关闭replace模式，等同于 router.push({name: 'widgetRenderName', path: '/page1'})
freelogApp.router.replace({
  name: widgetRenderName,
  path: "/page1",
  replace: false,
});
```

### router.go

**介绍：**它的功能和 window.history.go(n)一致，表示在历史堆栈中前进或后退多少步。

```js
/**
 * @param {number} n 前进或后退多少步
 */
router.go(n);
```

**示例：**

```js
// 返回一条记录
freelogApp.router.go(-1);

// 前进 3 条记录
freelogApp.router.go(3);
```

### router.back

**介绍：**它的功能和 window.history.back()一致，表示在历史堆栈中后退一步。

```js
router.back();
```

**示例：**

```js
// 返回一条记录
freelogApp.router.back();
```

### router.forward

**介绍：**它的功能和 window.history.forward()一致，表示在历史堆栈中前进一步。

```js
router.forward();
```

**示例：**

```js
// 前进一条记录
freelogApp.router.forward();
```

<!-- tabs:end -->

## 设置默认页面

子插件加载后会默认渲染首页，但我们常常希望子插件加载后渲染指定的页面，此时可以设置`defaultPage`指定子插件渲染的页面。

**方式一：设置 default-page 属性**

```js
await freelogApp.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-exhibit"),
  topExhibitData: null,
  renderWidgetOptions:{
   "default-page": "页面地址",
  }
  seq: 1,
 });
```

**示例：**

```js
<!-- 不带查询参数 -->
await freelogApp.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-exhibit"),
  topExhibitData: null,
  renderWidgetOptions:{
   "default-page": "/page1",
  }
  seq: 1,
 });

<!-- 带查询参数 -->
await freelogApp.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-exhibit"),
  topExhibitData: null,
  renderWidgetOptions:{
   "default-page": "/page1?id=9527",
  }
  seq: 1,
 }); 

<!-- 带hash -->
await freelogApp.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-exhibit"),
  topExhibitData: null,
  renderWidgetOptions:{
   "default-page": "/page1#hash",
  }
  seq: 1,
 });  
```

**方式二：通过 router API 设置**

```js
/**
 * 设置子插件默认页面
 * @param {string} name 必填，子插件的name
 * @param {string} path 必填，页面地址
 */
router.setDefaultPage({ name: widgetRenderName, path: "页面地址" });

/**
 * 删除子插件默认页面
 * @param {string} name 必填，子插件的name
 */
router.removeDefaultPage((name: widgetRenderName));

/**
 * 获取子插件默认页面
 * @param {string} name 必填，子插件的name
 */
router.getDefaultPage((name: widgetRenderName));
```

**示例：**

```js
// 不带域名的地址
freelogApp.router.setDefaultPage({ name: widgetRenderName, path: "/page1" });

// 带域名的地址
freelogApp.router.setDefaultPage({
  name: widgetRenderName,
  path: "http://localhost:3000/page1",
});

// 带查询参数
freelogApp.router.setDefaultPage({
  name: widgetRenderName,
  path: "/page1?id=9527",
});

// 带hash
freelogApp.router.setDefaultPage({
  name: widgetRenderName,
  path: "/page1#hash",
});

// 删除子插件widgetRenderName的默认页面
router.removeDefaultPage(widgetRenderName);

// 获取子插件widgetRenderName的默认页面
const defaultPage = router.getDefaultPage(widgetRenderName);
```

## 导航守卫

导航守卫用于监听子插件的路由变化，类似于 vue-router 的全局守卫，不同点是 MicroApp 的导航守卫无法取消跳转。

#### 全局前置守卫

**介绍：**监听所有或某个子插件的路由变化，在子插件页面渲染前执行。

**使用范围：**父插件

```js
/**
 * @param {object} to 即将要进入的路由
 * @param {object} from 正要离开的路由
 * @param {string} name 子插件的name
 * @return cancel function 解绑路由监听函数
 */
router.beforeEach((to, from, name) => {} | { name: (to, from) => {} })
```

**示例：**

```js
// 监听所有子插件的路由变化
freelogApp.router.beforeEach((to, from, appName) => {
  console.log("全局前置守卫 beforeEach: ", to, from, appName);
});

// 监听某个子插件的路由变化
freelogApp.router.beforeEach({
  子插件1name(to, from) {
    console.log("指定子插件的前置守卫 beforeEach ", to, from);
  },
  子插件2name(to, from) {
    console.log("指定子插件的前置守卫 beforeEach ", to, from);
  },
});

// beforeEach会返回一个解绑函数
const cancelCallback = freelogApp.router.beforeEach((to, from, appName) => {
  console.log("全局前置守卫 beforeEach: ", to, from, appName);
});

// 解绑路由监听
cancelCallback();
```

#### 全局后置守卫

**介绍：**监听所有或某个子插件的路由变化，在子插件页面渲染后执行。

**使用范围：**父插件

```js
/**
 * @param {object} to 已经进入的路由
 * @param {object} from 已经离开的路由
 * @param {string} name 子插件的name
 * @return cancel function 解绑路由监听函数
 */
router.afterEach((to, from, name) => {} | { name: (to, from) => {} })
```

**示例：**

```js
// 监听所有子插件的路由变化
freelogApp.router.afterEach((to, from, appName) => {
  console.log("全局后置守卫 afterEach: ", to, from, appName);
});

// 监听某个子插件的路由变化
freelogApp.router.afterEach({
  子插件1name(to, from) {
    console.log("指定子插件的后置守卫 afterEach ", to, from);
  },
  子插件2name(to, from) {
    console.log("指定子插件的后置守卫 beforeEach ", to, from);
  },
});

// afterEach会返回一个解绑函数
const cancelCallback = freelogApp.router.afterEach((to, from, appName) => {
  console.log("全局后置守卫 afterEach: ", to, from, appName);
});

// 解绑路由监听
cancelCallback();
```

## 获取路由信息

**介绍：**获取子插件的路由信息，返回值与子插件的 location 相同

```js
/**
 * @param {string} name 必填，子插件的name
 */
router.current.get(name);
```

**示例：**

<!-- tabs:start -->

#### ** 父插件 **

```js
// 获取子插件widgetRenderName的路由信息，返回值与子插件的location相同
const routeInfo = freelogApp.router.current.get(widgetRenderName);
```

#### ** 子插件 **

```js
// 获取子插件widgetRenderName的路由信息，返回值与子插件的location相同
const routeInfo = freelogApp.router.current.get(widgetRenderName);
```

<!-- tabs:end -->

## 编解码

**介绍：**子插件同步到浏览器的路由信息是经过特殊编码的(encodeURIComponent + 特殊字符转译)，如果用户想要编码或解码子插件的路由信息，可以使用编解码的 API。

![alt](https://img12.360buyimg.com/imagetools/jfs/t1/204018/30/36539/9736/6523add2F41753832/31f5ad7e48ea6570.png ":size=700")

```js
/**
 * 编码
 * @param {string} path 必填，页面地址
 */
router.encode((path: string));

/**
 * 解码
 * @param {string} path 必填，页面地址
 */
router.decode((path: string));
```

**示例：**

<!-- tabs:start -->

#### ** 父插件 **

```js
// 返回 %2Fpage1%2F
const encodeResult = freelogApp.router.encode("/page1/");

// 返回 /page1/
const encodeResult = freelogApp.router.decode("%2Fpage1%2F");
```

#### ** 子插件 **

```js
// 返回 %2Fpage1%2F
const encodeResult = freelogApp.router.encode("/page1/");

// 返回 /page1/
const encodeResult = freelogApp.router.decode("%2Fpage1%2F");
```

<!-- tabs:end -->

## 同步路由信息

在一些特殊情况下，父插件的跳转会导致浏览器地址上子插件信息丢失，此时可以主动调用方法，将子插件的路由信息同步到浏览器地址上。

**介绍：**主动将子插件的路由信息同步到浏览器地址上

**使用范围：**父插件

```js
/**
 * 将指定子插件的路由信息同步到浏览器地址上
 * 如果应用未渲染或已经卸载，则方法无效
 * @param {string} name 子插件的名称
 */
router.attachToURL(name: string)

/**
 * 将所有正在运行的子插件路由信息同步到浏览器地址上
 * 它接受一个对象作为参数，详情如下：
 * @param {boolean} includeHiddenApp 是否包含已经隐藏的keep-alive应用，默认为false
 * @param {boolean} includePreRender 是否包含预渲染应用，默认为false
 */
router.attachAllToURL({
  includeHiddenApp?: boolean,
  includePreRender?: boolean,
})
```

**示例：**

```js
// 将widgetRenderName的路由信息同步到浏览器地址上
freelogApp.router.attachToURL(widgetRenderName);

// 将所有正在运行的子插件路由信息同步到浏览器地址上，不包含处于隐藏状态的keep-alive应用和预渲染应用
freelogApp.router.attachAllToURL();

// 将所有正在运行的子插件路由信息同步到浏览器地址上，包含处于隐藏状态的keep-alive应用
freelogApp.router.attachAllToURL({ includeHiddenApp: true });

// 将所有正在运行的子插件路由信息同步到浏览器地址上，包含预渲染应用
freelogApp.router.attachAllToURL({ includePreRender: true });
```
