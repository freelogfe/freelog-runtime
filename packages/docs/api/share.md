

# 特殊功能相关 API 文档

## getShareUrl

**用途：获取某个展品的通用分享链接，需要与 mapShareUrl 配合使用**

### 参数说明

```ts
{
  exhibitId: string; // 展品 ID
  itemId?: string; // 合集单品 ID，非单品可省略
  query?: {         // 自定义参数，会拼接到 URL 后面，如：?key=value
    [key: string]: any;
  };
}
type: string; // 自定义分享类型，例如 detail、content
             // 规则：只允许包括下划线的单词字符，正则：[A-Za-z0-9_]
```

### 用法示例

```ts
freelogApp.getShareUrl(
  {
    exhibitId: "64a26ea41cbfe2002f9cb6e9",
    itemId: "64a26ea41cbfe2002f9cb4c5",
    query: {
      name: "value",
    },
  },
  "detail"
);
```


## mapShareUrl

**用途：映射分享链接到自身正确的路由，运行时会将分享链接转换为返回的对应路由。**

**注意：请在路由加载之前使用，运行时获得映射返回值后会刷新页面。**

### 参数说明

```ts
{
  // key 为多个包括下划线的单词字符，正则：[A-Za-z0-9_]
  key?: (
    exhibitId: string,
    itemId: string,
    query: {
      [key: string]: any;
    }
  ) => string; // 返回路由 URL
}
```

### 用法示例

```ts
await freelogApp.mapShareUrl({
  detail: (exhibitId, itemId, query) => {
    let params = "";
    Object.keys(query).forEach((key) => {
      params += (params ? "&" : "") + `${key}=${query[key]}`;
    });
    return `/mydetailroute/${exhibitId}/${itemId}?${params}`;
  },
  content: (exhibitId) => {
    return `/mycontentroute/${exhibitId}`;
  },
});
```
