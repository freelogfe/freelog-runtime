---
outline: "deep"
---

::: info 进阶参考的适用范围
本页从已有文档迁移，保留框架或库的具体示例。先阅读[运行时接入](/runtime/quickstart)及[兼容边界](/runtime/compatibility)。框架示例有各自版本前提，不构成平台统一 Node.js 限制；不能直接组合不同框架或不同年代的配置。
:::

# 0.4 到 0.5 迁移指南

<!-- > 环境要求: vite6.x 版本要求 node18.x 版本以上

本示例使用 vite+vue3 作说明 -->

## api 简单变化，名称或参数或返回值变更

| 0.5                           | 0.4                      | 变更说明                                                                               |
| ----------------------------- | ------------------------ | -------------------------------------------------------------------------------------- |
| `getExhibitListByPage`        | `getExhibitListByPaging` | 参数无变化                                                                             |
| `getExhibitById`              | `getExhibitInfo`         | 增加`authInfo`参数，可返回授权信息                                                     |
| `getCollectionSubListByPage`  | `getCollectionSubList`   | 参数无变化                                                                             |
| `getCollectionsSubListByPage` | `getCollectionsSubList`  | 参数无变化                                                                             |
| `getCollectionSubById`        | `getCollectionSubInfo`   | 增加`options.authInfo`参数，可返回授权信息                                             |
| `getCollectionSubAuthStatus`  | `getCollectionSubAuth`   | 参数无变化                                                                             |
| `setUserData`                 | `setUserData`            | 返回值有变化，请查阅参考 api 介绍                                                      |
| `getUserData`                 | `getUserData`            | 返回值有变化，请查阅参考 api 介绍                                                      |
| `getSelfDep`       | 旧项目需核对实际 SDK 导出 | 当前源码公开实时接口为 getSelfDep，主题缓存接口为 getSelfDepForTheme；旧文档曾写 getSelfDependencyTree，不能据此调用当前SDK |
| `getSelfProperty`             | `getSelfProperty`        | 参数变成无参数，直接从服务端获取主题或插件的属性，主题可以使用 getSelfPropertyForTheme |

## api 新增

| 0.5                              | 0.4                      | 用途                                                       |
| -------------------------------- | ----------------------- | ---------------------------------------------------------- |
| `getExhibitListAuthByPage`       |                         | 分页获取展品列表的授权信息，可选展品信息                   |
| `getExhibiListAuthById`          |                         | 通过展品 ID 批量获取展品详情包含授权信息                   |
| `getCollectionSubListAuthByPage` |                         | 获取指定合集展品的单品分页列表的授权信息，可选单品信息     |
| `getCollectionSubListAuthById`   |                         | 获取指定合集展品内多个单品的详细信息、包含授权信息         |
| `getCollectionSubListById`       |                         | 获取指定合集展品内多个单品的详细信息                       |
| `getSelfDepForTheme`             | `getSelfDep` | 对应之前的 api，增加主题独有的，无须 await，运行时直接提供 |
| `getSelfPropertyForTheme`        | `getSelfProperty`       | 对应之前的 api，增加主题独有的，无须 await，运行时直接提供 |
