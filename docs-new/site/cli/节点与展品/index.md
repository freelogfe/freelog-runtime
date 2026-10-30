# 把市场资源签约到节点

::: info CLI 同步文档
本页自动同步自 CLI 仓库使用手册。先核对已安装版本与本页适用范围；Node.js 22.14+ 是 CLI 自身要求，不是运行时对子应用的要求。来源、发布状态及已知限制见[版本说明](/about)。
:::


本教程适用于 **0.6.0+**，旧 npm 0.5.9 不包含这些节点与展品命令。0.6.0 正式包可用后通过 npm 安装；发布准备阶段使用维护者提供的固定候选包，具体见[版本选择](../00-版本选择与AI代办.md)。节点和展品管理与作者发行资源、作者合集分开；不用 init、bind 或 N.json。已有节点可直接使用；没有节点时按下文创建。

当前 CLI 不提供节点主题激活/切换，以及展品标签、简介、自定义信息编辑入口，需要时到 Console 操作。下文的展示版本切换不等于切换节点主题。

## 1. 登录、找资源和节点

```sh
freelog-cli login --env dev
freelog-cli market search "图片" --env dev
freelog-cli market show <资源ID> --env dev
freelog-cli node list --env dev
```

搜索包含已上架单资源和作者合集，可加 `--subject resource` 或 `--subject collection`。每页50条，交互终端可翻页；AI用 `--page 2 --json` 明确读取下一页。show 用精确ID或完整 username/name，查看版本和启用的签约策略。标题可重复，不能当精确标识。

### 需要新节点时

每人最多3个节点，先查看已有节点，确有需要再创建。创建会占用名额，不承诺删除会返还名额。

```sh
freelog-cli node create --env dev
```

按提示填写标题、标识及域名前缀，核对账号、环境和全部信息后专门确认，默认取消。标题不超过100字符；标识遵循平台2至24字符规则；域名前缀为4至24位小写字母、数字或短横线，首尾不能为短横线。占用时请自己选择新值，CLI不会静默改名。

AI先向用户展示具体创建信息并取得确认，随后可执行：

```sh
freelog-cli node create --title "我的内容站" --name mysite --domain my-site --confirm-create mysite --json --env dev
```

`--confirm-create`必须与本次标识完全一致；普通`--yes`不能代替。成功后使用返回的nodeId继续签约展品。创建结果未知时保留操作ID，不重复创建：

```sh
freelog-cli node recover --env dev
freelog-cli node recover <操作ID> --env dev
freelog-cli node recover <操作ID> --apply --yes --env dev
```

恢复默认只读。显式apply只清理核实的已完成、未发送或明确拒绝记录，不重发创建，也不自动配置主题或展品。sending状态查不到节点时仍保留记录。

## 2. 签约成展品

人可直接运行，按提示选择节点、版本、标识和策略：

```sh
freelog-cli exhibit add <资源ID> --env dev
```

AI或脚本明确给出全部选择：

```sh
freelog-cli exhibit add <资源ID> --node <节点ID> --name game-images --version 1.0.0 --sign-policy <资源ID>=<策略ID> --yes --json --env dev
```

`--name` 是节点内的唯一授权标识；`--title` 可选，默认来源标题。单资源须选已发行的精确版本；作者合集按平台约定使用1.0.0。必要上抛资源也需要节点合同，重复提供 `--sign-policy 上抛资源ID=策略ID`。已有生效合同会复用；同节点已有同来源展品则返回现有展品，不重复创建。

签约乙方是节点，不是登录用户，也不是本地主题资源。当前CLI暂不支持支付；策略要求支付后才能获得授权时，未完成支付就无法取得相应授权。待支付合同、展品创建或上架成功都不能代替授权判断；到对应网页以正确主体履约后再验证，后端仍可因授权条件拒绝后续操作。支付接入是后续能力，不表示 0.6.0 已经支持。

## 3. 添加消费策略并上架

