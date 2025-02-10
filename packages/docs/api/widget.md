# 插件相关 API 文档

## getStaticPath

**用途**：获取指定静态资源（如图片、字体等）的正确路径。

### 参数说明


| 参数   | 类型     | 说明               |
| ------ | -------- | ------------------ |
| `path` | `string` | 以`/` 开头的路径。 |

### 使用示例

```ts
const path = freelogApp.getStaticPath("/assets/image.png");
console.log(path);
```

## nodeInfo

**用途**：获取当前节点的信息，包括节点名称、标签、图标等。

### 使用示例

```ts
const nodeInfo = freelogApp.nodeInfo;
console.log(nodeInfo);
```

### 返回字段说明


| 字段                   | 类型     | 说明     |
| ---------------------- | -------- | -------- |
| `nodeName`             | `string` | 节点名称 |
| `tags`                 | `array`  | 标签数组 |
| `nodeLogo`             | `string` | 节点图标 |
| `nodeTitle`            | `string` | 节点标题 |
| `nodeShortDescription` | `string` | 节点简介 |

### 返回示例

```json
{
  "nodeName": "示例节点",
  "tags": ["开发", "测试"],
  "nodeLogo": "https://cdn.freelog.com/logo.png",
  "nodeTitle": "示例节点标题",
  "nodeShortDescription": "这是一个节点简介。"
}
```

## getCurrentUrl

**用途**：获取当前节点的完整 URL。

### 使用示例

```ts
const url = freelogApp.getCurrentUrl();
console.log(url);
```

## getSelfWidgetRenderName

**用途**：获取插件自身的渲染名称，通常用于单独调试插件时使用（如 dev 模式）。

### 使用示例

```ts
const renderName = freelogApp.getSelfWidgetRenderName();
console.log(renderName);
```

## getTopExhibitId

**用途**：获取当前插件的自身或顶层展品 ID（依赖树最上层的展品 ID）。

### 使用场景

- **场景 1**：当前插件是展品插件，获取自身展品 ID。
- **场景 2**：当前插件是展品依赖树中的资源插件，获取最上层的展品 ID。

### 使用示例

```ts
const topExhibitId = freelogApp.getTopExhibitId();
console.log(topExhibitId);

// 获取自身展品信息
const res = await freelogApp.getExhibitInfo(topExhibitId);
console.log(res);
```

## getSelfNid

**用途**：获取当前插件在依赖树中的自身链路 ID。

### 使用示例

```ts
const articleNid = freelogApp.getSelfNid();
const exhibitId = await freelogApp.getTopExhibitId();

const res = await freelogApp.getExhibitDepInfo(exhibitId, { articleNids: articleNid });
console.log(res);
```

## getSelfDependencyTree

**用途**：获取插件自身的依赖树。

### 使用示例

```ts
// 获取本地传递的 dependencyTree
const dependencyTree = await freelogApp.getSelfDependencyTree();
console.log(dependencyTree);

// 强制通过网络获取最新的 dependencyTree
const updatedTree = await freelogApp.getSelfDependencyTree(true);
console.log(updatedTree);
```

### 返回字段说明


| 字段           | 类型       | 说明                      |
| -------------- | ---------- | ------------------------- |
| `nid`          | `string`   | 依赖 ID                   |
| `articleId`    | `string`   | 作品 ID                   |
| `articleName`  | `string`   | 作品名称                  |
| `articleType`  | `number`   | 作品类型（1：独立资源等） |
| `version`      | `string`   | 版本号                    |
| `resourceType` | `string[]` | 资源类型                  |
| `deep`         | `number`   | 依赖的层级                |
| `parentNid`    | `string`   | 父级依赖 ID               |

## getSelfProperty

**用途**：获取插件自身的属性。

### 使用示例

```ts
// 获取传递的属性
const property = await freelogApp.getSelfProperty();
console.log(property);

// 强制从平台获取最新的属性
const updatedProperty = await freelogApp.getSelfProperty(true);
console.log(updatedProperty);
```

## mountExhibitWidget 和 mountArticleWidget

**用途**：加载展品插件或作品插件。

### 参数说明


| 参数                  | 类型          | 说明                     |
| --------------------- | ------------- | ------------------------ |
| `exhibitId`           | `string`      | 展品 ID                  |
| `articleId`           | `string`      | 作品 ID                  |
| `container`           | `HTMLElement` | 挂载容器                 |
| `property`            | `object`      | 展品或作品的属性         |
| `dependencyTree`      | `object[]`    | 依赖树                   |
| `renderWidgetOptions` | `object`      | 渲染选项（如数据传递等） |

### 使用示例

```ts
const widgetController = await freelogApp.mountExhibitWidget({
  exhibitId: "exampleId",
  container: document.getElementById("app"),
  renderWidgetOptions: {
    data: { message: "Hello World" },
  },
});

console.log(widgetController);
```

## reload

**用途**：重载整个网页（仅限主题可用）。

### 使用示例

```ts
freelogApp.reload();
```

## setViewport

**用途**：设置 `viewport` 的 meta 信息（仅主题可用）。

### 使用示例

```ts
freelogApp.setViewport({
  width: "device-width",
  "initial-scale": 1,
  "maximum-scale": 1,
  "user-scalable": "no",
});
```

# 总结

通过以上 API，开发者可以高效地管理 Freelog 插件，包括获取静态资源、节点信息、自身依赖以及插件挂载等功能，满足不同场景的开发需求。
