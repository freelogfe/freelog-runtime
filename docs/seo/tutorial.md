# Freelog 搜索引擎 SEO 教程（百度 + Google）

> **范围**：只讨论 **百度**、**Google** 如何发现、抓取、收录、展示 Freelog 节点与展品页面。  
> 不涉及微信分享、Open Graph 等社交场景。

读完后你应该能回答：

1. 百度 / Google 从「发布展品」到「用户搜到链接」，完整走哪几步？
2. 两家搜索引擎**相同**要做什么、**不同**要做什么？
3. Freelog 里控制台、中台、运行时、主题各负责哪一步？

---

# 目录

| 章节 | 内容 |
| --- | --- |
| [一、SEO 是什么](#一搜索引擎-seo-是什么) | 目标与结果长什么样 |
| [二、角色分工](#二freelog-里的角色) | 控制台 / 中台 / 主题 / 运行时 |
| [三、7 步主流程](#三完整流程从发布到被搜到) | 百度 Google **共用**的主线 |
| [四、百度 vs Google](#四百度-vs-google) | 爬虫、站长工具、差异与策略 |
| [五、步骤 3 详解](#五步骤-3-详解发现-url) | sitemap、robots、站长提交、爬虫何时来 |
| [六、步骤 4 详解](#六步骤-4-详解抓取页面) | HTML 注入、JS 渲染差异 |
| [七、落地分工清单](#七各角色分工清单) | 可按勾选实施 |
| [八、实施顺序](#八实施顺序) | 推荐排期 |
| [九、FAQ](#九faq) | 常见问题 |

---

# 一、搜索引擎 SEO 是什么

用户在 **百度** 或 **Google** 输入关键词（如「冰岛黑沙滩摄影」），结果里出现：

```
冰岛黑沙滩日落 - 小明的摄影集     ← <title>
2024年8月摄于Vik黑沙滩…         ← meta description
https://a.freelog.cn/64a.../detail
```

**SEO** = 让搜索引擎：

1. **发现**你的 URL（知道有这个页面）
2. **抓取**页面（下载 HTML）
3. **索引**（把 URL 和 title/正文存进搜索库）
4. **匹配**（用户搜索时和 query 对上）
5. **展示**（结果列表里出现你的链接）

---

# 二、Freelog 里的角色

```
控制台 ──发布展品──▶ 后端（exhibitTitle / intro / 文件）
                        ▲
                        │ 读取
                   中 台
                   · 生成 sitemap.xml、robots.txt
                   · 爬虫访问时 HTML 注入 title/description
                   · （可选）向站长 API ping 新 URL
                   ╱              ╲
          返回 HTML              API
                  │                    │
            运行时 Shell            主 题
                  └──────────▶─────────┘
                         浏览器 CSR
```

| 角色 | 百度 + Google SEO 职责 |
| --- | --- |
| **控制台** | 用户填 `exhibitTitle`、`exhibitIntro`（搜索匹配的来源） |
| **后端** | 存展品；提供公开展品列表 API 供 sitemap 用 |
| **中台** | sitemap / robots / HTML 注入（**两家共用一套实现**） |
| **运行时** | `setPageMeta`（辅助，非爬虫首屏必须） |
| **主题** | detail URL、站内 `<a href>` 内链、详情页 h1/正文 |
| **运营** | 百度站长平台 + Google Search Console 验证与提交 |

---

# 三、完整流程：从发布到被搜到

百度和 Google **共用同一条 7 步流程**。差异主要在步骤 3（怎么告诉它们）、步骤 4（JS 渲染能力）、步骤 6（排名），不在 Freelog 架构本身。

```
步骤1  发布展品（控制台 → 后端）
步骤2  固定可收录 URL（/{exhibitId}/detail）
步骤3  搜索引擎「发现」URL
步骤4  爬虫「抓取」页面（中台 HTML 注入）
步骤5  建立索引
步骤6  用户搜索 → 匹配 → 展示
步骤7  用户点击 → CSR 加载主题与展品
```

```
步骤1-2  发布 + URL
    ↓
步骤3    sitemap + robots + 内链 + 站长平台提交
    ↓    （百度、Google 各自调度爬虫，不是全网循环扫域名）
步骤4    爬虫 GET detail URL → 中台注入 meta
    ↓
步骤5    写入各自索引库
    ↓
步骤6    用户在某家搜索引擎搜索 → 命中 → 展示
    ↓
步骤7    点击 → 正常打开页面
```

---

## 步骤 1：发布展品

```
exhibitTitle  = "冰岛黑沙滩日落"    ← 两家搜索结果标题的主来源
exhibitIntro  = "2024年8月摄于Vik"  ← 摘要主来源
tags          = ["摄影","冰岛"]
状态          = 公开、上线
```

**title / intro 空或不含用户会搜的词 → 步骤 6 匹配失败。**

---

## 步骤 2：固定 detail URL

| 页面 | URL |
| --- | --- |
| 节点首页 | `https://a.freelog.cn/` |
| 展品详情 | `https://a.freelog.cn/{exhibitId}/detail` |
| 合集单品 | `https://a.freelog.cn/{exhibitId}/{itemId}/detail` |

主题用 `getShareUrl` / `mapShareUrl` 与平台规范对齐。

❌ 不能用于 SEO：`/gallery?page=3`、`/?theme=encode(...)`

**原因**：中台要从 URL 解析 `exhibitId` 才能注入 title；爬虫也要靠稳定 URL 收录。

---

# 四、百度 vs Google

## 4.1 相同点（Freelog 只做一套）

| 能力 | 说明 |
| --- | --- |
| **sitemap.xml** | 同一格式，两家都认 [Sitemaps 协议](https://www.sitemaps.org/) |
| **robots.txt** | 同一格式，`Sitemap:` 指向 sitemap 地址 |
| **HTML meta** | `<title>`、`meta description`、`canonical`、`robots` 两家都用 |
| **json-ld** | Schema.org 结构化数据，Google 支持好，百度也部分采用 |
| **detail URL 规则** | 完全相同 |
| **中台 HTML 注入** | **一套实现，服务两家爬虫** |

**结论：中台 / 主题 / 控制台的工作不因「做百度还是 Google」而分裂成两套系统。**

---

## 4.2 不同点（运营与预期）

| 维度 | 百度 | Google |
| --- | --- | --- |
| **主要用户** | 中国大陆 | 全球 / 海外 |
| **爬虫名称** | Baiduspider | Googlebot |
| **站长工具** | [百度搜索资源平台](https://ziyuan.baidu.com/) | [Google Search Console](https://search.google.com/search-console) |
| **域名验证** | 文件 / meta / CNAME | 文件 / meta / DNS |
| **提交 sitemap** | 资源平台 → 普通收录 → sitemap | Search Console → Sitemaps |
| **JS 渲染** | 较弱，**首屏 HTML 更重要** | 较强，仍建议 HTML 注入作保底 |
| **新站收录速度** | 往往较慢（数天～数周） | 相对快一些（数天常见） |
| **索引 API** | 普通收录 URL 提交 | Indexing API（限特定类型，展品页一般用 sitemap 即可） |

---

## 4.3 对 Freelog 的策略

```
必做（两家）：中台 HTML 注入 + sitemap + robots + 主题内链 + detail URL
必做（运营）：两个站长平台都验证节点域名、都提交 sitemap
加分：主题详情页 h1/正文（尤其帮百度；Google 也受益）
可选：Google 可观察 Search Console 覆盖率；百度看资源平台索引量
```

**不要赌「Google 能渲染 JS 就不做 HTML 注入」**——百度收录会吃亏，Google 也不稳定。

---

## 4.4 爬虫如何识别（中台可选）

日志里可区分访客：

| User-Agent 含 | 爬虫 |
| --- | --- |
| `Baiduspider` | 百度 |
| `Googlebot` | Google |

HTML 注入逻辑**无需**按爬虫分支，统一返回相同 meta 即可。

---

# 五、步骤 3 详解：发现 URL

## 5.1 核心问题

步骤 1～2 只在**你的系统内**有了数据和 URL。  
**百度、Google 都不会**在一台机器上 7×24 循环扫描「全世界每一个域名」。

它们用 **调度器 + 待爬队列**：

```
URL 进入队列的来源：
  · 站长平台提交的 sitemap
  · robots.txt 里的 Sitemap 地址
  · 从已收录页面上的 <a href> 跟过去
  · 外部网站外链
  · 历史收录域名的定期回访
        ↓
调度器按优先级、配额分配爬虫任务
        ↓
GET robots.txt → GET sitemap.xml → GET 各 detail URL
```

**不是** `for (全网域名) { 爬一遍 }`。

---

## 5.2 sitemap.xml 是什么

- 站点根路径的 **XML 文件**：`https://a.freelog.cn/sitemap.xml`
- 内容：**希望收录的 URL 列表**（交给搜索引擎的「目录」）
- **谁生成**：中台调后端公开展品 API，自动生成
- **主题不用手写**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://a.freelog.cn/</loc>
    <lastmod>2026-07-21</lastmod>
  </url>
  <url>
    <loc>https://a.freelog.cn/64a26ea41cbfe2002f9cb6e9/detail</loc>
    <lastmod>2026-07-20</lastmod>
  </url>
</urlset>
```

| 字段 | 含义 |
| --- | --- |
| `<loc>` | 完整 URL，必填 |
| `<lastmod>` | 最后更新时间，选填，帮爬虫判断要不要重爬 |

**单节点 URL 过多时**（如 >5 万）：可拆 `sitemap-index.xml` + 多个分片 sitemap（中台进阶实现）。

---

## 5.3 robots.txt 是什么

- 地址：`https://a.freelog.cn/robots.txt`
- 作用：允许/禁止爬取 + **告诉爬虫 sitemap 在哪**

公开节点：

```txt
User-agent: *
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: https://a.freelog.cn/sitemap.xml
```

私密节点：

```txt
User-agent: *
Disallow: /
```

典型顺序：`爬虫 → robots.txt → sitemap.xml → 各 detail URL`。

---

## 5.4 发现 URL 的四种方式（百度 + Google 通用）

| 方式 | 谁做 | 百度 | Google | 说明 |
| --- | --- | --- | --- | --- |
| **sitemap.xml** | 中台 | ✅ | ✅ | 主动递 URL 清单 |
| **robots.txt 指向 sitemap** | 中台 | ✅ | ✅ | 被动发现 sitemap |
| **站内 `<a href>` 内链** | 主题 | ✅ | ✅ | 首页/列表链到 detail |
| **站长平台提交 sitemap** | 运营 | ✅ 资源平台 | ✅ Search Console | **新节点最可靠** |
| **外链** | 外部 | ✅ | ✅ | 可选 |

**缺步骤 3 → 两家爬虫都可能永远不知道 URL → 步骤 4～6 不发生。**

---

## 5.5 站长平台操作（运营必做）

每个 Freelog **节点域名**（如 `a.freelog.cn`）在两家分别验证一次。

### 百度：百度搜索资源平台

1. 登录 [百度搜索资源平台](https://ziyuan.baidu.com/)
2. 添加站点 `https://a.freelog.cn`
3. 验证所有权（下载验证文件放根路径 / meta 标签 / CNAME，与中台配合）
4. **普通收录** → 提交 sitemap：`https://a.freelog.cn/sitemap.xml`
5. 可选：手动提交重要 detail URL（新展品上线时）
6. 查看「索引」报表，确认抓取与收录量

### Google：Google Search Console

1. 登录 [Google Search Console](https://search.google.com/search-console)
2. 添加资源 `https://a.freelog.cn`（域或 URL 前缀）
3. 验证所有权（HTML 文件 / meta / DNS）
4. **Sitemaps** → 提交 `sitemap.xml`
5. 查看 **Pages** → **Indexing** 覆盖率
6. 可用 **URL Inspection** 测试单个 detail URL 是否已索引

### 平台侧可自动化（中台进阶）

| 能力 | 说明 |
| --- | --- |
| sitemap ping Google | 更新 sitemap 后 `GET https://www.google.com/ping?sitemap=...` |
| 百度 ping | 资源平台 API（需 token，按百度文档） |
| 新展品通知 | 展品发布 webhook → 触发 ping / 提交 URL |

首版可只做静态 sitemap + 人工站长提交。

---

## 5.6 百度 / Google 什么时候来爬？

| 情况 | 预期 |
| --- | --- |
| 新节点，未提交站长平台 | 可能**很久不来**或只偶然爬到首页 |
| 已提交 sitemap | 通常 **数天内**开始抓 sitemap 内 URL（分批，不保证一次全抓） |
| 老节点、更新频繁 | 回访更勤；sitemap 更新后可能几天内重爬 |
| 展品刚发布 | 进 sitemap 后排队；**不是实时**进搜索结果 |

**收录进索引后**，用户搜索才可能看到（步骤 5～6），整体 **数天～数周** 常见。

---

# 六、步骤 4 详解：抓取页面

## 6.1 爬虫请求

```
GET https://a.freelog.cn/64a26ea41cbfe2002f9cb6e9/detail
User-Agent: Mozilla/5.0 (compatible; Baiduspider/2.0; ...)
或
User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; ...)
```

## 6.2 Freelog 的 CSR 问题

主题内容靠 JS 渲染。爬虫行为：

| | 百度 | Google |
| --- | --- | --- |
| 首屏 HTML | **主要依据** | 重要，但常二次渲染 JS |
| 执行 JS | 有限 / 延迟 | 相对成熟，仍不保证 |
| **不靠 HTML 注入的风险** | 高 | 中 |

当前占位 HTML：

```html
<title></title>
<meta name="description" content="Web site created using create-react-app" />
```

→ 两家都可能收录错误信息。

## 6.3 中台 HTML 注入（百度 + Google 共用）

在返回 `index.html` **之前**，按 URL 写 meta：

```html
<head>
  <meta charset="utf-8" />
  <html lang="zh-CN">

  <title>冰岛黑沙滩日落 - 小明的摄影集</title>
  <meta name="description" content="2024年8月摄于Vik黑沙滩" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="https://a.freelog.cn/64a26ea41cbfe2002f9cb6e9/detail" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "name": "冰岛黑沙滩日落",
    "description": "2024年8月摄于Vik黑沙滩",
    "contentUrl": "https://cdn.example.com/photo.jpg"
  }
  </script>
</head>
<body>
  <noscript>
    <h1>冰岛黑沙滩日落</h1>
    <p>2024年8月摄于Vik黑沙滩</p>
  </noscript>
  <div id="freelog-plugin-container"></div>
  <script src="/assets/main.js"></script>
</body>
```

中台逻辑：

```
拦截 GET /{exhibitId}/detail
  → 解析 nodeDomain、exhibitId（及 itemId）
  → 调后端 getExhibitById、getInfoByNameOrDomain
  → 校验公开 / 上线；私密则 robots: noindex
  → 填充模板 → 返回 HTML
```

**中台不渲染完整 UI**；步骤 7 仍由浏览器 CSR 加载主题。

### 各字段与数据来源

| 字段 | 用途 | 来源 | 写入方 |
| --- | --- | --- | --- |
| `<title>` | 搜索结果标题 | `exhibitTitle` + 节点名 | 中台 |
| `description` | 摘要 | `exhibitIntro` | 中台 |
| `canonical` | 去重 | detail URL | 中台 |
| `robots` | 是否收录 | 公开/私密规则 | 中台 |
| `json-ld` | 结构化 | 展品字段 | 中台 |
| `<h1>`、正文 | 关键词匹配 | 同上 | 主题（+ 可选 noscript） |
| `img alt` | 图片搜索 | `exhibitTitle` | 主题 |

### 百度 vs Google 在本步的差异

| | 百度 | Google |
| --- | --- | --- |
| 注入的 title/description | **决定性** | 重要 |
| json-ld | 有帮助 | **更有帮助** |
| 主题 h1/正文 | 强烈建议 | 建议 |
| noscript 静态摘要 | 对百度 **特别有用** | 有用 |

---

## 6.4 步骤 5～6：索引与搜索匹配

**步骤 5** 由搜索引擎内部完成，Freelog 无代码。

**步骤 6** 匹配逻辑（简化）：

```
用户搜：「冰岛黑沙滩」
  → 索引中找 title / description / 正文 相关的 URL
  → 命中 exhibitTitle 含「冰岛黑沙滩日落」的 detail 页
  → 展示（排名受权重、竞争、更新频率等影响）
```

| 用户搜 | 匹配位置 | 字段 |
| --- | --- | --- |
| 冰岛黑沙滩 | title | `exhibitTitle` |
| Vik | description | `exhibitIntro` |
| 摄影 | tags、正文 | `exhibit.tags` |

---

## 6.5 步骤 7：用户点击（落地）

与 SEO 收录无关，但影响体验：

```
GET detail URL → 中台 HTML → JS → 运行时 → 主题
→ mapShareUrl → getExhibitById → 展示展品
```

`mapShareUrl` 错误会导致「搜到了但点进来不对页」。

---

# 七、各角色分工清单

## 控制台 / 后端

- [ ] `exhibitTitle`、`exhibitIntro` 必填，含目标搜索词
- [ ] 公开展品 API：供 sitemap 分页拉取（skip/limit 或游标）
- [ ] 私密 / 下线展品：不进入 sitemap

## 中台

- [ ] 路由：`/`、`/{exhibitId}/detail`、`/{exhibitId}/{itemId}/detail`
- [ ] HTML 注入：title、description、canonical、robots、json-ld、可选 noscript
- [ ] 动态 `sitemap.xml`（仅公开展品 + 节点首页）
- [ ] 动态 `robots.txt`（公开 Allow + Sitemap 行；私密 Disallow）
- [ ] 爬虫与正常用户**同一套 URL**，不对 Googlebot 隐藏内容（除非故意私密）
- [ ] （可选）sitemap 更新后 ping Google / 调百度 API
- [ ] （可选）站长验证文件托管

## 运营（每个节点域名 × 2 家）

- [ ] 百度搜索资源平台：验证 + 提交 sitemap
- [ ] Google Search Console：验证 + 提交 sitemap
- [ ] 定期查看索引/覆盖率报表
- [ ] 新节点预期：数天～数周才有稳定收录

## 主题

- [ ] `mapShareUrl` + `getShareUrl`（detail URL）
- [ ] 每件展品有详情页（非仅弹窗）
- [ ] 列表/首页：`<a href="/{exhibitId}/detail">` 真实 href
- [ ] 详情页：`<h1>` + 描述 + `img alt`
- [ ] 可选：`setPageMeta`（与注入 meta 一致）

## 运行时 Shell

- [ ] `setPageMeta`（辅助）

---

# 八、实施顺序

```
阶段 1 — 爬虫能读懂（两家保底）
  1. 中台：HTML 注入（title / description / canonical / robots）
  2. 控制台：title / intro 规范
  3. 主题：detail URL + mapShareUrl

阶段 2 — 爬虫能发现
  4. 中台：sitemap.xml + robots.txt
  5. 主题：站内 detail 内链
  6. 运营：百度资源平台 + Google Search Console 验证并提交 sitemap

阶段 3 — 提高匹配质量
  7. 中台：json-ld + noscript 摘要
  8. 主题：详情页 h1 / 正文 / alt
  9. 运行时：setPageMeta

阶段 4 — 运维与进阶
  10. 监控两家索引量
  11. sitemap 分片、lastmod、自动 ping
  12. （可选）SSR / 预渲染
```

---

# 九、FAQ

**Q：百度和 Google 要做两套 SEO 吗？**  
**不用。** sitemap、robots、HTML 注入、URL 规则同一套；分别在两家站长平台提交 sitemap。

**Q：百度会循环爬所有域名吗？**  
**不会。** 按队列和配额调度；新节点要靠 sitemap + 站长提交进入队列。

**Q：只做了 HTML 注入够吗？**  
**不够。** 还要步骤 3 让爬虫知道 URL，并等待索引（数天～数周）。

**Q：Google 能渲染 JS，可以不做 HTML 注入吗？**  
**不建议。** 百度会严重吃亏；Google 也不保证及时渲染。HTML 注入是两家保底。

**Q：sitemap 提交后多久能搜到？**  
无固定时间。通常数天开始抓取，数天～数周进索引；新站更慢。

**Q：展品和中台什么关系？**  
展品在后端；中台读数据生成 sitemap 和 HTML meta，不存展品。

**Q：setPageMeta 能替代 HTML 注入吗？**  
**不能**替代爬虫首屏；仅作主题内切页补充。

**Q：私密展品要 SEO 吗？**  
**不要。** `noindex`，不进 sitemap，两家站长平台里也会逐渐从索引移除。

**Q：一个 Freelog 平台很多节点，sitemap 谁管？**  
**每个节点域名一份** `https://{node}.freelog.cn/sitemap.xml`，中台按 host 区分生成。

**Q：Google 图片搜索 / 百度图片呢？**  
除 title/description 外，需要可抓取的图片 URL、`img alt`、ImageObject json-ld；图片 CDN 勿对爬虫封禁。

---

# 十、端到端示例（百度 + Google 并行）

```
Day 0   控制台发布展品「冰岛黑沙滩日落」，状态公开
        后端有数据；detail URL = /64a.../detail

Day 0   中台上线：HTML 注入 + sitemap + robots
        主题：内链 + 详情页 h1

Day 1   运营：百度资源平台、Google Search Console
        验证 a.freelog.cn，提交 sitemap.xml

Day 2~7 Baiduspider / Googlebot 开始抓 sitemap 内 URL
        中台返回带 title 的 HTML

Day 7~30 两家陆续写入索引

Day 30+ 用户在某家搜「冰岛黑沙滩」
        可能看到 https://a.freelog.cn/64a.../detail
        点击 → 流程步骤 7 → 看到照片
```

---

# 延伸阅读

| 文档 | 内容 |
| --- | --- |
| [HTML 层 SEO](./html-seo.md) | 中台 HTML 注入实现细节 |
| [展品 SEO](./exhibit-seo.md) | 图片/视频/文档 json-ld 差异 |
| [SEO 总览](./index.md) | 架构分层说明 |
| [展品 API](../../packages/docs/api/exhibit.md) | exhibitTitle 等字段 |
| [百度站长平台](https://ziyuan.baidu.com/) | 验证与 sitemap 提交 |
| [Google Search Console](https://search.google.com/search-console) | 验证与索引监控 |
