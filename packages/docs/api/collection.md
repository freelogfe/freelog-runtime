# 集合类型展品内作品相关

## getCollectionSubList

**用途：获取集合类型展品的子作品分页列表**

```ts
**参数说明**
  exhibitId: string, // 集合展品id
  {
    sortType: 1, // 排序方式: 1:升序 -1:降序
    skip: 0,
    limit: 10,
    isShowDetailInfo: 0, // 是否加载单品挂载的作品详情 0:不加载 1:加载
  }

**用法**
const res = await freelogApp.getCollectionSubList(exhibitId, {
  sortType: 1,
  skip: 0,
  limit: 10,
  isShowDetailInfo: 0,
});
```

### 返回说明：

| 返回值字段                   | 字段类型  | 字段说明                                                   |
| :--------------------------- | :-------- | :--------------------------------------------------------- |
| itemId                       | string    | 单品 ID                                                    |
| itemTitle                    | string    | 单品标题                                                   |
| sortId                       | number    | 单品的排序 ID                                              |
| createDate                   | date      | 创建日期                                                   |
| articleInfo                  | object    | 单品挂载的作品信息                                         |
| \*\*articleId                | string    | 作品 ID                                                    |
| \*\*articleName              | string    | 作品名称                                                   |
| \*\*articleType              | int       | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象) |
| \*\*resourceType             | string[]  | 作品资源类型                                               |
| \*\*articleOwnerId           | int       | 作品所有者 ID，isShowDetailInfo=1 时返回此字段             |
| \*\*articleOwnerName         | string    | 作品所有者名称，isShowDetailInfo=1 时返回此字段            |
| \*\*intro                    | string    | 简介，isShowDetailInfo=1 时返回此字段                      |
| \*\*coverImages              | string[]  | 作品封面，isShowDetailInfo=1 时返回此字段                  |
| \*\*latestVersionReleaseDate | string    | 作品最近一次版本发布时间，isShowDetailInfo=1 时返回此字段  |
| \*\*articleProperty          | objectint | 单品属性，isShowDetailInfo=1 时返回此字段                  |

### 示例

