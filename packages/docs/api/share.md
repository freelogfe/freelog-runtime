# 特殊功能相关 API 文档

## getShareUrl

**用途：获取某个展品的通用分享链接，需要与 `mapShareUrl` 配合使用**

> **注：在项目中，应遵循先 `mapShareUrl`映射，后 `getShareUrl`获取的原则；**

### 参数说明

| 字段名  | 类型      | 必填 | 说明                                                                                                                              |
| ------- | --------- | ---- | --------------------------------------------------------------------------------------------------------------------------------- |
| options | `Options` | 是   | 展品对象信息                                                                                                                      |
| key     | `string`  | 是   | 自定义的用于映射的 key 值（同`mapShareUrl`），例如 detail、content;<br />**规则：只允许包括下划线的单词字符，正则：[A-Za-z0-9_]** |

```ts
type Options = {
  exhibitId: string; // 展品 ID
  itemId?: string; // 合集单品 ID，非单品可省略
  query?: {
    // 自定义参数，会拼接到 URL 后面，如：?key=value
    [key: string]: any;
  };
};
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

> **注意：请在路由加载之前使用，运行时获得映射返回值后会刷新页面。**

### 参数说明

```ts
{
  // key: 自定义的用于映射的key值（同getShareUrl的第二个参数key）;
  // 规则: 为多个包括下划线的单词字符，正则：[A-Za-z0-9_]
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

## isWeChatOrQQ

**用途：判断是否处于微信QQ环境中，返回布尔值**

## getWechatShareURL

**用途：获取微信QQ分享链接，用于生产二维码让用户微信QQ扫码访问。**

## updateWechatShare

**用途：更新当前页面的微信QQ分享信息。**

> **注意：在进入需要分享的页面后，根据 isWeChatOrQQ 判断微信环境，调用 updateWechatShare 方法更新微信分享信息。**

### 参数说明

| 参数                          | 类型       | 说明                          |
| ----------------------------- | ---------- | ----------------------------- |
| `appMessageShareData`         | `object`   | 用于分享给微信 QQ 好友        |
| `appMessageShareData.title`   | `string`   | 分享标题                      |
| `appMessageShareData.desc`    | `string`   | 分享描述                      |
| `appMessageShareData.imgUrl`  | `string`   | 分享图标                      |
| `appMessageShareData.success` | `Function` | 成功回调                      |
| `timelineShareData`           | `object`   | 用于分享给微信朋友圈、QQ 空间 |
| `timelineShareData.title`     | `string`   | 分享标题                      |
| `timelineShareData.imgUrl`    | `string`   | 分享图标                      |
| `timelineShareData.success`   | `Function` | 成功回调                      |

### 用法示例

```ts
freelogApp
  .updateWechatShare(
    {
      title: freelogApp.nodeInfo.nodeName + "分享标题", // 分享标题
      desc: "分享描述", // 分享描述
      imgUrl: data.coverImages[0], // 分享图标
      success: () => {
        console.log("分享成功");
      },
    },
    {
      title: freelogApp.nodeInfo.nodeName + "分享标题", // 分享标题
      imgUrl: data.coverImages[0], // 分享图标
      success: () => {
        console.log("分享成功");
      },
    }
  )
  .then(() => {
    console.log("调用分享接口成功");
  })
  .catch(() => {
    console.log("调用分享接口失败");
  });
```
