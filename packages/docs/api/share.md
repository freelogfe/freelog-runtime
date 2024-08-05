﻿---
outline: deep
---

# 特殊功能：通用分享链接

## getShareUrl

**用途：获取某个展品的通用分享链接**

```ts
**参数说明**
  exhibitId：string, // 展品ID
  type: string  // 自定义分享类型，例如detail,content。规则：只允许包括下划线的任何单词字符  正则：[A-Za-z0-9_]

**用法**
freelogApp.getShareUrl(exhibitId, "detail")
```

## mapShareUrl

**用途：映射分享链接到自身正确的路由，运行时会转换分享链接到返回的对应路由**

**注意：只有在路由加载之前使用才有效**

```ts
**参数说明**
  {
    // key为多个包括下划线的任何单词字符  正则：[A-Za-z0-9_]
    key?: (exhibitId:string)=> url: string
  }

**用法**
  freelogApp.mapShareUrl({
    detail: (exhibitId)=>{
      return `/mydetailroute/${exhibitId}`
    }
    content: (exhibitId)=>{
      return `/mycontentroute/${exhibitId}`
    }
  })
```