# 浏览器与跨应用基础的资料依据

读取日期：2026-11-09。规范采用本次在线文本作机制依据，不把在线标准的年份标题当作本机浏览器实现版本。实验浏览器、依赖版本与字节见各自JSON报告。

| 官方／一手资料 | 本次用于核对什么 | 限制 |
| --- | --- | --- |
| [ECMAScript模块语义](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-module-semantics) | 模块记录、连接、求值与绑定 | 没有仅凭规范证明所有浏览器未来语法支持 |
| [HTML脚本与模块模型](https://html.spec.whatwg.org/multipage/webappapis.html) | 浏览器宿主环境、realm、模块解析、任务与微任务 | 语言模块与宿主请求模型需要分开读 |
| [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) | 模块作用域、严格模式与导入导出基础 | 不以指南替代某构建器产物分析 |
| [MDN import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) | 模块命名空间、动态加载与缓存边界 | 本地实验仅验证同源JavaScript模块 |
| [MDN Function构造器](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function) | 函数体解析与环境，不等于模块加载 | 未实测各种CSP配置 |
| [V8 top-level await](https://v8.dev/features/top-level-await) | 异步模块求值对依赖图顺序的影响 | 技术说明不等于本轮执行了完整异步模块失败矩阵 |
| [MDN pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) | URL与state变化不直接触发popstate | 路由库合同仍按其文档／源码核对 |
| [MDN Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)、[composed](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed) | DOM／样式边界与跨shadow事件 | 本轮未运行完整shadow交互矩阵 |
| [Vue SFC CSS](https://vuejs.org/api/sfc-css-features.html) | scoped／deep／global等是编译样式边界 | 版本细节另见Vue台账 |
| [CSS specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Specificity) | 层叠不是只比较选择器长度 | 不直接声明某个组件库样式兼容 |
| [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) | 跨源响应读取与凭据边界 | 平台授权、Cookie、CSP须另验证 |
| [Vue Router history](https://router.vuejs.org/guide/essentials/history-mode.html)、[React Router6 MemoryRouter](https://reactrouter.com/6.30.3/router-components/memory-router) | browser/hash/memory存储策略 | 未推断不同库所有API签名相同，未运行完整router矩阵 |

框架与构建器的固定版本源码分别见 [Vite台账](vite-evidence.md)、[Vue台账](vue-evidence.md)、[React台账](react-evidence.md)。本地源码／依赖、远端资料、Node工具链、jsdom、真实浏览器是不同证据层，在 [验证记录](../VALIDATION.md) 中分别汇总。