```json
{
  "ret": 0,
  "errCode": 0,
  "errcode": 0,
  "msg": "success",
  "data": [
    {
      "itemId": "ef3f2f52",
      "itemTitle": "f1a976d2dcbdbfa8fb0e224bda5a4b3",
      "sortId": 11,
      "createDate": "2024-07-02T08:41:03.307Z",
      "articleInfo": {
        "articleId": "660a672e68659b002ec586a6",
        "resourceType": ["图片", "照片"],
        "articleType": 1,
        "articleOwnerId": 50028,
        "articleOwnerName": "12345676789",
        "intro": "一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十",
        "coverImages": [
          "https://image.freelog.com/c0b52bf6-9407-4327-b2ea-6bb5e10f3f31.jpg"
        ],
        "latestVersionReleaseDate": "2024-04-01T07:50:06.070Z"
      }
    },
    {
      "itemId": "e7ba8b92",
      "itemTitle": "0503f3f559b68d37384f75a8e6cbad6",
      "sortId": 10,
      "createDate": "2024-07-02T08:40:38.206Z",
      "articleInfo": {
        "articleId": "660a672d68659b002ec5867e",
        "resourceType": ["图片", "照片"],
        "articleType": 1,
        "articleOwnerId": 50028,
        "articleOwnerName": "12345676789",
        "intro": "",
        "coverImages": [
          "https://image.freelog.com/8d5c9f0a-ea79-43af-80d0-daf474a6f6eb.png"
        ],
        "latestVersionReleaseDate": "2024-04-01T07:50:05.744Z"
      }
    },
    {
      "itemId": "a7757d37",
      "itemTitle": "精选003",
      "sortId": 9,
      "createDate": "2024-07-02T08:40:38.206Z",
      "articleInfo": {
        "articleId": "660a593b68659b002ec5793c",
        "resourceType": ["阅读", "文章"],
        "articleType": 1,
        "articleOwnerId": 50028,
        "articleOwnerName": "12345676789",
        "intro": "",
        "coverImages": [],
        "latestVersionReleaseDate": "2024-04-01T06:50:43.785Z"
      }
    },
    {
      "itemId": "7694c7dd",
      "itemTitle": "精选001",
      "sortId": 8,
      "createDate": "2024-07-02T08:40:38.205Z",
      "articleInfo": {
        "articleId": "660a574e68659b002ec57898",
        "resourceType": ["插件"],
        "articleType": 1,
        "articleOwnerId": 50028,
        "articleOwnerName": "12345676789",
        "intro": "",
        "coverImages": [
          "https://image.freelog.com/aac09976-2794-44a2-ba9f-3f14d7e5f391.gif"
        ],
        "latestVersionReleaseDate": "2024-04-01T06:42:27.781Z"
      }
    },
    {
      "itemId": "8cd5f7d8",
      "itemTitle": "245天然气eat丰乳肥臀",
      "sortId": 7,
      "createDate": "2024-06-28T03:36:22.798Z",
      "articleInfo": {
        "articleId": "666012e66c7248002e931cee",
        "resourceType": ["阅读", "文章"],
        "articleType": 1,
        "articleOwnerId": 50028,
        "articleOwnerName": "12345676789",
        "intro": "",
        "coverImages": [],
        "latestVersionReleaseDate": "2024-06-05T07:25:32.842Z"
      }
    },
    {
      "itemId": "07d51a40",
      "itemTitle": "4问题给我色弱豆腐干地方",
      "sortId": 6,
      "createDate": "2024-06-28T03:36:22.798Z",
      "articleInfo": {
        "articleId": "659b9e334d1119002edf9f53",
        "resourceType": ["主题"],
        "articleType": 1,
        "articleOwnerId": 50028,
        "articleOwnerName": "12345676789",
        "intro": "",
        "coverImages": [],
        "latestVersionReleaseDate": "2024-05-16T06:49:47.617Z"
      }
    },
    {
      "itemId": "26884c31",
      "itemTitle": "A1",
      "sortId": 5,
      "createDate": "2024-07-01T03:24:28.211Z",
      "articleInfo": {
        "articleId": "6661820f6c7248002e936356",
        "resourceType": ["图片", "照片"],
        "articleType": 1,
        "articleOwnerId": 50028,
        "articleOwnerName": "12345676789",
        "intro": "",
        "coverImages": [
          "https://image.freelog.com/preview-image/0016609aeb24f064a1b41f396969adbddb5c294a.gif?x-oss-process=style/cover_image"
        ],
        "latestVersionReleaseDate": "2024-06-06T09:32:11.573Z"
      }
    },
    {
      "itemId": "7642efd0",
      "itemTitle": "A2",
      "sortId": 4,
      "createDate": "2024-06-28T03:42:41.085Z",
      "articleInfo": {
        "articleId": "666182386c7248002e9363a1",
        "resourceType": ["图片", "照片"],
        "articleType": 1,
        "articleOwnerId": 50028,
        "articleOwnerName": "12345676789",
        "intro": "",
        "coverImages": [
          "https://image.freelog.com/83f3c014-22ae-4139-81c2-59eca744cacf.gif"
        ],
        "latestVersionReleaseDate": "2024-06-06T09:49:18.456Z"
      }
    },
    {
      "itemId": "1505f2aa",
      "itemTitle": "fdgsdfgfds",
      "sortId": 3,
      "createDate": "2024-07-01T03:24:28.210Z",
      "articleInfo": {
        "articleId": "662b578d57a86e00394e20c1",
        "resourceType": ["主题"],
        "articleType": 1,
        "articleOwnerId": 50028,
        "articleOwnerName": "12345676789",
        "intro": "",
        "coverImages": [],
        "latestVersionReleaseDate": "2024-04-26T07:28:18.375Z"
      }
    },
    {
      "itemId": "ae5ae244",
      "itemTitle": "付费策略",
      "sortId": 2,
      "createDate": "2024-07-01T03:24:28.211Z",
      "articleInfo": {
        "articleId": "663dc4476f9d62002e9cb968",
        "resourceType": ["阅读", "文章"],
        "articleType": 1,
        "articleOwnerId": 50028,
        "articleOwnerName": "12345676789",
        "intro": "",
        "coverImages": [],
        "latestVersionReleaseDate": "2024-05-10T06:53:05.095Z"
      }
    }
  ]
}
```

