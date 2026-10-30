# 前端库开发

前端库是供主题、插件加载的代码资源，不是独立的主题或插件挂载实例。库声明为资源依赖后，通过运行时库加载接口使用。

| 任务 | 文档 |
|---|---|
| 理解库、命名空间和格式 | [库概念](./intro.md) |
| 构建产物和 meta.json | [构建约定](./guide.md) |
| 最小例子 | [Hello World](./helloworld.md) |
| 框架库开发 | [React](./library-react.md) / [Vue](./library-vue.md) |
| 使用线上库 | [加载接口](./library-usage.md) |
| 在框架中使用库 | [React 使用](./use-library-react.md) / [Vue 使用](./use-library-vue.md) |
| 本地开发 | [HTTPS 本地库](./local-dev.md) |
| 生成描述文件 | [meta.json 脚本](./meta-gen.md) |

库模板中的外置依赖、UMD 命名空间和入口文件必须匹配真实产物。`meta.json` 用于描述文件结构，不承载资源的标题、授权身份或发行版本号。真实依赖关系和版本范围由[CLI 版本工作稿](/cli/06-版本工作稿)维护。
