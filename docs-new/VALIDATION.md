# 本轮验证记录

## 2026-11-25：同步 CLI 0.10.2 并构建 OSS 产物

从发布标签 `@freelog/cli@0.10.2`（`d4220d6d4381fe18858926d98c9cbef3d88fab83`）同步 26 页手册，来源工作树干净。首页、版本页及 Agent 入口已同步当前版本和展品签入的权限拒绝处理说明。

在 `DOCS_BASE=/`、`DOCS_CLEAN_URLS=false` 下执行 `npm run verify`。18 项测试、79 页内容与链接检查、Agent 文本导出及构建均通过。本地 HTTP 核验首页、版本页、Agent 入口、命令参考、来源记录和文本导出，CSS 与 JavaScript 从根 `/assets/` 返回正确 MIME 类型。构建保留既有大资源包告警。

交付目录为 `site/.vitepress/dist/`，本次验证范围为本地静态产物，线上部署由发布人执行。

## 2026-11-20：子目录首页刷新补修

用户反馈 `/cli/合集/` 与 `/cli/节点与展品/` 刷新仍显示首页。关闭 clean URLs 不会让 VitePress 的目录首页 URL 自动变为显式 `index.html`；上一轮 HTTP 服务自动补齐子目录首页，未覆盖托管不支持该行为的场景，因此上一轮验证不足以证明这些地址在实际托管中可刷新。

本次在构建出的根首页和 404 页加入初始化前的目录回退脚本，从实际构建页面生成目录清单。已知目录请求误收到这两类页面时，跳转到该目录的 `index.html`，保留查询参数与锚点。显式 HTML、站点首页和未知目录不跳转，避免循环；支持 `DOCS_BASE` 子路径。CLI 源文档和来源锁保持不变。

`npm test` 共 18 项通过，包含中文目录、查询和锚点、子路径、非法编码及无循环回归；`npm run build:site` 与 79 页内容检查通过。另以不自动补齐子目录首页的本地 HTTP 服务，分别模拟返回根首页（200）和 404 页（404），执行实际产物中的回退脚本并跟随其跳转：9 个目录共 36 次恢复，最终响应均与对应目录 HTML 一致；全部 79 个显式 HTML 地址正常。该验证使用 HTTP 与 JavaScript VM，不等同于浏览器完整刷新验收。

尝试 Edge 本地验收时，浏览器权限策略仍拒绝访问。已停止验证服务，尚未部署线上。发布需整体更新 `site/.vitepress/dist/`，特别是根 `index.html`、`404.html` 与子目录 HTML，并刷新 CDN 缓存。兼容脚本依赖 JavaScript；托管侧支持子目录首页仍是直接响应文档的方式。

## 2026-11-20：文档刷新显示首页的构建配置修复

修复前的本地构建中，CLI 侧栏链接为无扩展名路径，而产物只有对应 `.html` 文件；配置在未设置 `DOCS_CLEAN_URLS` 时默认启用 clean URLs。这会让没有对应路径重写、缺失对象回退首页的静态托管在直接访问或刷新文档时返回首页。现改为默认保留 `.html`，仅显式设置 `DOCS_CLEAN_URLS=true` 时启用 clean URLs，并补充部署说明。

未设置 `DOCS_CLEAN_URLS` 时执行 `npm test`，15 项通过；`npm run build:site` 通过，79 页内容、链接、资源、锚点及 CLI 摘要检查有效。保留已有 CLI 同步内容及 `source-lock.json`，未重新同步其他仓库。构建仍有既有的大 chunk 告警。

使用仅按实际文件或目录 `index.html` 返回内容、缺失对象回退首页的本地 HTTP 服务，检查全部 61 个生成的文档链接均对应实际页面；对 79 页（含 26 页 CLI）逐一直接请求并带查询参数再次请求，共 158 次，响应正文均与对应 HTML 一致，未触发首页回退。示例地址为 `/cli/01-快速上手.html`。这项验证不依赖 VitePress 预览服务的扩展名补全。

Edge 访问线上站点被浏览器权限策略拒绝，未完成线上浏览器复现或刷新验收。新产物位于 `site/.vitepress/dist/`，尚未上传；需整体部署并刷新 CDN 缓存后再验收线上导航与刷新。既有无扩展名书签如需继续使用，仍需由托管侧映射到对应 HTML。

## 2026-11-19 CLI 安装说明修订

从 CLI 干净工作树 `6e1a75c5` 重新同步 26 份手册，安装说明统一使用 `@freelog/cli`，迁移步骤按本机实际安装来源操作。已发布的 0.10.0 npm 包保留发包时的手册。

按 OSS 根目录配置运行 `npm run verify`，15 项测试通过，生成 79 页。扫描整个 `site/.vitepress/dist/` 未发现旧包名，本地 HTTP 验证安装页、版本页、Agent 入口和文本导出均已更新。构建日志见 `artifacts/20261119-cli-public-name-docs-verify.log`。

## 2026-11-19：新包名 `@freelog/cli@0.10.0`

从已发布 tag `@freelog/cli@0.10.0` 的干净源码 `31c66b49080edba8e70915d2abb87770292b9b0e` 同步 26 份 CLI 手册，逐份核对与新 npm 包随包正文一致。同步检查忽略 Git checkout 的 LF/CRLF 差异。首页、版本页和 AI 入口均指向新包，并说明如何确认全局安装来源及迁移旧包。

