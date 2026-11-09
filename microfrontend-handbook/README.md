# 微前端原理、架构与 Freelog 实现

这套手册按四个阶段学习：**先理解浏览器与主流前端技术，再独立设计微前端架构，然后分析 MicroApp 怎样实现，最后维护 Freelog 的本地 fork。**

Vue／React 不只是被加载的黑盒，Vite 不只是一个启动命令，微前端也不等于 MicroApp。我们要能从模块图、渲染根、状态与副作用、路由和资源交付推导设计，再判断具体实现是否满足它。

## 第一部：把底层技术与框架机制讲透

按表中顺序阅读。每篇先解释原理与源码路径，再给反例、实验与对架构的约束；不要用接入配置代替这一部分。

| 顺序 | 内容 | 要能解释的因果链 |
| --- | --- | --- |
| 1 | [浏览器模块系统与应用身份](foundations/01-浏览器模块系统与应用身份.md) | 解析／连接／求值 → live binding与循环 → URL身份 → 定义与实例 → 为什么Function不是模块加载器 |
| 2 | [执行环境、调度与权限](foundations/02-浏览器执行环境调度与安全边界.md) | 词法环境／realm／document／origin → 事件循环与框架调度 → 引用、事件与资源有效期 |
| 3 | [Vite与Webpack如何决定应用加载](foundations/03-Vite与Webpack如何决定应用加载.md) | 原生模块图 → dev预构建与源码转换 → JSX/SFC与HMR → production chunk/CSS/base → Webpack runtime与Module Federation |
| 4 | [Vue从编译与响应式到卸载](foundations/04-Vue从编译响应式到应用卸载.md) | SFC → render/VNode → component effect → Dep/Link与scheduler → appContext／scope／KeepAlive／Teleport → 多应用合同 |
| 5 | [React从JSX与Fiber到多根生命周期](foundations/05-React从JSX与Fiber到多根生命周期.md) | JSX → Element/Fiber → render/commit → Hook模块身份 → root/Context／事件/Portal → effect/StrictMode与可重挂适配 |
| 6 | [路由、样式、依赖共享与协作](foundations/06-路由样式依赖共享与跨应用协作.md) | 唯一历史栈 → 路由映射 → CSS作用域与物理落点 → 代码／状态／runtime身份 → 跨应用协议 |

**本部分的通过条件：** 不提MicroApp，也能解释同页两个Vue app／React root如何成立、哪些状态独立、哪些仍共享、为什么会泄漏或加载失败。

[底层实验与实际结果](FOUNDATION-EXPERIMENTS.md)提供不依赖MicroApp的可运行样本：原生ESM、自写应用协议、真实React18与Vue3，以及真实Vite开发响应和生产产物。

```powershell
node microfrontend-handbook/foundations-lab/serve.mjs
```

默认打开 [http://127.0.0.1:4319/](http://127.0.0.1:4319/)。它复用现有本地依赖，不新增安装，不调用平台。先读基础01并预测模块身份，再运行对应实验；实验是检验推理的工具，不代替原理。

## 第二部：在没有现成微前端框架时做架构设计

| 顺序 | 内容 | 应交付的设计 |
| --- | --- | --- |
| 7 | [从需求推导边界与方案](architecture/01-从需求推导微前端边界与方案.md) | 比较远程组件、独立应用、整页iframe、兼容装配；明确交付／渲染／执行／样式／路由／能力六种边界 |
| 8 | [从零设计加载器与运行时协议](architecture/02-从零设计加载器与运行时协议.md) | 定义与实例、name／container租约、框架适配、提交／commit／ready、取消／失败／cleanup与对象绑定控制器 |
| 9 | [交付、安全、性能与演进](architecture/03-交付安全性能与演进决策.md) | dev/prod双合同、不可变版本图、缓存分层、信任前提、性能观测、支持矩阵和回退 |

本部分附带 [最小原生ESM运行时](foundations-lab/runtime.mjs) 与失败回归。它没有通用沙箱；你需要知道它满足了哪些合同，又明确没有解决什么，不能把几十行代码当成完整生产替代品。

**本部分的通过条件：** 给一个新应用，不先报框架名，能画模块与资产图、渲染逻辑／物理树、资源所有权与工作有效期图，并解释方案的前提、代价、失败与验证。

## 第三部：把 MicroApp 放回架构中分析

先读 [MicroApp实现对照总图](MICROAPP-MAPPING.md)，再按问题进入已有深读正文：

| 要检查的机制 | 本地实现分析 |
| --- | --- |
| 应用进入与资源处理 | [04 加载与生命周期](04-加载流水线与应用生命周期.md) |
| 包装执行／iframe realm与模块边界 | [05 JavaScript沙箱](05-JavaScript沙箱与隔离边界.md) |
| 查询、节点、动态资源与样式 | [06 DOM与CSS](06-DOM代理与CSS隔离.md) |
| 对真实history的路由投影 | [07 路由虚拟化](07-路由虚拟化与导航.md) |
| 同页通信与自动清理范围 | [08 通信与副作用](08-通信与副作用清理.md) |
| 平台身份、SDK与文件服务接缝 | [09 Freelog能力注入](09-主题插件与Freelog能力注入.md) |

根目录原有数字章节保留路径便于查阅，**它们的文件编号不再代表全书的学习顺序**。尤其 [03 本地架构视角](03-微前端架构设计与取舍.md) 是实现上下文的补充，新架构主线在第二部。

MicroApp实验台仍在根目录第11章，默认端口4318；它是后置实现验证，不代替第一部的底层实验。

## 第四部：用完整问题证明自己能设计与维护

先完成 [综合设计题](CAPSTONE.md)：React宿主如何装配Vite构建的Vue插件，面对双实例、懒加载、Teleport、订阅、取消、升级和授权，先设计协议，再检查MicroApp的实际路径。

随后使用 [完整异步案例](CASE-STUDY.md)、[10 症状与修复方案](10-排障与具体修复方案.md)、[12 Fork接管](12-Fork差异与持续维护.md)。[14 实现层自测](14-自测答案与进阶挑战.md)作为补充，不用其中的MicroApp题替代底层与架构验收。

**最终能力标准：** 能独立解释一个未见过的失败，提出竞争假设，取得最小证据，在合适责任层做改动，并证明修前失败、修后通过及正常路径未回归。读完页数或背出配置都不等于达到这个标准。

## 资料与版本

构建／React主应用基线按当前lock与安装实际核对；Vue旧示例的3.2／3.4与实验使用的3.5.44分开。细节与实际读取的官方资料见 [Vite台账](research/vite-evidence.md)、[Vue台账](research/vue-evidence.md)、[React台账](research/react-evidence.md)、[浏览器台账](research/browser-evidence.md)。源码内部字段按固定版本解释，稳定机制与版本特例分别标识。

Freelog业务见 [02 业务与运行时](02-Freelog业务与运行时架构.md)；MicroApp原版／fork基线见 [01 来源](01-资料来源与版本基线.md)；[源码索引](13-术语与源码索引.md)、[验证记录](VALIDATION.md)、[原有来源基线](sources.json)和[新增技术来源基线](technical-sources.json)保留证据。在线材料、静态源码、Node工具链、jsdom与真实浏览器结果严格分开，不把局部实验通过扩大为真实平台或全浏览器通过。
