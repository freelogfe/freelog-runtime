# 合集相关 API 文档


## getCollectionSubList

**用途**：获取指定合集展品的单品分页列表。

### 参数说明

| 参数               | 类型     | 说明                                       |
|--------------------|----------|--------------------------------------------|
| `exhibitId`        | `string` | 合集展品的唯一标识                         |
| `options`          | `object` | 配置对象                                   |
| `options.sortType` | `number` | 排序方式：`1` 升序，`-1` 降序             |
| `options.skip`     | `number` | 跳过的记录数，分页使用                     |
| `options.limit`    | `number` | 每页返回的记录数                           |
| `options.isShowDetailInfo` | `number` | 是否加载单品详情：`0` 不加载，`1` 加载    |

### 使用方式

```javascript
const res = await freelogApp.getCollectionSubList(exhibitId, {
  sortType: 1,
  skip: 0,
  limit: 10,
  isShowDetailInfo: 0,
});
```

### 返回字段说明

| 字段                         | 类型       | 说明                                       |
|------------------------------|------------|--------------------------------------------|
| `itemId`                     | `string`   | 单品 ID                                    |
| `itemTitle`                  | `string`   | 单品标题                                   |
| `sortId`                     | `number`   | 单品排序 ID                                |
| `createDate`                 | `date`     | 单品创建日期                               |
| `articleInfo`                | `object`   | 单品挂载的作品信息                         |
| `articleInfo.articleId`      | `string`   | 作品 ID                                    |
| `articleInfo.articleName`    | `string`   | 作品名称                                   |
| `articleInfo.articleType`    | `number`   | 作品类型（例如：`1` 独立资源）             |
| `articleInfo.resourceType`   | `string[]` | 作品资源类型                               |
| `articleInfo.articleOwnerId` | `number`   | 作品所有者 ID，仅当 `isShowDetailInfo=1` 时返回 |
| `articleInfo.intro`          | `string`   | 简介，仅当 `isShowDetailInfo=1` 时返回      |

### 示例返回数据

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "itemId": "ef3f2f52",
      "itemTitle": "示例单品",
      "sortId": 1,
      "createDate": "2024-07-02T08:41:03.307Z",
      "articleInfo": {
        "articleId": "660a672e68659b002ec586a6",
        "articleName": "示例作品",
        "resourceType": ["图片", "照片"],
        "articleType": 1,
        "articleOwnerId": 50028,
        "intro": "作品简介",
        "coverImages": [
          "https://image.freelog.com/sample.jpg"
        ]
      }
    }
  ]
}
```


## getCollectionsSubList

**用途**：获取多个合集展品的单品分页列表。

### 参数说明

| 参数                  | 类型     | 说明                                       |
|-----------------------|----------|--------------------------------------------|
| `exhibitIds`          | `string` | 多个合集展品的 ID，用逗号分隔               |
| `options`             | `object` | 配置对象                                   |
| `options.sortType`    | `number` | 排序方式：`1` 升序，`-1` 降序             |
| `options.skip`        | `number` | 跳过的记录数，分页使用                     |
| `options.limit`       | `number` | 每页返回的记录数                           |
| `options.isShowDetailInfo` | `number` | 是否加载单品详情：`0` 不加载，`1` 加载    |

### 使用方式

```javascript
const res = await freelogApp.getCollectionsSubList(exhibitIds, {
  sortType: 1,
  skip: 0,
  limit: 10,
  isShowDetailInfo: 0,
});
```

### 返回字段说明

| 字段                     | 类型       | 说明                                       |
|--------------------------|------------|--------------------------------------------|
| `exhibitId`              | `string`   | 合集展品 ID                                |
| `totalItem`              | `number`   | 合集展品内单品总数量                       |
| `itemList`               | `object[]` | 单品分页列表                               |
| `itemList.itemId`        | `string`   | 单品 ID                                    |
| `itemList.itemTitle`     | `string`   | 单品标题                                   |
| `itemList.sortId`        | `number`   | 单品排序 ID                                |
| `itemList.createDate`    | `date`     | 单品创建日期                               |
| `itemList.articleInfo`   | `object`   | 单品挂载的作品信息                         |
| `itemList.articleInfo.articleId` | `string` | 作品 ID                                    |
| `itemList.articleInfo.articleName` | `string` | 作品名称                                   |


## getCollectionSubInfo


**用途**：获取指定合集展品内某单品的详细信息。

### 参数说明

| 参数       | 类型     | 说明                   |
|------------|----------|------------------------|
| `exhibitId` | `string` | 合集展品的唯一标识     |
| `itemId`    | `string` | 单品 ID                |

### 使用方式

```javascript
const res = await freelogApp.getCollectionSubInfo(exhibitId, { itemId });
```

### 返回字段说明

| 字段              | 类型       | 说明                                       |
|-------------------|------------|--------------------------------------------|
| `itemId`          | `string`   | 单品 ID                                    |
| `itemTitle`       | `string`   | 单品标题                                   |
| `sortId`          | `number`   | 单品排序号                                 |
| `createDate`      | `date`     | 单品创建日期                               |
| `articleInfo`     | `object`   | 单品挂载的作品信息                         |
| `dependencyTree`  | `object[]` | 单品依赖树                                 |

### 示例返回数据

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": {
    "itemId": "54e4620d",
    "itemTitle": "示例单品",
    "sortId": 1,
    "createDate": "2024-07-09T09:43:51.014Z",
    "articleInfo": {
      "articleId": "65eec05ff8a2fd002ff05bc0",
      "articleName": "示例作品",
      "resourceType": ["主题"],
      "articleType": 1,
      "intro": "",
      "coverImages": []
    },
    "dependencyTree": [
      {
        "nid": "47c8958b5abc",
        "articleId": "65eec05ff8a2fd002ff05bc0",
        "articleName": "示例作品",
        "articleType": 1,
        "version": "1.0.0",
        "resourceType": ["主题"]
      }
    ]
  }
}
```


