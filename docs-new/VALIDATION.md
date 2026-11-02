# 本轮验证记录

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