`DOCS_BASE=/`、`DOCS_CLEAN_URLS=false` 下执行 `npm run verify`，15 项测试通过，生产构建生成 79 页。HTTP 验证 6 个页面、11 个 CSS/JS 的内容与 MIME、79 份 Agent Markdown 与来源摘要。日志为 `artifacts/20261119-new-freelog-cli-0100-oss-verify.log`，回执为 `artifacts/20261119-new-freelog-cli-0100-oss-http.json`。上传入口为 `site/.vitepress/dist/` 内完整内容，OSS 上传由发布人执行。

## 2026-11-18：CLI 0.10.0 文档与 OSS 构建

从当时已发布的旧包 0.10.0 的 Git tag 同步 26 份 CLI 手册，来源提交 `70e6143eedaa1c74bb8a2dda84eaeb35922b8760`，`dirty=false`。逐页与从 npm 下载并安装的手册核对，18 份存在 LF/CRLF 差异，26 份正文一致。首页、版本页和 Agent 入口明确适用 0.10.0，保留本版展品签入的空标识和退出码限制。

以 `DOCS_BASE=/`、`DOCS_CLEAN_URLS=false` 执行 `npm run verify` 通过，生成 79 页及 Agent 文本。本地预览经 HTTP 核对 8 个页面、13 个 CSS/JS 资源及其 MIME 类型、79 份 Markdown 摘要、来源锁和 Agent 索引。资源走根 `/assets/`，无 `/preview/assets/` 前缀。原始记录见 `artifacts/20261118-cli-0100-oss-verify.log` 和 `artifacts/20261118-cli-0100-oss-http.json`。

直接上传 `site/.vitepress/dist/` 内全部文件到 OSS 根目录。当前产物在本机，OSS 由发布人操作。

## 2026-11-17：两仓库提交推送收尾

用户要求两边推送。CLI手册、文档守卫及记录已提交为5d88ddea08929891723b02420ccc6869a7883e4b，正常推送origin/dev-main-cli并核远端同SHA。运行时再次通过同步器生成26页CLI正文，source-lock指向该已推送提交且dirty=false、channel=development；此前dirty=true的验证记录保留为当时事实。

重新执行npm run verify退出0，15项测试、79页Agent文本及内容/链接/摘要检查、根路径构建通过；日志artifacts/20261117-docs-push-verify.log。dist已重建，未上传部署或发布npm。本仓docs-new既有改动随本次一起提交到dev；不改旧文档和运行时业务，不强推或移动版本tag，最终推送结果以Git回执为准。

## 2026-11-17：退出码的中文含义与机器字段分列

按产品反馈同步CLI手册09/12：退出码表增加中文含义，保留category英文取值；0正常完成、1一般失败，未知/待处理/取消独立。说明成功结果没有统一category/outcome，退出0不代表已授权或已发行；具名批次和授权模块边界保留。CLI正式设计先校准，无业务代码/协议变化。

运行npm run verify退出0，15项测试、26页CLI同步、79页Agent文本/内容与链接摘要检查、根路径构建通过；日志artifacts/20261117-exit-labels-verify.log。来源仍a61ae682、dirty=true、development；既有大chunk警告保留。浏览器实际查看新表及说明，中文标签与英文机器值分列、无正文遮挡；CLI定向33项、包内手册一致性及全新agent复核另见CLI迭代补片。本地5173及site/.vitepress/dist已更新，未部署、未发布，不替代业务验收。

## 2026-11-17：手册50号与13项阅读路径优化

从CLI根docs同步26页，来源锁为a61ae6820b3ac41bb15ccbb2deb046f75f165660、dirty=true、development；版本字符串0.9.0不表示本轮未提交文案已发布npm。首页按任务/对象分层，安装与AI委托集中00，机器协议/长脚本集中12；修正存储保稿换源、主题不等只读解析、导出覆盖、上架读回、错误结构等13项。授权五页保持独立维护边界，只说明正确主体、网页去向和返回，不改授权业务。

两位全新CLI子agent分别按普通用户和AI阅读复查；发现的相邻遗漏及字段守卫问题均修正、定点复核通过。CLI定向37项、命令参考契约6项及安装包手册逐字节smoke另见CLI本轮迭代，不冒充全业务验收。

最终以DOCS_BASE=/、DOCS_CLEAN_URLS=false执行npm run verify退出0：15项测试、79页Agent文本、站内链接/锚点/资源/CLI摘要和VitePress构建通过。日志artifacts/20261117-docs50-delivery-verify.log，大chunk告警保留。浏览器实际核对首页、首次发行、存储、依赖授权和机器错误说明；首次发行流程图改为纵向后，窄屏已显示可读SVG，不以源码围栏冒充图形。

本地服务仍为http://localhost:5173/，最终文件为site/.vitepress/dist/；未上传、发布或推送。保留此前docs-new改动，不改运行时业务及旧packages/docs。仅文档同步/呈现验收，不能替代Console业务、三平台或固定发布候选验证。以下记录保留各自时点事实。

## 2026-11-17：CLI错误、公开范围及当前手册校准

