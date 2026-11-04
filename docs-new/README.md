# Freelog 平台使用与开发文档（新版）

独立静态站点，2026-10-29 开始重构。旧 `packages/docs` 原样保留；本目录不改运行时业务实现、不启动 CI、不发布线上。

## 开工方案与验收

目标：人和 Agent 从任务入口找到准确的 CLI、主子应用接入及平台说明。先解释平台对象和主子应用，再讲接入/调试/发行，最后查 API。关键字段、命令、返回与成功条件必须有文字，图片仅辅助。

产品定位是平台业务及操作的独立入口，不只是工具参数参考。作者创作发行、节点与展品运营、应用开发和访问消费在同一模型下解释；CLI、运行时SDK、Console是执行方式。新增能力时更新业务任务的入口，不依赖官方帮助补关键步骤，不宣称未核对业务已全部覆盖。

实施顺序：选型和目录 → 新站框架 → 核对并迁移内容 → CLI 单一来源同步 → 链接/源码/构建检查 → 浏览器检查与迁移说明。作者页和节点展品页分开；主题插件子应用没有平台统一 Node 版本限制。

按用户选择采用 VitePress **2.0.0-alpha.21**，Vue 与 Mermaid 固定依赖并提交独立 lockfile。2.0 当前带 alpha 标识；该版本选择已明确，不与1.x混用。配置依据使用 [2.0 官方文档](https://vitepress.dev/guide/getting-started)。

验收：新目录独立安装/构建，站内链接及静态资源有效，Mermaid 和代码示例可读，CLI 同步可重现/缺源时报错，Agent 文本入口存在，旧目录在操作前后未变化。浏览器验证仅验证文档呈现，不表示业务真网流程通过。

## 本地使用

```sh
cd docs-new
npm ci
npm run dev
```

```sh
npm run verify
npm run preview
```

本目录文档工具链要求 Node.js 22.14+。**这不限制主题/插件子应用的 Node.js 版本**；子应用遵循自己的构建工具要求。

`dev` 与 `build` 先检查同步源；CLI 仓库默认位于运行时仓库旁的 `freelog-runtime-cli`。换机后可设置 `FREELOG_CLI_ROOT` 指向该仓库的绝对目录；这不是认证变量，不包含凭据。CLI 源文档同步后保存在本目录，`verify` 核对源未变。若只部署固定版本的已同步站点，可执行 `npm run build:site`；此命令不从另一仓库取新内容，来源元数据须随部署产物保留。

## 内容所有权

- `site/runtime`、`site/platform`、`site/reference`、`site/library`：新版文档正文，在此维护。
- `site/cli`：生成内容，禁止手改；唯一来源是 CLI 仓库 `docs/使用手册`。
- `site/public/markdown`、`llms.txt`、`llms-full.txt`：构建生成的纯 Markdown 阅读副本，禁止手改，不包含源码目录或凭据。
- `source-lock.json`：同步时记录来源提交、工作树状态、文件摘要和 CLI 包版本；开发分支文档明确标识，不冒充 npm 稳定版。
- `MIGRATION.md`：迁移覆盖、旧链接、仍需人工确认的业务事实及上线前事项。

CLI 文档同步只改变格式与链接，不偷偷改业务规则；发现源文档矛盾，显式标明并回到源仓库修正。运行时源码与线上部署对应关系尚未核实，文档源码核对不替代部署验收。

## 发布与部署

2026-11-02已将Agent及人与AI协作入口按平台任务分流，并重新同步CLI源手册。0.6.1已发布并完成registry下载/安装核验，本次19份源手册与该npm包内正文逐字节一致；后续源改动需重新核对，不能仅凭版本号认定一致。最新本地文档验证与构建见`VALIDATION.md`对应日期记录。

输出目录 `site/.vitepress/dist`，部署为静态站点。当前目标站点是 dev/测试共用的 `https://widget-docs.testfreelog.com/`，不在本任务自动替换旧站。

部署前确认 CLI 文档对应的发布版本/开发候选，检查 `source-lock.json`，运行 `npm run verify`，预览后再替换静态目录。子路径部署通过 `DOCS_BASE=/子路径/` 构建；URL不含凭据。

### 唯一发布目录：site/.vitepress/dist

发布只取`site/.vitepress/dist/`中的全部内容，直接上传到OSS根目录。根目录应直接出现`index.html`、`assets/`、`markdown/`、`llms.txt`和`source-lock.json`，不要再套一层dist或preview文件夹。访问`https://widget-docs.testfreelog.com/`，不加`/preview/`。

重新生成OSS发布内容时，在本目录的PowerShell执行：

```powershell
$env:DOCS_BASE = '/'
$env:DOCS_CLEAN_URLS = 'false'
npm run verify
```

检查命令成功后再上传；`.html`链接不依赖OSS无扩展名重写。整体更新HTML、assets及其余文件，避免混用不同构建；若有CDN，刷新缓存。当前本地预览为`http://localhost:4181/`。

2026-10-30已对齐npm 0.6.0并验证CSS/JS MIME和字节及72份Agent文本，详见`VALIDATION.md`末节。`artifacts/`不是发布目录；旧subpath副本、171944 ZIP、压缩包清单及临时脚本已移入本机`.archive/obsolete-deploy-20261030/`，不作为部署入口或提交Git。永久删除被自动审批拒绝，本次保留可恢复归档。旧170816 ZIP被其他进程占用，暂留artifacts，释放占用后再清理；不要取它发布。

本轮没有上传或切换线上站点。替换旧站前保留线上回退，旧链接迁移见`runtime-migration.json`。docs-new源码和独立lockfile随Git提交；node_modules、dist、artifacts及本机归档忽略。换机后在本目录安装依赖，再按上面的OSS构建步骤生成dist，不能从Git直接取得构建产物。

2026-11-03 CLI 0.7.0已发布，正常npm客户端下载包同SHA512、全新安装/bin和20份手册核验通过；生成源保持0533f17、dirty=false，不sync到事后文档修正提交。微信显式二维码准备与原单查询已实现，资源/合集/节点合同分离；dev支付宝路由仍BLOCKED。本版按用户批准的开发阶段边界发布，浏览器和历史完整矩阵仍延期。npm包首页README尚有“支付尚不支持”遗漏，完整20份手册正确，首页修正待未来版本，0.7.1暂不发布。未修改已发布归档包。最终构建及核验见VALIDATION.md本日末条记录，生成页仍不手改。