## getCollectionSubInfo

**用途：获取集合类型展品的子作品详情**

```ts
**参数说明**
  exhibitId: string, // 集合展品id
  {
    itemId:  string, // 子作品id
  }

**用法**
const res = await freelogApp.getCollectionSubInfo(exhibitId, {
    itemId: "a2b0784da2b0784d",
 });
```

### 返回说明：

| 返回值字段                    | 字段类型 | 字段说明                                                                |
| :---------------------------- | :------- | :---------------------------------------------------------------------- |
| itemId                        | string   | 单品 ID                                                                 |
| itemTitle                     | string   | 单品标题                                                                |
| sortId                        | int      | 单品排序号                                                              |
| createDate                    | date     | 单品创建日期                                                            |
| articleInfo                   | object   | 展品实际挂载的作品信息                                                  |
| \*\* articleId                | string   | 作品 ID                                                                 |
| \*\* articleName              | string   | 作品名称                                                                |
| \*\* resourceType             | string[] | 作品资源类型                                                            |
| \*\* articleType              | int      | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象)              |
| \*\* articleOwnerId           | int      | 作品所有者 ID                                                           |
| \*\* articleOwnerNamenid      | string   | 作品所有者名称依赖 ID(指的是此依赖在依赖树上的 id,用来确定依赖的唯一性) |
| \*\* intro                    | string   | 作品简介                                                                |
| \*\* coverImages              | string[] | 作品封面                                                                |
| \*\* latestVersionReleaseDate | string   | 作品最新版本发布日期                                                    |
| \*\*articleProperty           | object   | 单品属性                                                                |
| dependencyTree                | object[] | 单品依赖树                                                              |
| \*\*nid                       | string   | 依赖 ID(指的是此依赖在依赖树上的 id,用来确定依赖的唯一性)               |
| \*\*articleId                 | string   | 作品 ID,配合作品类型一起理解. 例如类型是资源,此处就是资源 ID            |
| \*\*articleName               | string   | 作品名称                                                                |
| \*\*articleType               | int      | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象)              |
| \*\*resourceType              | stirng[] | 作品资源类型                                                            |
| \*\*deep                      | int      | 该依赖在依赖树中的层级                                                  |
| \*\*parentNid                 | string   | 父级依赖 ID                                                             |

### 返回示例

```json
{
  "ret": 0,
  "errCode": 0,
  "errcode": 0,
  "msg": "success",
  "data": {
    "itemId": "54e4620d",
    "itemTitle": "34突然发动但是",
    "sortId": 1,
    "createDate": "2024-07-09T09:43:51.014Z",
    "updateDate": "2024-07-09T09:45:03.699Z",
    "articleInfo": {
      "articleId": "65eec05ff8a2fd002ff05bc0",
      "articleName": "12345676789/34突然发动但是",
      "resourceType": ["主题"],
      "articleType": 1,
      "articleOwnerId": 50028,
      "articleOwnerName": "12345676789",
      "intro": "",
      "coverImages": [],
      "latestVersionReleaseDate": "2024-03-11T08:28:10.182Z"
    },
    "dependencyTree": [
      {
        "nid": "47c8958b5abc",
        "articleId": "65eec05ff8a2fd002ff05bc0",
        "articleName": "12345676789/34突然发动但是",
        "articleType": 1,
        "version": "1.0.0",
        "versionRange": "1.0.0",
        "resourceType": ["主题"],
        "versionId": "7024c61846822552b927ecc0c3cb5d8f",
        "deep": 1,
        "parentNid": "",
        "fileSha1": "968363d1f66721d3a95adb13b664d2950c6c8bca"
      }
    ]
  }
}
```

## getCollectionSubAuth

**用途：获取集合类型展品的子作品详情**

```ts
**参数说明**
  exhibitId: string, // 集合展品id
  {
    itemIds:  string, // 子作品id,多个用“,”隔开
  }

**用法**
const res = await freelogApp.getCollectionSubAuth(exhibitId, {
    itemIds: "a2b0784da2b0784d,a2b0784da2b0784d", // 子作品id, 多个用英文逗号分隔
 });
```

