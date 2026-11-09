# 第三部：用已经建立的架构检查 MicroApp

[课程入口](README.md) · [前置：独立架构](architecture/01-从需求推导微前端边界与方案.md) · [综合设计题](CAPSTONE.md)

到这里才选择分析对象。本地 MicroApp rc.8 是一种具体装配与兼容实现；它没有定义微前端这项技术的全部边界。前两部已经说明没有它也能实现模块加载、多框架根和实例生命周期，现在要检查它额外提供什么、改变哪些语义、保留哪些责任。

## 1. 先给本地实现定位

独立教学通道要求应用主动导出工厂和生命周期，并在分配容器内运行。MicroApp 的主要路径从 HTML／脚本等入口取得已有应用，抽取与处理资源，再借自定义元素、执行环境、DOM／路由适配和生命周期让它们嵌入基座。

因此它承担了更多历史兼容：应用可能默认查询 document，向 body 插入弹层，直接操作 location，或依赖某种脚本全局导出。它提供适配不代表这些语义被完全隔离，也不代表所有构建产物都经过同一执行链。

源码基线与公司差异仍在 [版本资料](01-资料来源与版本基线.md)、[fork 台账](12-Fork差异与持续维护.md)。这里不重新选择框架，也没有替换当前平台。

## 2. 从底层问题到真实实现，而不是从目录背起

| 已经推导出的要求 | MicroApp 实际机制／阅读入口 | 必须继续追问的边界 |
| --- | --- | --- |
| 定义与实例分开 | `appInstanceMap`、`CreateApp`、资源中心；[加载章](04-加载流水线与应用生命周期.md) | name 对应什么，复用何时重执行、何时保留环境？ |
| 入口格式决定链接器 | `HTMLLoader`、`extractSourceDom`、`scripts.ts` | 经典脚本、原生module、动态脚本是否同路径？ |
| 代码求值不等于创建框架根 | `execScripts`、UMD钩子探测、`handleMounted` | Vue app／React root由子应用哪段代码创建？ |
| 执行环境与对象身份 | with、iframe两条沙箱；[JS章](05-JavaScript沙箱与隔离边界.md) | 哪些访问经Proxy，哪些仍是原生realm行为？ |
| 一个实例自己的DOM | 节点应用标记、document代理、插入重定向；[DOM章](06-DOM代理与CSS隔离.md) | 物理树、逻辑树、跨realm对象与保存的原生引用如何处理？ |
| 样式不能随意污染 | CSS parser与选择器前缀 | 和Vue scoped／CSS Modules有何不同？根规则、继承、CSSOM、弹层如何验证？ |
| 唯一URL的导航协调 | location/history代理、search/state/pure等；[路由章](07-路由虚拟化与导航.md) | 哪些只是投影，是否独立历史，谁真正通知框架router？ |
| 数据与能力合同 | EventCenter、setData/dispatch；[通信章](08-通信与副作用清理.md) | 状态合并还是命令？函数引用是否共享？ |
| 退出可释放 | `sandBox.stop`、副作用快照、UMD／keep-alive／destroy | 框架内部effect、模块顶层、宿主服务各由谁清理？ |
| 平台身份与权限 | Widget、bindName、自定义资源fetch；[SDK章](09-主题插件与Freelog能力注入.md) | 哪个是通用引擎，哪个是Freelog适配，哪个必须由服务端判定？ |

每走一行，记录“输入 → 状态或对象 → 下一步 → 失败怎么传播”。表格只是导航；深度在于能把具体源码与底层机制相互解释。

## 3. 按一份 Vite＋Vue 插件完整走读

### 第一步：先看生产产物，不先设置 iframe

取一个实际 entry，确认 script type、导入地址、lazy chunk、CSS及资源基址。Vite dev有client、Refresh／HMR等额外协议，生产有另一张资源图；Vue的编译结果还导入runtime helper。没有这些输入证据，就不能仅凭“它用了Vue”决定执行方式。

### 第二步：判断哪一部分还能被字符串包装

在 [scripts.ts](../packages/micro-app2/src/source/scripts.ts) 找 `isTypeModule → isWrapInSandBox → bindScope → runCode2InlineScript`。经典脚本可以经包装后执行；带原生静态import的module需要模块系统。iframe分支可利用另一个realm的原生模块能力，但外部module最终设置src，不能推导其所有依赖都会走文本fetch／loader。

把这条路径与基础01的“模块记录与求值”相对照，才理解为什么一些配置能修经典全局导出问题，却修不了ESM依赖请求。

### 第三步：查 Vue app 的拥有者

引擎执行脚本以后，Vue仍需createApp、安装插件／router、mount真实根。MicroApp不会替Vue创建组件effect，也不知道一个业务watcher是否在有效scope中。它可发现window.mount/unmount并协调部分复用，实际app退出仍须调用Vue的unmount及业务cleanup。

对React同理：引擎完成处理不等于createRoot的业务内容已经提交／ready；旧root卸载后不能简单复用。framework adapter的返回合同与引擎等待之间必须对齐。

### 第四步：把 Teleport／Portal 放到 DOM 适配路径里

看节点由谁创建、标记归属何时写入、插入何处，以及样式前缀是否覆盖真实落点。组件还保留原框架树的状态和事件语义。不能只看 `parentNode` 的代理返回值，就忽略Elements中的真实结构。

### 第五步：验证退出和恢复

分别检查实例Map、框架根、计时器／订阅、子插件控制器与共享资源。keep-alive保持的是应用状态策略，不是把Vue KeepAlive／React effect／全部业务IO统一暂停的一项浏览器能力。UMD普通卸载、default、iframe重建与destroy也不应混测。

这五步合起来才是“驾驭实现”：从产物和框架需要出发，定位适配点，知道何时应该改子应用、何时改平台接缝、何时才有证据改内核。

## 4. 用手写运行时作对照，不作替代品

[独立runtime](foundations-lab/runtime.mjs)把控制器绑定实例记录，并对name与container引用持有租约；它不提供通用沙箱。MicroApp有更宽的兼容路径，但本地Freelog控制器包装按name调用unmount，业务登记又有另一组Map。

比较的目的不是宣布几十行代码胜过复杂框架，而是把不变量显式化：旧控制器能否影响复用name的新实例？同一个容器是否会被多份框架根接管？失败挂载会不会留下活动登记？清理失败能否被看见？

这些问题应由定向复现回答，不能因为我们设计了更明确的协议，就把现有生产实现直接判错并批量重写。[排障章](10-排障与具体修复方案.md)区分了静态风险与已验证范围。

## 5. 哪些能力仍不属于 MicroApp 的自动承诺

- Vite／Webpack所有产物格式、HMR与第三方runtime的无条件兼容。
- Vue／React组件树内部的全部业务副作用清理。
- 共享依赖在所有realm／URL／模块容器中的全局唯一性。
- 相互不可信代码之间的恶意访问防护、独立CPU或进程保证。
- 平台展品／依赖／访问者的服务端授权。
- 整张资源图的原子部署、回退和缓存预算。

这些边界来自前两部的架构推导。读源码时应检验具体实现合同，而不是期待某个框架名消除这些责任。

## 6. 阅读与验收顺序

依次读根目录04加载、05执行、06 DOM/CSS、07路由、08通信清理、09平台集成。03保留为本地架构视角的补充对照；12负责接管与补丁，不作为最初定义微前端的依据。

最后做 [CAPSTONE](CAPSTONE.md)。如果仍只能回答“Vite应用开iframe”“卸载调用destroy”，回到对应基础链条重新解释原因与边界；这些配置结论本身不是架构能力。
