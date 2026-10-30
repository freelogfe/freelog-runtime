# 兼容性与版本

开发前分别确认运行时、SDK、资源版本和 Node.js。它们使用不同版本体系，不能相互推算。

| 名称 | 示例 | 决定什么 |
| --- | --- | --- |
| 节点运行时目标 | `0.5` | 主题、插件使用的运行时能力和接入约定 |
| npm 包 `freelog-runtime` | `5.x` | 应用安装的 SDK 导出与类型；不表示运行时第 5 代 |
| 资源版本 | `1.2.0` | 作者在平台发行的内容版本及依赖范围 |
| CLI 版本 | `freelog-cli --cli-version` 的输出 | 命令及本地工作稿能力 |
| Node.js | CLI 最低 `22.14.0` | 本地工具执行环境；不等于浏览器运行时目标 |

主题和插件工程的 Node.js 要求以自身构建工具为准。CLI 的最低要求不自动成为所有子应用的最低要求；运行时仓库自身的构建环境也应单独管理。

## 发行时确认系统附加字段

面向本指南的运行时 0.5、Vite 工程，应在发行版本时核对：

| 系统附加字段 key | 值 |
| --- | --- |
| `noderuntime_target_version` | `0.5` |
| `bundleTool` | `vite` |

这两项属于平台定义的系统附加字段。不要通过自定义属性或可选配置创建同名字段，也不要把资源版本号填入运行时目标版本。

CLI 会根据文件解析和当前资源类型展示系统附加项。通过现有 `version attr` 查看、编辑入口核对，具体命令见 [CLI 使用文档](/cli/)及命令 `--help`。字段未出现或不可编辑时，先检查资源类型、文件分析结果和平台字段定义，不要猜一个提交字段绕过校验。

已有合法工作稿、且字段列表确认这两项可编辑后，Vite / 运行时0.5工程可执行：

```sh
freelog-cli version attr list --resource id:<资源ID> --env dev
freelog-cli version attr set "键=noderuntime_target_version 值=0.5" --resource id:<资源ID> --yes --env dev
freelog-cli version attr set "键=bundleTool 值=vite" --resource id:<资源ID> --yes --env dev
freelog-cli version show --local --resource id:<资源ID> --env dev --json
```

核验：工作稿的系统附加输入 `inputAttrs` 有对应 key/value；正常发行后再读取线上版本，字段体现在 `systemPropertyDescriptors` 的对应项中。两端读写 DTO 不同，不要求线上返回 `inputAttrs`。未知键或只读字段必须停止并检查分析结果，不能用自定义属性补造。

`bundleTool` 应与实际产物一致；非 Vite 工程不能照抄 `vite`。开发替换沿用真实展品上下文，应核对线上主题/插件的打包方式与本地工程是否匹配。

## SDK 名称以当前导出为准

当前读取自身依赖使用 `getSelfDep()`，主题可使用 `getSelfDepForTheme()`。旧材料中的 `getSelfDependencyTree()` 不作为当前示例。

安装或升级后检查锁文件中实际 SDK 版本，并用当前 [API 参考](/runtime/api/widget)核对调用与返回值。不要根据 npm 主版本猜测节点已部署的运行时版本，也不要把已有工作稿中的依赖范围当成节点当前已解析的版本。

## 浏览器与本地服务

节点页面和本地服务均使用 HTTPS，开发服务允许必要的跨域读取。浏览器的证书、混合内容或本地网络访问限制，应通过证书信任和用户授权处理，不把关闭安全开关列为通用接入步骤。

沙箱、路由和静态资源问题见[问题排查](/runtime/troubleshooting)；应用的最终兼容性须在实际节点和目标浏览器验收。