来源资源的签约策略与展品面向消费者的策略是两回事。先给展品添加消费策略，再上架：

```sh
freelog-cli exhibit policy template list <展品ID> --env dev
freelog-cli exhibit policy list <展品ID> --env dev
freelog-cli exhibit online <展品ID> --yes --env dev
freelog-cli exhibit show <展品ID> --env dev
```

template list 在交互终端支持翻页、选择模板、填写参数、预览和确认提交。AI先用 `--json` 读取模板编号、指纹及参数位，再提交：

```sh
freelog-cli exhibit policy template apply <展品ID> <模板ID> --name "默认策略" --fingerprint <模板指纹> --param 1=<值> --yes --json --env dev
```

模板目录按展品实际类型筛选：普通单资源展品用 normal，合集展品用 collection；JSON也返回compileType。按模板实际参数逐个传 `--param`，无参数模板不传；模板变化后重新查询，不沿用旧指纹。需要启用/停用已有消费策略：

```sh
freelog-cli exhibit policy set <展品ID> --policy-id <策略ID> --on --yes --env dev
freelog-cli exhibit policy set <展品ID> --policy-id <策略ID> --off --yes --env dev
```

上架没有启用策略时，交互入口会引导添加或启用；脚本先完成策略操作。上架不会自动支付，也不会设为节点主题。

## 4. 日常管理与异常恢复

```sh
freelog-cli exhibit list --node <节点ID> --status all --env dev
freelog-cli exhibit offline <展品ID> --yes --env dev
freelog-cli exhibit recover --env dev
freelog-cli exhibit recover <操作ID> --env dev
freelog-cli exhibit recover <操作ID> --apply --yes --env dev
```

list 支持 `--page` 和 online/offline/all 筛选。下架不撤销合同。创建、策略或上下架请求结果未知时，保存操作ID，先 recover；不要重发。恢复默认只读，只有精确确认后才可显式 apply 清记录；无法确认时保留。记录按环境与账号存在用户目录 `.freelog/operations`，换工作目录仍能恢复，不修改作者工程稿。同一节点仍有未决创建、签约、策略、状态或版本操作时，也会阻止为该节点新增其它展品；先通过recover核验收尾。只读查询仍可用，其它节点按各自未决状态检查。

这些命令不接受作者发行的 `--resource`。`--json` 不进入交互菜单；脚本须提供必要选择和 `--yes`。平台操作仍需显式环境和对应登录态。

## 5. 已有展品切换展示版本

适用于单资源展品，包括主题；作者合集展品和节点自建合集不提供这两个入口。需要 0.6.0+ 或对应固定候选包。先查看当前值及来源已发行版本：

```sh
freelog-cli exhibit show <展品ID> --env dev
freelog-cli market show <来源资源ID> --env dev --json
```

人工可用`exhibit version set <展品ID> --env dev`选择版本。AI或脚本应指定精确已发版本：

```sh
freelog-cli exhibit version set <展品ID> --version 1.2.3 --yes --json --env dev
freelog-cli exhibit show <展品ID> --env dev
```

这只切换展品的展示版本，不发行新资源版本、不自动重签或修改来源配置，也不改变自动更新开关。选择具体版本不表示永久固定：若自动更新开启，平台以后仍可能更新。若来源已下架，market show可能不可用，但已有展品的换版入口不会增加来源必须上架的条件，仍校验真实版本目录及节点归属。

自动更新是单独的操作。按需要选择下面**一条**执行，不要连续执行两个相反动作：

```sh
freelog-cli exhibit version auto <展品ID> --off --yes --json --env dev
freelog-cli exhibit version auto <展品ID> --on --yes --json --env dev
```

开关成功会返回读回的实际展示版本；开启是否立即升级、何时跟进新版本由平台决定，当前不承诺具体时机。换版后的旧配置迁移与新依赖授权也需要另外验收，不因接口成功就视为全部正确。结果未知时先用`exhibit recover`核验，不重复发送；恢复只清确认完成的记录，不重发换版。
