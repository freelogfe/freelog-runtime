# 把市场资源签约到节点

::: info CLI 同步文档
本页自动同步自 CLI 仓库使用手册。先核对已安装版本与本页适用范围；Node.js 22.14+ 是 CLI 自身要求，不是运行时对子应用的要求。来源、发布状态及已知限制见[版本说明](/about)。
:::


需要把本节点多个普通展品组织成目录并独立设置消费策略，进入[节点自建展品合集](./展品合集.md)。它与市场资源合集签入后形成的合集展品不同。

授权步骤按入口分别看[首次签到节点](../授权与支付/签到节点.md)和[已有展品资源授权](../授权与支付/展品资源授权.md)，支付与未知结果统一看[支付与恢复](../授权与支付/支付与恢复.md)。本页保留节点选择、展品管理及完整使用旅程。

安装来源见[版本选择](../00-版本选择与AI代办.md)。节点/展品与作者发行分开，不用init、bind或N.json；已有节点直接使用，没有节点时按下文经专门确认创建。

节点资料修改和主题激活/切换操作见第6、7节，展品资料、配置及自定义信息编辑见第4节。展示版本切换只改变同一展品引用的版本，不等于换用另一个节点主题。

## 1. 登录、找资源和节点

节点和展品是线上对象，通过 --node 或位置参数中的节点/展品 ID 定位，不使用作者工程的 --resource 选择器。对应命令帮助不展示该参数，误传仍会明确拒绝；--cwd 指定登录等上下文所在目录，不代替目标节点或展品 ID。

```sh
freelog-cli login
freelog-cli market search "图片"
freelog-cli market show <资源ID>
freelog-cli node list
```

搜索包含公开上架单资源和作者合集，可加 `--subject resource` 或 `--subject collection`。每页50条，交互终端可翻页；AI用 `--page 2 --json` 明确读取下一页。show 用精确ID或完整 username/name，查看版本和启用的签约策略。标题可重复，不能当精确标识；本人下架或非公开资源应从本地身份或Console查精确ID，搜索为空不表示资源不存在。搜索保持只读，选定来源后按第2节独立执行签约命令。

### 需要新节点时

每人最多3个节点，先查看已有节点，确有需要再创建。创建会占用名额；删除是第9节的独立危险操作，AI不能为腾名额自动删旧节点。请在填写前和提交前认真核对是否确实需要新节点。

```sh
freelog-cli node create
```

按提示填写标题、标识及域名前缀，核对账号、环境和全部信息后专门确认，默认取消。标题不超过100字符；标识为2至24位中文、字母或数字，不允许竖线；域名前缀为4至24位小写字母、数字或短横线，首尾不能为短横线。占用时请自己选择新值，CLI不会静默改名。

AI先向用户展示具体创建信息并取得确认，随后可执行：

```sh
freelog-cli node create --title "我的内容站" --name mysite --domain my-site --confirm-create mysite --json
```

`--confirm-create`必须与本次标识完全一致；普通`--yes`不能代替。成功后使用返回的nodeId继续签约展品。创建结果未知时保留操作ID，不重复创建：

```sh
freelog-cli node recover
freelog-cli node recover <操作ID>
freelog-cli node recover <操作ID> --apply --yes
```

恢复默认只读。显式apply只清理核实的已完成、未发送或明确拒绝记录，不重发创建，也不自动配置主题或展品。sending状态查不到节点时仍保留记录。

## 2. 签约成展品

人可直接运行，按提示选择节点、填写标题和标识、选择策略并确认：

```sh
freelog-cli exhibit add <资源ID>
```

AI或脚本明确给出全部选择：

```sh
freelog-cli exhibit add <资源ID> --node <节点ID> --name game-images --version 1.0.0 --sign-policy <资源ID>=<策略ID> --yes --json
```