CLI唯一来源为根`docs/`，本次source-lock记录`a61ae6820b3ac41bb15ccbb2deb046f75f165660`、dirty=false、26页、channel=development。包版本字符串仍0.9.0，不表示新修复已发布npm。同步了四字段错误JSON、分类退出码、精确资源成功null的不存在提示、公开/非公开范围、旧公告清理和自动化专题；补齐CLI侧栏第12章。

人工维护的README/about/agents/start及平台、运行时叙事页同步当前流程：依赖允许未签先存稿，发行前核正确主体合同；不因此承诺未发行依赖可访问真实文件。去除旧0.8公告/固定旧页数/旧验包的当前式说明，保留支付暂停、授权新链未开和Console/三平台等限制。运行时业务代码及旧packages/docs无改动。

导航完整性在26页同步后先失败（第12章未入侧栏，14/15），补入口后15/15通过。以`DOCS_BASE=/`、`DOCS_CLEAN_URLS=false`执行`npm run verify`退出0：15项测试、79页内容/链接/资源/锚点/生成摘要检查、VitePress构建通过；日志`artifacts/20261117-cli-alignment-verify.log`。构建保留既有大chunk告警，不当失败或业务验收证明。输出为`site/.vitepress/dist/`，不上传部署。

本地开发站已启动在`http://localhost:5173/`，运行进程由本会话启动（工具session42127，恢复时先查HTTP/实际进程，不能凭旧handle重复启动）。4173实际绑定报EACCES，本轮没有改系统网络设置；采用已成功监听的5173。npm参数转发未按预期传入时，改用本目录`node node_modules/vitepress/bin/vitepress.js dev site --host 127.0.0.1 --port 5173 --strictPort`启动。错误尝试未计为服务启动成功。

本地HTTP已读CLI、错误页、第12章、Agent入口及Markdown/source-lock，均200且类型符合；脚本响应为text/javascript。浏览器实际打开完整命令参考和错误说明，已看到node list、12章导航、RESOURCE_NOT_FOUND/退出4及JSON参数错误/退出2。HTTP安全回执`artifacts/20261117-cli-alignment-http.json`同时证明最新Agent/平台Markdown已导出、dist新增页面存在、7个根路径assets引用均有文件且没有preview前缀。一次内联探针的PowerShell引号解析失败后改用独立mjs，失败不冒充HTTP证据。本轮不是Console业务、CLI固定包或线上OSS部署验收。

## 2026-11-16：开发构建的平台错误与资源状态复验说明

CLI手册08/09已同步最新未发布修复：确认及上传后复验、资源查询404、安全后端提示和写后UNKNOWN边界。源码锁明确为CLI 0.9.0版本号的dirty开发手册，不冒充npm同版已有补片。78页Agent文本、内容检查及构建通过，日志`artifacts/20261116-platform-errors-build.log`；dist未部署。业务反例/5372项CLI回归及独立复核由CLI本轮记录维护，不以文档站构建代替。

## 2026-11-16：0.9.0使用手册同步

同步CLI固定源码21d2f6c的25份手册，更新0.9.0版本选择、节点自建展品合集入口及包首页边界。以`DOCS_BASE=/`、`DOCS_CLEAN_URLS=false`运行`npm run build`通过，78页Agent文本/内容检查及构建完成，日志`artifacts/20261116-cli-090-build.log`。交付文件仅`site/.vitepress/dist`，未部署。CLI合集固定安装包真实dev、Console实际详情及限定范围双审另由CLI本版记录证明；本站构建不替代业务或跨平台验收。

## 2026-11-16：发行与只读解析解耦

CLI手册06/09/11校准：首版及更新不等只读文件SSE，附加值按当前资源类型定义校验；属性列表用definitionsAvailable表达定义状态，不冒充解析完成。运行`npm run build`同步25份CLI手册、导出78页Agent文本、内容检查和构建通过，日志`artifacts/20261116-nonblocking-analysis-build.log`。dist已更新，未部署。CLI新音频dev首发及换版、Chrome实际Console回显由CLI迭代保存，本站构建不替代；源码部署对应及最终固定包验收仍分开。
## 2026-11-16：验证码无联系方式说明同步

从CLI根手册09同步无手机号/邮箱账号的明确处理方式：使用密码登录或先绑定联系方式，不再暗示稍后重试即可解决。本轮`npm run build`同步25份CLI正文、导出78页Agent文本、内容检查与构建通过，日志`artifacts/20261116-unbound-login-build.log`。dist已更新，未部署；验证码业务用例与原始后端信封验证归CLI迭代，不冒充本站进行了短信或Console浏览器验收。
## 2026-11-16：版本产物冲突失败说明同步

CLI根docs/06明确首版备稿、首版提交及更新版本的路径冲突保留原身份和稿，及异步新增占用可能已经上传但不发行版本的边界。本轮以根路径和`.html`配置执行`npm run build`，同步25份CLI手册、导出78页Agent文本、内容检查和构建通过。日志`artifacts/20261116-artifact-conflict-build.log`；dist已更新，未部署。CLI真实dev验证及用户待试用现场归CLI对应迭代，不由本站构建替代。

## 2026-11-16：完整命令参考及短信拒绝说明同步