### 返回说明：

| 返回值字段            | 字段类型 | 字段说明                                                              |
| :-------------------- | :------- | :-------------------------------------------------------------------- |
| itemId                | string   | 单品 ID                                                               |
| referee               | int      | 做出授权结果的标的物服务类型(1:资源服务 2:展品服务)                   |
| defaulterIdentityType | int      | 授权不通过责任方(0:无 1:资源 2:节点 4:c 端消费者 8:资源上游 128:未知) |
| authCode              | int      | 授权码                                                                |
| isAuth                | boolean  | 是否授权通过                                                          |
| errorMsg              | string   | 错误信息                                                              |

### 返回示例

```json
{
  "ret": 0,
  "errCode": 0,
  "errcode": 0,
  "msg": "success",
  "data": [
    {
      "itemId": "b50de01d",
      "referee": 2,
      "defaulterIdentityType": 4,
      "authCode": 303,
      "isAuth": false,
      "errorMsg": "标的物未签约"
    },
    {
      "itemId": "a2b0784d",
      "referee": 2,
      "defaulterIdentityType": 4,
      "authCode": 303,
      "isAuth": false,
      "errorMsg": "标的物未签约"
    }
  ]
}
```

## getCollectionSubFileStream

**用途：获取集合类型展品的子作品文件或子文件**

```ts
**参数说明**
  exhibitId: string, // 集合展品id
  {
    itemId:  string, // 子作品id
    returnUrl?: boolean // 可选，默认false，是否只返回url， 例如img标签图片只需要url
    subFilePath?: string; // 作品内部子文件路径
  }

**用法**
const res = await freelogApp.getCollectionSubFileStream(exhibitId, {
    itemIds: "a2b0784da2b0784d,a2b0784da2b0784d", // 子作品id, 多个用英文逗号分隔
 });
```

## getCollectionSubDepList

**用途：获取集合类型展品的子作品的依赖列表**

```ts
**参数说明**
  exhibitId: string, // 集合展品id
  {
    itemId:  string, // 子作品id
  }

**用法**
const res = await freelogApp.getCollectionSubDepList(exhibitId, {
  itemId
});
```

### 返回说明：

| 返回值字段   | 字段类型 | 字段说明                                                     |
| :----------- | :------- | :----------------------------------------------------------- |
| nid          | string   | 依赖 ID(指的是此依赖在依赖树上的 id,用来确定依赖的唯一性)    |
| articleId    | string   | 作品 ID,配合作品类型一起理解. 例如类型是资源,此处就是资源 ID |
| articleName  | string   | 作品名称                                                     |
| articleType  | int      | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象)   |
| resourceType | stirng[] | 作品资源类型                                                 |
| deep         | int      | 该依赖在依赖树中的层级                                       |
| parentNid    | string   | 父级依赖 ID                                                  |

### 返回示例

```json
{
  "ret": 0,
  "errCode": 0,
  "errcode": 0,
  "msg": "success",
  "data": [
    {
      "nid": "47c8958b5abc",
      "articleId": "65eec05ff8a2fd002ff05bc0",
      "articleName": "12345676789/34突然发动但是",
      "articleType": 1,
      "version": "1.0.0",
      "versionRange": "1.0.0",
      "resourceType": ["主题"],
      "versionId": "7024c61846822552b927ecc0c3cb5d8f",
      "deep": 1,
      "parentNid": "",
      "fileSha1": "968363d1f66721d3a95adb13b664d2950c6c8bca"
    }
  ]
}
```

## getCollectionSubDepInsideFile

**用途：获取集合类型展品的子作品的依赖的子文件**

```ts
**参数说明**
  exhibitId: string, // 集合展品id
  {
    itemId:  string, // 子作品id
    nid:  string, // 依赖的链路id
    subFilePath:  string, // 子作品的依赖内部的文件路径
    returnUrl?: boolean // 可选，默认false，是否只返回url， 例如img标签图片只需要url
  }

**用法**
const res = await freelogApp.getCollectionSubDepInsideFile(exhibitId,, {
  itemId,
  nid,
  subFilePath
  returnUrl: false
});
```