`--name`是节点内唯一授权标识；`--title`可选，默认来源标题。单资源省略`--version`默认最新已发行版本，显式提供时使用指定的已发行版本；作者合集固定1.0.0。确认摘要会展示本次精确版本。新展品由随CLI内联的auth-cli包完成签约创建，无需另装授权命令或重新登录；提供过的name不重复询问。本期只支持来源自身策略，发现必要上抛时提示到[Console](https://console.devfreelog.com/)资源详情“签约到节点”办理；合同复用及创建权限由后端裁决。同节点已有同来源展品且未要求新策略时可返回已有；显式新策略则提示浏览器。

签约乙方是节点，不是登录用户或本地主题资源。付款及其它履约到Console所属节点的展品编辑页办理，当前CLI不新建订单或二维码，历史查询见[支付说明](../授权与支付/支付与恢复.md)。创建、成立合同、支付、上架和实际访问授权分别核验，未支付无法取得策略要求的授权。

`exhibit add` 在确认后检查目标节点是否还有未决操作。有记录时，CLI 提示相应的恢复命令和操作 ID，不发送创建请求。查询或返回已有同源展品照常。同节点的记录结清后，可以重新执行新增展品命令。

通过检查后，`exhibit add` 只发送一次创建请求。最终权限和创建条件由平台校验。平台明确拒绝节点权限时，CLI 显示原因并返回 `PLATFORM_FORBIDDEN`，请核对账号和节点权限。若这次创建结果不确定，请先查询节点展品。新增展品本身不生成 `exhibit recover` 记录。历史 `exhibit-create` 记录不参与同节点拦截。

新展品标识按授权组件规则规范化：非法字符段替换为下划线，连续下划线折叠成一个，例如game__one保存为game_one；不影响作者资源名称或已有展品。确认摘要会展示最终值，核对后再提交。

## 3. 添加消费策略并上架

收费消费策略要求**当前展品所属节点**已有结算信息，个人账号已设置不能代替节点。普通展品、主题、来源合集展品和节点自建合集都遵守这一点。尚未设置时，CLI停止新增并给出对应节点的浏览器结算设置链接；设置后重试原命令。CLI暂不提供新增/修改结算方式。免费策略不查这个资格；没有可提现余额或暂不可提现不等于未设置结算账户。

来源资源的签约策略与展品面向消费者的策略是两回事。人工在交互终端先添加消费策略，再查询启用状态：

```sh
freelog-cli exhibit policy template list <展品ID>
freelog-cli exhibit policy list <展品ID>
```

template list 在交互终端支持翻页、选择模板、填写参数、预览和确认提交。确认policy list里已有本次需要的启用策略后，继续下方授权检查；AI或脚本添加策略见本节末的独立路径。

已有策略需要启用时执行：

```sh
freelog-cli exhibit policy set <展品ID> --policy-id <策略ID> --on --yes
```

明确要停用时才执行下面的独立操作：

```sh
freelog-cli exhibit policy set <展品ID> --policy-id <策略ID> --off --yes
```

停用不是上架前的必做步骤。上架没有启用策略时，先添加或启用，再读回policy list。

### 上架前检查整体授权

上架前先查询以下结果；安装包缺少命令时，按[版本选择](../00-版本选择与AI代办.md)核对来源，不猜测授权结果：

```sh
freelog-cli exhibit authorization check <展品ID> --json
freelog-cli exhibit authorization list <展品ID> --json
```

`check`返回所属节点与资源侧整体授权结果，重点看`isAuth`。返回`false`说明查询成功但当前不能据此上架；AI不能只看退出码0就认定获得授权。平台提供时还会显示`authCode/error`等诊断。查询失败会非零退出，不用缺失结果代替true。

`list`列出合同、应用/搁置及每份合同当前授权。单份合同已授权不代表展品整体通过；也不要用登录用户个人的授权代替节点授权。缺少授权时到网页处理签约、支付或其它履约，完成后再check。CLI不会自动付款或补签。

普通上架会在确认前及确认后再次检查授权；确认期间失去授权会停止，不留下本次上架未决记录。下架仍可执行，即使当前未授权；已在线的展品也不会因一次check为false自动下架。查询不修改作者工程身份、版本稿或已有未决记录。

### 上架并读回

确认消费策略已启用、整体授权检查通过后，再执行：

```sh
freelog-cli exhibit online <展品ID> --yes
freelog-cli exhibit show <展品ID>
```

用show确认实际上下架状态。普通正式展品和主题都必须通过所属节点及资源侧授权检查。普通展品上架不改变节点主题。主题展品的`exhibit online`会进入第7节同一激活流程，还需要确认切换影响；上架均不自动支付。

### AI或脚本：明确选择消费策略

以下替代人工模板菜单。收费、期限和可授权范围等由人确定；AI先读取模板编号、完整说明、指纹及参数位：

```sh
freelog-cli exhibit policy template list <展品ID> --json
```

JSON列表只查询，不会创建策略。模板目录按展品实际类型筛选：普通单资源展品用 normal，合集展品用 collection；JSON也返回compileType。按选定模板的实际参数逐个传`--param`，无参数模板不传；模板变化后重新查询，不沿用旧指纹：

```sh
freelog-cli exhibit policy template apply <展品ID> <模板ID> --name "默认策略" --fingerprint <模板指纹> --param 1=<值> --yes --json
freelog-cli exhibit policy list <展品ID> --json
```

策略确认启用后，按上面的“上架前检查整体授权”读取check结果；通过后才执行online，再用show读回。不要把模板查询成功或check退出0直接当成可以上架。

## 4. 日常管理与异常恢复

```sh
freelog-cli exhibit list --node <节点ID> --status all
freelog-cli exhibit offline <展品ID> --yes
freelog-cli exhibit recover
freelog-cli exhibit recover <操作ID>
freelog-cli exhibit recover <操作ID> --apply --yes
```

list 支持 `--page` 和 online/offline/all 筛选。普通展品下架不撤销合同；主题展品不能用`offline`停用，应切换到另一个主题。策略或上下架请求结果未知时保存操作ID，先 recover；创建命令`exhibit add`不保存记录，见前文。恢复默认只读，只有精确确认后才可显式 apply 清记录；无法确认时保留。其他类型记录按环境与账号存在用户目录 `.freelog/operations`。同一节点有未决资料、签约、策略、状态、版本或主题操作时，受保护的主 CLI 写入会被拦截。旧 `exhibit-create` 记录例外，只读查询仍可用。准备执行 `exhibit add` 时，请先处理目标节点已有的未决操作。

遇到策略已保存但仍待核验的操作，先查询原操作ID；只有返回`confirmed:true`后才执行`recover <原操作ID> --apply --yes`。这只清理已确认记录，不再次添加策略或自动上架；仍未确认时继续保留，不能手工删记录重发。使用开发链接时先完成构建，再核对实际安装来源，见[版本选择](../00-版本选择与AI代办.md)。

这些命令不接受作者发行的 `--resource`。`--json` 不进入交互菜单；脚本须提供必要选择和 `--yes`。平台操作仍需显式环境和对应登录态。

### 编辑已创建的展品

普通展品、资源市场签入的合集展品及节点自建合集均可修改基础资料。主题按Console隐藏这组资料编辑，但可以修改其配置值和自定义信息。先查询精确展品，再只传本次要修改的字段：

```sh
freelog-cli exhibit show <展品ID> --json
freelog-cli exhibit update <展品ID> --title "展示标题" --intro "节点内的简介" --tag "图片" --tag "推荐" --yes --json
```

标题非空且最多100字符，简介最多200；`--intro ""`明确清空简介。重复`--tag`组成完整新列表，最多20项、每项20字符；只想改标题时不要附带tag。清空标签另用`--clear-tags`，不能与tag同传。封面用`--cover <本地图片路径>`替换，支持JPEG/PNG/GIF且不超过5MiB，CLI不裁剪；明确的工程外图片也可用。无修改字段会拒绝，同值不重复保存。来源资源资料和其他展品实例不受这次编辑影响。

查询来源属性、可选配置和展品自定义信息：

```sh
freelog-cli exhibit properties show <展品ID> --json
```

输出分别列出基础资料只读上下文、只读来源、可写定义、默认值、实际覆盖及有效值来源；也可用它复查标题、简介、标签和封面实际值。默认值与空串覆盖不同；可选项的key必须来自本次show，不能自行增加或改变前缀。readonlyText不能改。节点自建合集没有来源可选配置，options只能为空。

让AI将输出中的`intent`对象另存为UTF-8 JSON文件，例如`exhibit-properties.json`，保留不准备修改的行，再修改需要的值。允许UTF-8 BOM，文件最多1MiB，明确的工程外路径也可用。文件必须同时有`options`和`custom`两组：options每行为key/value，custom每行为key/name/value/remark；未知字段和漏组都会拒绝。options删除某行表示取消该项覆盖、改用来源默认，`options:[]`取消全部可写覆盖；`custom:[]`明确删除全部自定义信息。已有只读覆盖行单独展示并受保护，不加入可写意图。

```sh
freelog-cli exhibit properties set <展品ID> --file exhibit-properties.json --yes --json
freelog-cli exhibit properties show <展品ID> --json
```

文本可设空串，非空最多140字符；select只能填本次候选值，只有候选中有空串或默认值明确为空串时才接受空串。自定义信息最多30项，key字母开头且仅字母数字下划线、最多30字符；name非空最多50，remark最多50，value可空或最多140。不得与来源或其它自定义项的key/name冲突。已不属于当前来源定义的旧行在custom中展示，由完整意图显式保留或删除，CLI不自动迁移。

写入前展示预览并确认，随后重核来源版本、定义和当前资料/配置；发生变化则停止。封面已上传不等于展品资料已保存。请求结果未知时保留操作ID，按上一节`exhibit recover`先只读核验，再对已确认结果显式apply；不重发保存、不顺带签约、付款、发布资源或上架展品。

## 5. 已有展品切换展示版本

适用于单资源展品，包括主题；作者合集展品和节点自建合集不提供这两个入口。先查看当前值及来源已发行版本：

```sh
freelog-cli exhibit show <展品ID>
freelog-cli market show <来源资源ID> --json
```

人工可用`exhibit version set <展品ID>`选择版本。AI或脚本应指定精确已发版本：

```sh
freelog-cli exhibit version set <展品ID> --version 1.2.3 --yes --json
freelog-cli exhibit show <展品ID>
```

这只切换展品的展示版本，不发行新资源版本、不自动重签或修改来源配置，也不改变自动更新开关。选择具体版本不表示永久固定：若自动更新开启，平台以后仍可能更新。若来源已下架，market show可能不可用，但已有展品的换版入口不会增加来源必须上架的条件，仍校验真实版本目录及节点归属。

自动更新是单独的操作。需要关闭自动更新时执行：

```sh
freelog-cli exhibit version auto <展品ID> --off --yes --json
```

需要开启自动更新时，单独执行：

```sh
freelog-cli exhibit version auto <展品ID> --on --yes --json
```

如果要固定在某个版本，先运行上面的`auto --off`并确认成功，再运行`version set`。自动更新开启时仍允许手动换版，但本次选择不表示永久固定；结果中的`warnings`会明确提醒后续仍可能升级。

换版和开关成功都返回读回的实际展示版本，并追加独立授权观察：`authorization.status=checked`时查看`authorization.result.isAuth`，false表示设置已完成但当前展品未通过整体授权；`status=unknown`表示设置已核验、随后授权查询未确认，按照message单独运行`exhibit authorization check <展品ID>`，不要重发换版或开关请求。两次查询不是原子快照，不能保证此后版本或授权不再变化。

开启是否立即升级、何时跟进新版本由平台决定。CLI不在换版时清空或转换旧配置，查看实际配置用`exhibit properties show <展品ID> --json`；来源新依赖可能影响整体授权，签约仍按本期网页边界办理。版本请求本身结果未知时才先用`exhibit recover`核验，不重复发送；恢复只清确认完成的记录，不重发换版，也不自动补做授权查询。

## 6. 完善节点设置

本节及后面的主题管理、来源补签按当前安装包支持范围操作；缺少命令时先按[版本选择](../00-版本选择与AI代办.md)确认来源。

先确认精确节点ID和已有资料，再只传想改的字段：

```sh
freelog-cli node show <节点ID> --json
freelog-cli node update <节点ID> --title "我的内容站" --intro "本站介绍" --yes --json
freelog-cli node update <节点ID> --logo "./logo.png" --cover "./banner.jpg" --yes --json
```

标题trim后非空且最多100字符；简介trim后最多1000字符，`--intro ""`明确清空。未传字段保持原值；update不修改标识、域名或访问状态，无修改参数会报错。同值且没有图片时返回`changed:false`，不重复保存。show同时返回展品筛选标签、暂停公告及accessMode：public公开、private仅本人、paused暂停；缺失信息保持未知，不伪装为空配置。

Logo和横幅的新上传均支持本地JPG、PNG，各不超过5MiB；已有线上GIF图片仍可读取。路径可为相对路径或明确的本地绝对路径，不接收网络图片URL。CLI校验真实格式但不裁剪、不强制正方形，先在本地准备合适尺寸。图片先上传，随后才保存节点资料；若提示`nodeUpdateSent=false`，说明资料请求尚未发送，已上传素材不会自动删除或重试。

### 6.1 展品筛选标签

这些标签供访客在节点内筛选展品，和资源标签、展品自身标签是不同设置。先从show读取完整数组，再只运行本次需要的一种操作。

完整替换：

```sh
freelog-cli node update <节点ID> --filter-tag "视频" --filter-tag "文章" --yes --json
```

清空筛选项：

```sh
freelog-cli node update <节点ID> --clear-filter-tags --yes --json
```

两者互斥；最多20项，每项非空且最多20字符，精确重复会拒绝。参数是最终保存值，不自动trim、去#、排序或改大小写；保留旧项时复制其原值，普通新标签传不带展示前缀#的值。省略这两种参数就保留标签；不是给每个展品批量加标签，也没有推荐标签选择。

### 6.2 访问状态与暂停公告

每次明确选择一个目标：public公开访问、private仅本人访问，或paused暂停运营。例如：

```sh
freelog-cli node access set <节点ID> --mode private --yes --json
```

需要暂停时：

```sh
freelog-cli node access set <节点ID> --mode paused --message "维护中，请稍后访问" --yes --json
```

需要重新公开时，明确使用`--mode public`；CLI不猜之前是公开还是私密。公告输入最多100字符，保存前trim；`--message ""`清空，省略保留原值。暂停和删除独立，设置暂停不删除节点，不替你下架展品或解除合同；它会影响访客访问，应先确认选对节点。

当前设置页支持标题、简介、Logo、横幅、筛选标签、访问状态、暂停公告七个字段，CLI都提供相应入口。域名和标识只读；运行时版本、自定义域名和跳转不是当前节点设置的可写项。

设置结果未知时，不再次运行update/access，改用`node recover <操作ID>`核验；`--apply --yes`只收尾已证明结果，不重新上传或保存。`node recover`同时列出节点创建、资料、访问和删除记录，展品记录仍由`exhibit recover`处理。

## 7. 激活或切换节点主题

主题先按第2、3节签约为本人节点的展品并设置消费策略，再选择当前主题：

```sh
freelog-cli node theme list --node <节点ID> --json
freelog-cli node theme current --node <节点ID> --json
freelog-cli node theme use <主题展品ID> --yes --json
freelog-cli node theme current --node <节点ID> --json
```

列表包含上下架主题，每页50条。人使用交互终端可选前后页；AI用`--page 2 --json`读取下一页。`current`以节点的真实主题ID为准，某个主题显示online并不等于它就是当前主题。

激活前CLI核对主题归属、启用消费策略及该节点对来源的授权；个人有授权不能代替节点授权，需要支付的合同仍须完成履约。缺少策略或授权时按错误提示补齐，再执行激活；CLI不会默选策略、自动签约或付款。确认会展示当前和目标主题及影响，取消不切换。

`exhibit online <主题展品ID>`与上述use走同一流程；`exhibit offline`对主题会拒绝。切换只激活目标，不主动下架旧主题或清除配置；结果会读回节点指向、目标状态并报告原主题实际观察，后台如何处理原主题不能从“切换成功”推断。

主题切换结果未知时先`exhibit recover <操作ID>`，确认后再显式`--apply --yes`收尾，不重新激活，也不能通过切换同节点另一个主题绕过未决保护。

## 8. 已有展品的资源授权

以下管理“来源资源授权给节点”的合同，展品给访客使用的消费策略仍用`exhibit policy`。先查询已有展品的实际来源、固定版本和合同：

```powershell
freelog-cli exhibit authorization list <展品ID> --json
```

签约、应用、当前有授权是三个结果。`status:0`合同生效但可能仍待付款，`currentlyAuthorized:false`不能当合同已终止。合同属于整个节点，可能供本节点其它展品使用；个人合同不能代替它。

需要新签当前来源或必要上抛的策略时，请进入Console所属节点的展品编辑页办理。下面的sign入口本期只复用精确的已有节点合同；没有匹配合同时提示浏览器，不创建新合同或更换版本：

```powershell
freelog-cli exhibit authorization sign <展品ID> --resource-id <来源资源ID> --policy <策略ID> --scope node --yes
```

浏览器办理后，用authorization list核对真实节点合同，再按需要应用。sign找到同来源、同策略恰有一份未终止合同会返回`reused:true`；`--apply`可继续显式应用该已有合同，不会创建新合同。复用成功也不代表已取得授权；整体结果另用authorization check。已有展品再次add并传sign-policy仍会提示去浏览器，不忽略策略或重复创建。来源可以是单资源或作者合集，不能把这一步混为作者工程的直接依赖或展品访客策略。

需要应用已有合同时执行：

```powershell
freelog-cli exhibit authorization apply <展品ID> --contract <合同ID> --yes
```

需要搁置已有合同时执行，这是另一项独立操作：

```powershell
freelog-cli exhibit authorization shelve <展品ID> --contract <合同ID> --yes
```

应用会解除所选合同和对应策略的排除，因此可能连带释放同一来源、同策略的其它合同；预览会列受影响ID。搁置只追加所选合同排除，不取消合同、不退款、不改其它展品。应用仍不等于当前有访问授权。

已有真实合同即使应用失败也保留，后续只处理应用，不重新签约。旧签约或当前应用结果未知时先`exhibit recover <操作ID>`；显式`--apply --yes`只收尾已证明结果，不重发。未决阻止同节点其它写入，不换工程或主题绕过。

## 9. 删除节点

删除不可恢复，原节点及其展品的访问/管理会受影响；CLI不会自动解除相关合同、退款或抹除对方历史。只有用户已明确决定删除这个具体节点时，AI才可进入真正删除步骤，不能为腾名额自行删除。

先查精确节点和删除预览，这两条只读：

```sh
freelog-cli node show <节点ID> --json
freelog-cli node delete <节点ID> --dry-run --json
```

预览返回当前条件、受影响展品数量和`canDelete`。暂停、余额、归属或未决条件不满足时不能继续。金融账户查询成功且明确为空时，允许继续删除检查；已有账户则须核实节点总余额、可用余额和冻结余额都为零。账户读取失败或缺字段不能放行。后端仍会最终校验并可能拒绝删除；资金需先在网页处理完，CLI不自动提现、结算或付款。

如果用户确认删除而节点还未暂停，单独设置暂停并读回；delete不会替你执行这一步：

```sh
freelog-cli node access set <节点ID> --mode paused --yes --json
freelog-cli node show <节点ID> --json
```

最后从show复制**nodeName节点标识**，再次核对环境、数字ID和域名后提交。它不是nodeTitle标题，也不是域名：

```sh
freelog-cli node delete <节点ID> --confirm-delete "<完整节点标识>" --yes --json
```

交互终端可省略`--confirm-delete`，CLI会要求输入完整标识并作默认取消的最终确认。AI/脚本或JSON调用须同时明确匹配的专用参数和`--yes`。`--dry-run`不能与专用确认参数混用。正式请求前会重新读取，旧预览不会绕过余额或状态变化。

只有精确读回本人节点的已删除事实才报告删除确认，不能因请求已发或列表暂缺就断定成功。结果未知时保存操作ID并只运行：

```sh
freelog-cli node recover <操作ID> --json
```

已证明结果后，可用同命令加`--apply --yes`收尾；它不再次DELETE。prepared的`not-sent`表示未发出，清记录不等于已删除；未确认不要重发或换目录绕过。没有未决且确实读到本人已删除节点时，重复delete只报告已删除，不再发送请求。

删除后用`node list`核当前列表数量。CLI按服务器列表和创建接口判断名额，不在本地手动加回，不承诺立即可重建或重用域名，也不会为验证名额自动创建新节点。