从CLI根docs同步当前25页开发手册：补齐完整命令参考及节点列表入口，登录、报错和命令参考说明取图前账号检查。source-lock仍为开发工作树，不宣称已发布npm包或线上文档已有这些修改。运行`npm run build`，78页Agent导出、内容/路径/锚点/摘要检查及VitePress构建通过；日志为`artifacts/20261116-sms-rejection-docs-build.log`。输出仅`site/.vitepress/dist`，根路径、`.html`配置不变，未上传部署。

命令参考实际网页已读到`node list [--page <n>]`，无`--resource`。这只证明本地文档可读，不替代Console业务浏览器验收。短信拒绝的CLI真实dev结果归CLI迭代记录；本站构建不自行证明账号业务。下方表格宽度和其他历史结果保留各自范围。

## 2026-11-16：命令参考表格宽度修复（当前）

范围仅docs-new呈现与导航，CLI源手册和业务代码不变。用户截图显示“公共资源匹配参数”表格被命令撑宽、说明列挤成竖排并进入右侧目录；根因是表格自动列宽与行内代码`white-space: nowrap`组合。主题改为固定列布局、表头及行内代码自然换行，保留窄屏表格内部滚动，不靠隐藏右侧目录遮盖问题。

本轮先启动的verify在导航覆盖检查失败：CLI当前同步25页，侧栏只有24页，漏掉已有“节点自建展品合集”入口。补齐实际页面链接后，根路径与`.html`配置的`npm run verify`退出0：15项测试、78页路径/锚点/资源/源摘要与完整构建通过；初次失败保留于`artifacts/20261116-table-layout-verify.log`，修后结果在`artifacts/20261116-table-layout-verify-fixed.log`。既有大chunk告警保留，未放宽检查。

真实Chrome浏览器已观察1920px桌面与390px设备预览下该表格：长命令换行、用途列可读、表格未伸出正文；桌面右侧目录无重叠。原始截图为本次Computer Use回执，完成后已关闭设备预览及DevTools恢复正常窗口。当前4173为本地开发站，`site/.vitepress/dist`已重建；没有上传线上，不代替Console业务浏览器验收或CLI发布。以下日期记录仅代表各自时点。

## 2026-11-13：CLI根docs迁移与授权入口同步（历史）

本节是11月13日当时的文档结果；以下各节保留对应时点的发布、验包和浏览器事实，不作为最新来源或验收批准。该轮CLI公共手册迁至仓库根`docs/`，共24页；原支付页迁为`授权与支付/支付与恢复.md`，新增授权总览、依赖授权、签到节点和已有展品资源授权四页。同步器默认源、dirty检查范围、fixture、CLI侧栏与原生链接已迁移，生成正文与source-lock均由脚本产出，表格行内代码的管道转义仍保留。

本次source-lock记录CLI提交`fe2d56a042affeececcccd924c2d896c86cc125c`、`sourceDirectory: docs`、`dirty: true`、`channel: development`及包版本0.8.0。24份源文件原始字节摘要及生成页摘要逐一匹配。该提交对应的工作树含未提交文档迁移与授权导航，不能把版本字符串相同当成与已发布npm0.8.0正文一致；此前`ef116ed5`及包内20份手册的核验只保留为历史事实。

先执行`npm run sync:cli`生成24页，再以`DOCS_BASE=/`、`DOCS_CLEAN_URLS=false`执行`npm run verify`，退出0：15项文档测试、77页链接/资源/锚点与生成摘要检查、VitePress根路径构建全部通过。回归覆盖根docs与未提交新授权目录的来源登记、生成链接及原始字节保护；不以测试数证明业务覆盖。补齐about页当前24份来源说明后，`build:site`再次退出0。大chunk告警仍保留。日志为`artifacts/cli-docs-root-sync.log`、`artifacts/cli-docs-root-verify.log`和`artifacts/cli-docs-root-final-build.log`。

独立4198本地预览实际核对12条HTML、17个引用JS/CSS的MIME与dist逐字节内容、77份Markdown的HTTP摘要、llms.txt/full、清单和source-lock。24份CLI源/生成摘要均匹配；旧支付的生成页及文本副本已移除，两条旧HTTP路径返回404，不设置重定向。原始回执为`artifacts/cli-docs-root-http.json`，探针为同名mjs，预览进程已停止。这是本地静态HTTP验证，未做浏览器视觉、Console业务或线上部署验收。

最终接续复核后，源手册首页、版本选择、快速上手和节点教程已澄清“0.8.0已发布，本轮仅文档整理未另发版本”，支付与恢复页移除内部验收日期及测试金额，保留历史版本能力。数量及路径仍为24页；工具脚本、测试和业务实现未改。本轮最后执行`sync:cli`与同样根路径参数下的`build:site`，均退出0，77页内容检查与构建通过，未重跑此前已通过的15项测试。最终日志为`artifacts/cli-docs-root-public-final-sync.log`及`artifacts/cli-docs-root-public-final-build.log`。

