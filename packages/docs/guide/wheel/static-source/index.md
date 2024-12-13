# 资源共享与过滤

在微前端架构中，通过共享和过滤资源可以有效提升插件加载性能和渲染效率。以下为详细说明：

## 资源共享

当多个插件拥有相同的 JS 或 CSS 资源时，可以通过配置共享机制，将这些资源在多个插件之间复用。在插件加载时直接从缓存中提取共享资源，从而提高渲染效率。

### 配置 `global` 属性

在 `link` 或 `script` 标签上设置 `global` 属性，可将指定文件提取为公共文件，共享给其他插件。

- **作用**：首次加载时将资源存入公共缓存，其他插件加载时直接使用缓存内容。

#### 使用方式

```html
<link rel="stylesheet" href="xx.css" global />
<script src="xx.js" global></script>
```

## 资源过滤

在某些场景下，可以通过过滤机制避免特定资源被加载或处理。

### 配置 `exclude` 属性

在 `link`、`script` 或 `style` 等元素上设置 `exclude` 属性，可以将这些资源标记为过滤对象。当 `micro-app` 遇到带有 `exclude` 属性的元素时，会直接删除。

#### 使用方式

```html
<link rel="stylesheet" href="xx.css" exclude>
<script src="xx.js" exclude></script>
<style exclude></style>
```

通过上述方法，可以灵活配置资源的共享与过滤策略，从而优化应用性能并避免冗余加载。