## getCollectionSubAuth

**用途**：获取指定合集展品内多个单品的授权结果。

### 参数说明

| 参数       | 类型     | 说明                       |
|------------|----------|----------------------------|
| `exhibitId` | `string` | 合集展品的唯一标识         |
| `itemIds`   | `string` | 单品 ID 列表，用逗号分隔   |

### 使用方式

```javascript
const res = await freelogApp.getCollectionSubAuth(exhibitId, { itemIds });
```

### 返回字段说明

| 字段                  | 类型      | 说明                                   |
|-----------------------|-----------|----------------------------------------|
| `itemId`              | `string`  | 单品 ID                                |
| `referee`             | `number`  | 授权结果标的物服务类型（例如：`1` 资源服务） |
| `isAuth`              | `boolean` | 是否授权通过                           |
| `authCode`            | `number`  | 授权码                                 |
| `errorMsg`            | `string`  | 错误信息，仅当授权失败时返回           |

### 示例返回数据

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "itemId": "b50de01d",
      "referee": 2,
      "isAuth": false,
      "authCode": 303,
      "errorMsg": "标的物未签约"
    }
  ]
}
```


## getCollectionSubFileStream

**用途**：获取指定合集展品内单品的文件或子文件。

### 参数说明

| 参数          | 类型      | 说明                                         |
|---------------|-----------|----------------------------------------------|
| `exhibitId`   | `string`  | 合集展品的唯一标识                           |
| `itemId`      | `string`  | 单品 ID                                      |
| `subFilePath` | `string`  | 单品内部文件路径（可选）                     |
| `returnUrl`   | `boolean` | 是否只返回文件 URL（默认 `false`）           |

### 使用方式

```javascript
const res = await freelogApp.getCollectionSubFileStream(exhibitId, {
  itemId,
  subFilePath: "path/to/file",
  returnUrl: true
});
```


## getCollectionSubDepList


**用途**：获取指定合集展品内单品的依赖列表。

### 参数说明

| 参数       | 类型     | 说明                   |
|------------|----------|------------------------|
| `exhibitId` | `string` | 合集展品的唯一标识     |
| `itemId`    | `string` | 单品 ID                |

### 使用方式

```javascript
const res = await freelogApp.getCollectionSubDepList(exhibitId, { itemId });
```

### 返回字段说明

| 字段            | 类型       | 说明                           |
|-----------------|------------|--------------------------------|
| `nid`           | `string`   | 依赖 ID                        |
| `articleId`     | `string`   | 作品 ID                        |
| `articleName`   | `string`   | 作品名称                       |
| `articleType`   | `number`   | 作品类型（例如：`1` 独立资源）  |
| `resourceType`  | `string[]` | 作品资源类型                   |
| `deep`          | `number`   | 依赖在树中的层级               |
| `parentNid`     | `string`   | 父级依赖 ID                    |

### 示例返回数据

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "nid": "47c8958b5abc",
      "articleId": "65eec05ff8a2fd002ff05bc0",
      "articleName": "示例作品",
      "articleType": 1,
      "resourceType": ["主题"],
      "deep": 1,
      "parentNid": ""
    }
  ]
}
```


## getCollectionSubDepFileStream


**用途**：获取指定合集展品内单品的依赖文件或子文件。

### 参数说明

| 参数          | 类型      | 说明                                         |
|---------------|-----------|----------------------------------------------|
| `exhibitId`   | `string`  | 合集展品的唯一标识                           |
| `itemId`      | `string`  | 单品 ID                                      |
| `nid`         | `string`  | 依赖的链路 ID                                |
| `subFilePath` | `string`  | 依赖内部文件路径（可选）                     |
| `returnUrl`   | `boolean` | 是否只返回文件 URL（默认 `false`）           |

### 使用方式

```javascript
const res = await freelogApp.getCollectionSubDepFileStream(exhibitId, {
  itemId,
  nid,
  subFilePath: "path/to/file",
  returnUrl: true
});
```