最终HTTP及来源摘要回执时间为`2026-11-13T06:47:12.433Z`，上述12条HTML、17个资源、77份Markdown、24份源/生成摘要及旧路径404全部再次通过，当前回执仍为`artifacts/cli-docs-root-http.json`；前次回执另存`artifacts/cli-docs-root-http-before-public-final.json`。最终`source-lock.json`的SHA-256为`03fa176003a0a21ffc3fff8fa792d43d7f161e0338f6309c3f9760512089ecf3`，来源仍为上述提交、根`docs`、`dirty: true`及`development`，不表示当前24页与旧npm包相同。预览进程已停止，本轮文档同步产物至此冻结。

本轮只修改docs-new文档消费者、导航、测试和生成内容，不改CLI或运行时产品实现、接口、依赖及旧packages/docs，不提交、推送或上传。唯一部署目录仍为`site/.vitepress/dist`。七项历史缺口、延期网页、三平台、真人验证码及Windows取消限制继续保留；文档迁移不新增签约或支付能力，也不补记业务PASS。

## 2026-11-13：CLI 0.8.0发布后的文档交付

下面的 0.7.0 及 11-05 等记录保留当时事实。CLI 0.8.0 已按用户逐版确认的开发阶段边界发布：发行源码 `ef116ed5cc14de93f619304a43b20eaf9e02d029`，registry 下载包与固定候选 SHA-512 一致，全新安装、bin 及 20 份手册核验通过；dev 和旧包 0.8.0 的 Git tag 已推送。原始包、复核与发布记录在 CLI 仓库的 `.artifacts/release/2026-11-13T03-10-36-923Z-81a27ce6`。npm 初次处理期间的 404 保留，没有再次 publish。

开始前备份运行时已有10份文档脏稿，保留前批改动。CLI 的 20 份源手册由sync:cli生成，source-lock为0.8.0/上述源码/dirty=false，channel仍是development；原始sourceSha256逐页与最终包内dist/docs相同。原生Agent、来源、任务、节点展品和运行时发行/排查入口校准：节点新展品走内联auth-cli；依赖、已有展品、合集单品上游新签与所有新支付转浏览器，不推荐回退0.7付款。新增节点设置、主题切换、展品编辑及验证码登录说明，后者真人未验，微信登录待后端。

首次构建因原命令表行内代码wechat|alipay被拆列，继而把角括号参数编成Vue标签而失败，原始日志artifacts/cli-080-final-build.log保留。只修改同步层的格式适配：按VitePress表格token行号，在完整行内代码中转义未转义管道；已有转义、非表格、围栏、缩进及未闭合片段不改。原始CLI手册和npm归档包不改，source-lock明确登记新转换。修前8PASS/3预期FAIL、修后11/11同步测试PASS，含CRLF源字节不变，日志cli-080-table-red/green.log。不得把第一次构建失败抹成PASS。

最终DOCS_BASE=/、DOCS_CLEAN_URLS=false下npm run verify通过：15项测试、73页链接/资源/锚点及生成摘要检查、VitePress构建成功，日志artifacts/cli-080-final-verify.log。大chunk告警保留，未调高阈值隐藏。CLI仓runtime-manual-check.json再次核20份原文与固定包、生成页摘要一致。

实际启动独立4197本地预览后，9条HTML、14个引用CSS/JS的MIME及与dist逐字节内容、73份Markdown摘要、llms.txt/full、markdown-manifest及source-lock核对通过，预览进程已停止。原始回执在CLI仓.artifacts/release-080-preflight/runtime-http-verification.json；这是本地HTTP，不是视觉浏览器、Console业务或线上部署验证。

唯一可上传目录仍为site/.vitepress/dist，OSS根目录部署，不带preview前缀、不使用artifacts或ZIP。此次只维护docs-new文档及同步测试，不改运行时业务、旧packages/docs、框架或依赖，不上传OSS。文档源码本地提交，运行时仓库未推送。历史七gap、网页/三平台/真人验证码和Windows取消等限制仍保留，不从文档验证外推业务全量PASS。

## 2026-11-02：CLI0.6.1发布后的文档产物

npm0.6.1已发布并完成registry下载、同SHA-512和隔离安装核验；本版Console浏览器按用户最后“先发布吧”延期，不写PASS。docs-new重新同步19份手册，source-lock指实际发包源码6fbf278、版本0.6.1、dirty=false；CLI包内19份原文与同步源已逐字节核验。生成仍标development，后续分支改动不能仅凭版本号复用本次对齐结论。

更新首页/Agent/来源说明后，11项测试、72页链接/锚点/摘要检查及OSS根路径构建通过，日志为artifacts/20261102-cli061-published-docs-verify.log。产物仍仅site/.vitepress/dist；源码提交/推送与OSS部署分别执行，构建不自动上传或切换文档站，实际Git状态以HEAD/status为准。本节是最新结果，以下发布前的“待发布/未发布”仅保留当时状态。

## 2026-11-02：平台任务分流与CLI手册同步

本轮只调整docs-new文档、导航及文本导出入口，不改运行时业务或旧packages/docs。Agent入口、人与AI协作、首页和llms索引按普通资源、合集、存储、节点展品、应用开发及内容使用分流，普通发行不再要求先准备节点和学习运行时。

重新从CLI唯一源手册同步19页；source-lock记录当前提交与dirty=true，正文包含待发布0.6.1修正，不再声称逐字对应已发布npm0.6.0。11项测试、72页内容校验与根路径/带.html构建通过；大chunk告警保留。HTTP核对72份Markdown摘要、19份CLI源摘要、6个JS/CSS响应及MIME通过。独立文本复核通过；本地浏览器已查看Agent和协作页正文与流程图，未把页面检查当作Console业务验收。

