# 不依赖 MicroApp 的底层实验

[课程入口](README.md) · [基础正文](foundations/01-浏览器模块系统与应用身份.md) · [独立运行时设计](architecture/02-从零设计加载器与运行时协议.md)

本轮先验证浏览器、构建器和框架本身。目录 `foundations-lab` 不导入 MicroApp，也不需要平台账号。它使用仓库已经安装的React／ReactDOM18.3.1、Vue3.5.44浏览器构建；这些是本机实验基线，不是所有线上插件的版本。

## 1. 启动与观察范围

在仓库根目录运行：

```powershell
node microfrontend-handbook/foundations-lab/serve.mjs
```

打开默认 [http://127.0.0.1:4319/](http://127.0.0.1:4319/)，端口占用可加 `--port 4320`，退出按Ctrl+C。页面顶部可展开每个本地框架的版本、文件来源与SHA-256。依赖缺失时明确失败，不安装或换CDN掩盖基线。

实验服务只提供固定页面、样本和指定框架字节。它不提供 `/engine.js`，不把仓库目录当静态根。全部样本在同源本地环境运行，不能推及跨源、CSP、真实平台授权或生产HMR。

## 2. 原生模块：先预测执行次数，再观察对象身份

点击“运行模块实验”。首次运行预期：

```text
same = true                 同一个URL返回相同模块命名空间
differentQuery = true       query不同对应另一模块身份
live = 1                    更新原导出后，另一个导入看到新值
initial = 0                 初始化时保存的数字不是live binding
copied = 0                  query副本有自己的模块状态
evaluations.length = 2      两个URL，共发生两次模块求值
```

重复点击时count会继续增长，因此不要把第二次live不是1认定为失败。试着解释：代码缓存和实例状态为什么不是同一对象；为什么入口query不同不能自动复制所有共享依赖。回读基础01的模块记录与URL图。

## 3. 自己的最小应用通道：同定义，多实例

点击“挂载两个原生实例”，再只点A内部的计数按钮。两个实例使用 [同一entry](foundations-lab/native-entry.mjs)，但分别调用createApplication；A计数增加，B保持0。

点击“卸载原生A”：A移除自己的视图与监听、停止计时，B继续。这里没有任何通用document代理；插件只操作传给自己的容器，生命周期明确释放自己创建的资源。

然后阅读 [runtime.mjs](foundations-lab/runtime.mjs)。它处理定义加载缓存、名称／容器引用租约、取消检查、对象绑定句柄与cleanup失败隔离；它没有安全沙箱、HTML兼容加载器或路由虚拟化。这条界线有助于区分“微前端架构最少需要什么”和“某个兼容产品额外提供什么”。

纯协议测试：

```powershell
node --test microfrontend-handbook/foundations-lab/runtime.test.mjs
```

9项测试覆盖多实例、取消、同名与同容器冲突、旧句柄、挂载／清理失败及本地服务边界。容器租约曾在独立审阅中被证明缺失，先补失败断言再修正；现在同一容器不能被不同name同时接管，旧句柄也不能释放新租约。

## 4. React：先区分render提交、effect和业务ready

点击“挂载React A/B”，等待观察结果稳定。A使用Provider和StrictMode，B是另一root；首次稳定后实验记录setup=3、cleanup=1。这是A额外开发检查加B正常setup的结果，不是“三个应用”。

A读到provider-a，B读到outside-provider：同一页面共用React，并不等于共用同一Provider树。点击外部Portal按钮，A逻辑父的parentClicks增加；它的物理节点却在单独的portal区域。

卸载A后，Portal移除，setup-cleanup剩1对应仍运行的B；实验尝试旧root.render并记录oldRootRejected=true。再次点击挂载，创建新root后A可重入。回读React章，解释为什么不能缓存卸载后的root继续render。

这里没有证明React所有事件均根委托、effect永远在paint后、或StrictMode就是生产生命周期。实验只对当前开发构建和具体样本给出证据。

## 5. Vue：状态变了、DOM更新了、scope退出了是不同阶段

点击“挂载Vue A/B”，两app的provide分别为vue-a与vue-b。点击“同步更新A两次”：stateBeforeNextTick=2，beforeNextTick仍为0，await nextTick后afterNextTick为2，watchValues记录[0,2]。

这里说明本样本的调度批处理，不表示任意异步业务都被nextTick等待，也不证明用户已经看到绘制。

点击Teleport区域按钮，原Vue根的parentClicks不因此增加：Teleport保留逻辑上下文，不自动复制React Portal的合成冒泡语义。卸载A后它的Teleport节点消失；独立detached scope仍存在。

此时点击“递增外部scope状态”，detachedRuns继续增长；点击“停止外部scope”再递增则不增长。因为独立scope不是A组件scope的子资源。再次挂载A会创建新app，不能据一个组件退出就推断整个模块的全部工作结束。

## 6. Vite真实dev响应与生产产物

运行：

```powershell
node microfrontend-handbook/scripts/inspect-toolchain.mjs
```

脚本使用pc-ui本地工具链，在OS临时夹具内启动Vite并读取dev响应，再用build(write:false)检查生产图，不覆盖packages产物。实际基线为Vite5.4.3、plugin-react4.3.1、React18.3.1、Rollup4.21.2、esbuild0.21.5；Vue SFC编译使用现成compiler-sfc3.5.44。

7项断言包括：优化依赖返回ESM、devHTML包含client与Refresh preamble、JSX／模块URL转换、CSS开发注入模块、生产lazy JS/CSS与manifest、base资产改写、SFC转换为helper/VNode模块。

查看 [toolchain-inspection.json](evidence/toolchain-inspection.json)，先比较dev.html与production.html，再跟manifest和lazyCall。它是**真实工具链响应／产物检查**，不是浏览器执行整套HMR、热更新状态保留或Module Federation的验证。

Vue正文的完整适配器还有独立可重跑检查：

```powershell
node microfrontend-handbook/scripts/check-vue-examples.mjs
```

它从正文提取适配器与宿主片段，用现有jsdom执行，并另验模板编译与scope调度；结果在 [vue-examples.json](evidence/vue-examples.json)。这是3项Node／jsdom证据，与下一节的真实浏览器结果分开。

## 7. 重跑真实浏览器断言

```powershell
node microfrontend-handbook/scripts/check-foundations-browser.mjs
```

脚本自行启动临时端口与独立Headless Chromium，使用已有Edge／Chrome；其他位置可设HANDBOOK_BROWSER。报告在 [foundations-browser.json](evidence/foundations-browser.json)，截图在 [foundations-desktop.png](evidence/foundations-desktop.png)。7项检查把上述原生模块、手写协议、React、Vue和窄屏结果串起。

它不使用日常浏览器登录态，不向平台请求数据。验证完会关闭自己创建的浏览器与服务。没有浏览器时会失败，不用Node模型冒充浏览器通过。

## 8. 本轮仍需要你亲自迁移的实验

重复React的Hook／renderer混配、重复Vue的追踪边界、Vue KeepAlive活动状态、原生top-level await失败图、浏览器后退／分享、Shadow DOM／CSSOM、跨源与策略、完整生产部署和真实节点授权，都应分别构造输入。

这些在正文中已有推导或建议步骤，不因相邻实验通过而自动通过。先完成 [综合设计题](CAPSTONE.md)，再运行根目录第11章的MicroApp实验，把现成实现放回已经理解的底层约束中。
