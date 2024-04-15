# 资源共享

当多个插件拥有相同的 js 或 css 资源，可以指定这些资源在多个插件之间共享，在插件加载时直接从缓存中提取数据，从而提高渲染效率和性能。

**使用方式**

#### global 属性

在 link、script 设置`global`属性会将文件提取为公共文件，共享给其它应用。

设置`global`属性后文件第一次加载会放入公共缓存，其它插件加载相同的资源时直接从缓存中读取内容，从而提升渲染速度。

**使用方式**

```html
<link rel="stylesheet" href="xx.css" global />
<script src="xx.js" global></script>
```