本机证据为artifacts/20261102-agent-task-docs-verify.log、20261102-agent-task-docs-http.json。当前预览为http://localhost:4173/agents.html；可发布文件仍只取site/.vitepress/dist全部内容。本轮未上传文档站，也未发布CLI0.6.1。以下各日期记录仅保留当时事实，不覆盖本节新来源与结果。

日期：2026-10-29，Windows，Node.js 22.18.0。验证对象为本目录当前新站，不是运行时业务或发布候选的验收。

| 检查 | 结果与范围 |
|---|---|
| 依赖安装 | 独立安装成功；固定 VitePress 2.0.0-alpha.21 / Vue 3.5.44 / Mermaid 12.2.0，保留 lockfile |
| `npm run verify` | 通过：8项生成器回归、CLI同步、内容检查与站点构建 |
| 正文及链接 | 63页；站内页面、静态资源、真实渲染器锚点、CLI生成摘要均通过 |
| CLI 来源 | 自动同步17页，当前开发工作树；来源提交和摘要见 source-lock.json，不冒充npm已发布能力 |
| Agent HTTP读取 | 63份Markdown逐一HTTP读取并比对SHA256；llms索引及主要HTML存在 |
| 子路径 | `/preview/` 单独构建通过；静态资源前缀、Markdown清单及llms链接前缀匹配 |
| 浏览器 | 首页、搜索字段 `noderuntime_target_version`、流程图实际渲染、390px手机布局及横向表格检查通过；视口已恢复 |
| 原文档保留 | 迁移记录中的49份旧Markdown摘要全部相同；旧目录原有未提交修改保留，本轮未增加旧文档修改 |
| 独立复核 | 同步、导出、构建边界完成只读复核；发现的旧导出清理、子路径、下载链接、锚点问题已修并验证 |

构建仍报告图表相关较大chunk（>500kB）；Mermaid已按需加载，未隐藏告警。未部署线上、未切换旧站、未推送，也未运行资源发行/支付/授权真网测试。

当前本地预览为 `http://localhost:4178/`。预览服务重启方式和构建命令见README；构建后重启preview再复核，避免静态服务缓存旧资源索引。

## 五视角审查修正后的验证

同日后续按用户确认修正10类文档问题，并澄清支付边界。本段对应新的67页站点，前面的63页及浏览器记录是上一轮事实，不能合并冒充本轮点击验收。

| 检查 | 本轮结果 |
|---|---|
| 新站 `npm run verify` | PASS：9项生成器/目录回归、同步、67页路径/锚点/摘要及构建 |
| CLI 源文档检查 | PASS：quality:check及18项静态测试 |
| CLI 构建与安装包 | PASS：build、verify:package；18份手册与源文件逐字节一致 |
| 新站HTTP | PASS：67份Markdown HTTP+SHA256一致；AI起步、支付、节点准备及CLI目录四页服务端HTML匹配 |
| 独立复核 | 未发现阻止交付的新矛盾；支付未实现与正式目标没有混淆 |
| 旧运行时目录 | 49篇Markdown摘要继续保持不变 |
| 本轮浏览器交互 | NOT_TESTED：浏览器连接工具不可用；两次连接均未能进入页面操作，不将上一轮结果写作本轮PASS |

CLI手册源中的旧签约说明已修正；生成器已删除旧段落特判。新增版本/AI代办、节点准备与首次插件路径，CLI专属目录覆盖全部18页。当前CLI暂不支付；需支付才能获得的授权在未完成支付时无法取得。未改业务实现，未执行支付或签约，未发布、部署或推送。

## 平台业务文档定位调整

用户确认本站应独立讲清平台业务和操作。新增任务目录、账号环境、资源生命周期、节点展品四页，更新业务全景、首页、导航和Agent索引；当前71页。9项回归及构建、页面/锚点/摘要检查通过，旧运行时49篇摘要继续不变。CLI源仓库保持已推送状态，本轮仅更新运行时docs-new。

本轮未进行业务真网或浏览器交互复验；不把业务任务索引当成所有平台领域细则已全部核清。存储、收藏和收入结算等扩展域仍需按同一完整任务标准逐项补充。

## 2026-10-30：CLI 0.6.0校准与开发环境部署包

本节是当前产物结果；前面的测试数和浏览器结果属于历史，不合并宣称本轮已做视觉验收。旧构建因会话中断停在bundle阶段，未当作成功；补齐正文后重新执行完整verify并明确exit0。

| 检查 | 实际结果 |
|---|---|
| 来源与发布版本 | CLI来源20a866ce533ec9e96e7d0f9815d32c5e394a96d7，手册/包元数据dirty=false；19份源手册逐字节匹配已下载并验过的npm 0.6.0包。source-lock仍标development，因为同步来源是开发分支，不能据此批准未来分支内容。 |
| 校准范围 | 首页、Agent、版本说明、资源/节点/展品/授权流程及存储任务入口；删除导航的依赖mock宣传，保留真实dev/replace；同步提示不再硬编码历史npm版本。CLI生成正文从唯一来源同步，不手改业务规则。 |
| 回归与构建 | 11项回归PASS；72页链接/锚点/资源/生成摘要检查及VitePress构建PASS。新增两项回归先红后绿。 |
| HTTP及文本入口 | 本轮独立本地HTTP服务读取72份Markdown并逐一核SHA256；8条HTML路由、其引用静态资源、llms.txt/full及source-lock.json均通过。不是线上部署或浏览器视觉检查。 |
| 旧内容与运行时 | runtime-migration清单48份旧Markdown摘要不变；Git未发现docs-new外的tracked修改。运行时代码及旧文档未修改。 |
| 历史打包验证 | 曾验证481文件ZIP与当时dist一致；按用户“只从dist发布”的决定废弃其发布用途，旧170816 ZIP因进程占用暂留，不能当当前交付入口。 |
| 本轮浏览器视觉/线上部署 | NOT_TESTED / NOT_PERFORMED；未复用旧视觉PASS，未上传、切换站点或提交推送运行时仓库。 |

本机细节回执在artifacts/0.6.0-deployment-verification.json，构建日志在0.6.0-calibration-final-verify.log。大chunk告警仍存在，没有调阈值隐藏；不影响本次静态构建成功。CLI完整矩阵/浏览器/三平台、固定模板失败及支付未接入限制在/about保留，不把文档能发布等同业务全部通过。

部署方法见README末节。部署后至少检查首页、CLI快速上手、存储、节点展品、运行时调试、llms.txt及一个旧书签的处理；保留旧目录便于回退。运行时仓库docs-new仍为未提交源码，不能假定Git部署会带上它。

## OSS根路径校准（本轮最终部署产物）

用户上传后发现CSS/JS返回text/html。真实HTTP核对发现：`/preview/assets/app.C0ZVR5V_.js`返回HTML首页，同名`/assets/app.C0ZVR5V_.js`却返回真正的JavaScript；JSON和页面错误路径也返回相同首页。证据见artifacts/oss-preview-original-probe.json。这证明线上页面前缀与文件位置错位，不能通过把HTML响应强行标成CSS/JS解决。

用户确认根目录部署后，最终按base `/`、cleanUrls=false重新verify和构建，11项回归及72页内容检查通过。实际VitePress新preview服务4181验证4条HTML路由、9个JS/CSS响应的MIME与逐字节内容、72份Agent Markdown摘要均通过；原4173旧服务曾缓存旧构建资产映射，未作为最终证据。未声称本轮已做浏览器视觉操作或修改OSS配置。

最终交付目录为`site/.vitepress/dist/`。用户确认只拿dist发布后，永久删除被自动审批以blocked by policy拒绝，故将artifacts/subpath、171944 ZIP、关联压缩包清单和三份临时诊断脚本移入本机忽略目录`.archive/obsolete-deploy-20261030/`；不是声称已永久删除。170816 ZIP被其他进程占用，两次移动均未成功，暂留原位，释放占用后再清理，不继续循环尝试。保留源码、测试、dist以及成功/失败验证记录。根入口为`https://widget-docs.testfreelog.com/`，不加preview。最终HTTP核验事实保留在artifacts/oss-root-verification.json；未替用户上传或刷新线上缓存。


## URL展示易读性校准（2026-10-30）

已将主题与插件的3个调试URL示例改为可直接阅读的地址，并验证URL.searchParams解析得到的dev及插件地址相同；示例仓库18个链接改用可读目录名作为文字，链接目标保持原样。全站渲染后的正文扫描仅剩路由encode/decode文档的必要编码输入/输出，没有把接口协议示例错误解码。

11项回归、72页内容检查及OSS根路径构建通过；重启4181预览后，3个相关HTML页面的实际展示文本与72份Markdown HTTP摘要通过。产物仍只在site/.vitepress/dist，不新增ZIP或部署副本；未改运行时代码、CLI源文档或旧站。细节保留在artifacts/readable-url-verification.json、readable-url-verify.log及readable-url-final-build.log。

## 0.7.0支付边界校准（2026-11-03，发布准备）

本轮仅修改docs-new：站点任务入口、签约支付说明、Agent/来源页、作者依赖及节点/运行时开发发行排查入口。微信支付已实现为显式show/start/qr/status，用户本人扫码；真实dev资源依赖及节点各0.1元交易成功且authStatus=1。支付宝虽有命令分支，当前dev预支付路由Cannot POST、errCode=2，仍BLOCKED。余额、羽币、退款、取消及自动续费未实现；未知只查原单，公共命令未提供通用换渠道重开。同一资源1/合集4/节点2的乙方合同分别核验。

CLI生成页由sync:cli从冻结的0.7.0源手册同步，未手工编辑。首轮同步20份手册并导出73页，内容链接/锚点/资源/摘要检查及VitePress构建通过；新增支付页触发既有导航完整覆盖测试19/20失败，保留此事实，补CLI侧栏支付入口后11项测试全部通过。首轮source-lock仍为开发脏树，不称已发布或最终来源绑定。等待CLI源码固定后重新同步及完整verify，结果在下文续记。

旧packages/docs和业务运行时代码未修改，旧验证事实未改写；未提交、推送或部署。构建仍有大chunk告警，未调阈值隐藏。浏览器视觉、Console双向回显、平台矩阵及支付宝成功不因文档构建成为PASS。

最终来源已固定：CLI提交0533f17a6ef8a79a4050f8e97de6ce1f1979de25、包版本0.7.0、source-lock dirty=false，20份源手册由同步脚本生成。按DOCS_BASE=/、DOCS_CLEAN_URLS=false完整npm run verify通过：11项测试、73页链接/资源/锚点/生成摘要及VitePress构建PASS。日志artifacts/payment-070-final-verify.log；大chunk告警保留。

独立启动本次VitePress预览4187（检查后已停止），HTTP验证7条HTML路由、12个引用CSS/JS的MIME及与dist逐字节一致、73份Markdown逐页SHA256、llms.txt/full与source-lock均PASS；支付页可达且进入llms索引。来源核验0.7.0/上述commit/dirty=false/20页通过，证据artifacts/payment-070-http-verification.json及payment-070-http.log，检查脚本同目录payment-070-http-check.mjs。此为本地HTTP，不是浏览器视觉、线上部署或业务支付测试。

唯一交付目录仍为site/.vitepress/dist/，根目录直接含index.html、assets、markdown、llms.txt及source-lock.json；无新增发布ZIP。0.7.0在本记录时尚未npm成功，站点保留发布准备字样。本轮未提交/推送运行时仓库、未修改旧packages/docs及业务实现、未上传OSS；之后发布状态变化须单独校准并重建，不把当前构建当已上线。

### 0.7.0 npm成功后的最终站点校准

0.7.0已于本轮npm发布成功；正常npm client pack下载同SHA512、全新安装/bin及20份手册核验通过，原始回执在CLI侧release-070-preflight/registry-result.json。本记录保留此前raw fetch读取archive 404失败事实，不将它称成功；成功证据来自正常npm路径。发布的tarball SHA512为6e8233185edd65f297949e2ff6e7bae56a8c4009acecccd5b7dace512a7453dac62fadd92b85791b8d4550d6d5608aa016aad1f8879d5c58e25fa5f3f7e10bce。

本站about/README及任务正文改为0.7.0已发布，付款人/合同乙方三页澄清一起进入本轮dist。已发布npm包首页README仍有“支付尚不支持”遗漏，实际读取下载包README确认；完整20份手册正确。本站明确此首页错误，未声称已改npm归档包；源码修正待未来版本，按用户最新指示0.7.1暂不发布，先审查修改、解决支付宝后再安排。支付宝dev仍BLOCKED，浏览器按本版用户明确决定延期、不记PASS，其他历史gap/三平台不外推通过。

本轮没有运行sync:cli：source-lock继续固定0533f17a6ef8a79a4050f8e97de6ce1f1979de25/0.7.0/dirty=false。从registryBin对应dist/docs读取20份正文，逐份字节SHA256匹配source-lock.sourceSha256，再核20份生成页generatedSha256，全部通过；证据artifacts/payment-070-published-manual-check.json。未同步CLI即将追加的事后文档修正提交，未手改source-lock。

最终使用npm test + DOCS_BASE=/、DOCS_CLEAN_URLS=false下npm run build:site，11项测试、73页链接/资源/锚点/生成摘要及构建PASS；日志payment-070-published-tests.log和payment-070-published-build.log。独立VitePress预览HTTP验证9条HTML（含accounts/节点/授权）、14个CSS/JS的MIME与逐字节内容、73份Markdown SHA256、llms索引/全文及source-lock全部通过，预览已停止；证据payment-070-published-http-verification.json及payment-070-published-http.log。旧预发布检查回执保留，不覆盖历史失败。大chunk告警仍有，不隐藏。

最终唯一站点目录site/.vitepress/dist/；本轮未做浏览器操作、未提交/推送运行时、未上传OSS、未改旧packages/docs或业务运行时代码。站点构建通过不代表支付宝或完整业务验收通过。

## 提交前复验（2026-11-04）

用户要求提交并推送运行时仓库的现有改动。本次保持CLI 0.7.0冻结源及source-lock不变，未运行sync:cli；11项文档测试、73页内容检查，以及DOCS_BASE=/、DOCS_CLEAN_URLS=false下的build:site通过。构建生成的site/.vitepress/.temp加入忽略规则，与dist、缓存和Agent生成副本一起不提交。现有交接便笺保留入库；本次不修改支付实现、不重新验证支付归因、不上传OSS或发布npm，推送结果以Git记录为准。

## Windows内测本地联调文档（2026-11-05）

CLI源手册已明确npm0.7.0于11-03发布，同时区分尚未发布的本地修正：密码星号、系统属性JSON规则、属性保存回执和路径/帮助提示。本轮执行sync:cli同步20页，source-lock为970928c/dirty=true/development；当前正文不能沿用此前0533f17与归档包逐字节一致的批准。about/agents/README已校准该边界。

本轮11项文档测试、73页链接/锚点/生成摘要检查及DOCS_BASE=/、DOCS_CLEAN_URLS=false下build:site通过。输出仍为site/.vitepress/dist，代码及文档未提交推送，未上传OSS。线上agents/about旧状态须部署后再核，不能把本地构建通过称为线上已经更新；CLI产品最终验证另见CLI本轮迭代。
