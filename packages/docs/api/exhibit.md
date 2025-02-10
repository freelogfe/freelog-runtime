# 展品相关 API 文档


## getExhibitListByPaging

**用途**：分页获取展品列表。

### 请求参数

| 参数名                 | 类型    | 必填 | 说明                                                                 |
|------------------------|---------|------|----------------------------------------------------------------------|
| skip                  | number  | 否   | 跳过的数量，默认为 0。                                              |
| limit                 | number  | 否   | 本次请求获取的数据条数，建议不超过 100。                             |
| sort                  | string  | 否   | 排序方式，1:正序，-1:倒序，默认为 1。           |
| articleResourceTypes  | string  | 否   | 指定作品资源类型，多值用逗号分隔。                                   |
| onlineStatus          | number  | 否   | 上线状态，0:下线，1:上线，2:全部，默认为 1。                        |
| tags                  | string  | 否   | 用户自定义标签，多个用逗号分隔。                                    |
| keywords              | string  | 否   | 模糊搜索关键字，支持展品名称或资源名称。                            |

### 返回字段

| 字段名                 | 类型      | 说明                                      |
|------------------------|-----------|-------------------------------------------|
| exhibitId             | string    | 展品的唯一标识符。                        |
| exhibitName           | string    | 展品名称。                                |
| version               | string    | 展品版本号。                              |
| tags                  | string[]  | 展品标签。                                |
| coverImages           | string[]  | 展品封面图 URL 列表。                     |
| onlineStatus          | number    | 上线状态：0 下线，1 上线。                |
| policies              | object[]  | 展品相关的授权策略信息。                  |
| articleInfo           | object    | 展品挂载的作品信息（ID、类型等）。         |

### 示例代码

```typescript
const res = await freelogApp.getExhibitListByPaging({
  skip: 0,
  limit: 20,
  sort: "createDate:-1"
});
console.log(res);
```


## getExhibitRecommend

**用途**：根据展品 ID 获取推荐展品。

### 请求参数

| 参数名         | 类型    | 必填 | 说明                                   |
|----------------|---------|------|----------------------------------------|
| exhibitId     | string  | 是   | 展品的唯一标识符。                     |
| recommendNorm | string  | 否   | 推荐标准，例如：`resourceType,latestCreate`。 |
| size          | number  | 否   | 返回的推荐展品数量，默认为 10，最大 100。  |

### 返回字段

| 字段名                 | 类型      | 说明                                      |
|------------------------|-----------|-------------------------------------------|
| exhibitId             | string    | 展品的唯一标识符。                        |
| exhibitName           | string    | 展品名称。                                |
| version               | string    | 展品版本号。                              |
| tags                  | string[]  | 展品标签。                                |
| coverImages           | string[]  | 展品封面图 URL 列表。                     |

### 示例代码

```typescript
const res = await freelogApp.getExhibitRecommend("12345", {
  recommendNorm: "resourceType,latestCreate",
  size: 20
});
console.log(res);
```


## getExhibitListById

**用途**：通过展品 ID 批量获取展品详情。

### 请求参数

| 参数名                  | 类型    | 必填 | 说明                                   |
|-------------------------|---------|------|----------------------------------------|
| exhibitIds             | string  | 是   | 展品 ID 列表，用逗号分隔。             |
| isLoadVersionProperty  | number  | 否   | 是否加载版本信息，0 或 1，默认 0。      |

### 返回字段

| 字段名                 | 类型      | 说明                                      |
|------------------------|-----------|-------------------------------------------|
| exhibitId             | string    | 展品的唯一标识符。                        |
| exhibitName           | string    | 展品名称。                                |
| version               | string    | 展品版本号。                              |
| tags                  | string[]  | 展品标签。                                |
| coverImages           | string[]  | 展品封面图 URL 列表。                     |

### 示例代码

```typescript
const res = await freelogApp.getExhibitListById({
  exhibitIds: "12345,67890",
  isLoadVersionProperty: 1
});
console.log(res);
```


## getExhibitInfo

**用途**：获取单个展品的详细信息。

### 请求参数

| 参数名                  | 类型    | 必填 | 说明                                   |
|-------------------------|---------|------|----------------------------------------|
| exhibitId              | string  | 是   | 展品的唯一标识符。                     |
| isLoadVersionProperty  | number  | 否   | 是否加载版本信息，0 或 1，默认 0。      |

### 返回字段

| 字段名                 | 类型      | 说明                                      |
|------------------------|-----------|-------------------------------------------|
| exhibitId             | string    | 展品的唯一标识符。                        |
| exhibitName           | string    | 展品名称。                                |
| version               | string    | 展品版本号。                              |
| tags                  | string[]  | 展品标签。                                |
| coverImages           | string[]  | 展品封面图 URL 列表。                     |

### 示例代码

```typescript
const res = await freelogApp.getExhibitInfo("12345", {
  isLoadVersionProperty: 1
});
console.log(res);
```


## getExhibitFileStream

**用途**：获取展品的文件流。

### 请求参数

| 参数名          | 类型    | 必填 | 说明                                                             |
|-----------------|---------|------|------------------------------------------------------------------|
| exhibitId      | string  | 是   | 展品的唯一标识符。                                               |
| returnUrl      | boolean | 否   | 是否仅返回文件 URL，默认为 `false`。                              |
| subFilePath    | string  | 否   | 指定子文件路径（例如漫画的图片路径）。                            |
| config         | object  | 否   | 请求配置，包括 `onUploadProgress`, `onDownloadProgress`, `timeout` 等。 |

### 示例代码

```typescript
const res = await freelogApp.getExhibitFileStream("12345", {
  returnUrl: true,
  subFilePath: "chapter1/page1.png"
});
console.log(res);
```


## getExhibitDepInfo

**用途**：查询展品的依赖作品信息。

### 请求参数

| 参数名        | 类型    | 必填 | 说明                                               |
|---------------|---------|------|--------------------------------------------------|
| exhibitId    | string  | 是   | 展品的唯一标识符。                                 |
| articleNids  | string  | 是   | 展品依赖的作品节点 ID（多个用逗号分隔）。          |

### 返回字段

| 字段名          | 类型      | 说明                                 |
|-----------------|-----------|--------------------------------------|
| nid            | string    | 作品依赖树中的节点 ID。              |
| articleId      | string    | 作品的唯一标识符。                   |
| articleName    | string    | 作品名称。                           |
| version        | string    | 作品版本。                           |
| resourceType   | string    | 作品的资源类型。                     |
| articleProperty| object    | 作品属性信息（如文件大小、类型等）。  |

### 示例代码

```typescript
const res = await freelogApp.getExhibitDepInfo("12345", {
  articleNids: "nid1,nid2"
});
console.log(res);
```


## getExhibitDepFileStream

**用途**：获取展品依赖作品的文件流。

### 请求参数

| 参数名        | 类型    | 必填 | 说明                                                             |
|---------------|---------|------|------------------------------------------------------------------|
| exhibitId    | string  | 是   | 展品的唯一标识符。                                               |
| nid          | string  | 是   | 展品依赖的链路 ID。                                              |
| subFilePath  | string  | 否   | 指定子文件路径。                                                 |
| returnUrl    | boolean | 否   | 是否仅返回文件 URL，默认为 `false`。                              |
| config       | object  | 否   | 请求配置，包括 `onUploadProgress`, `onDownloadProgress`, `timeout` 等。 |

### 示例代码

```typescript
const res = await freelogApp.getExhibitDepFileStream("12345", {
  nid: "nid1",
  subFilePath: "chapter1/page1.png"
});
console.log(res);
```


## getExhibitSignCount

**用途**：查询展品的签约数量。

### 请求参数

| 参数名       | 类型    | 必填 | 说明                      |
|--------------|---------|------|---------------------------|
| exhibitIds  | string  | 是   | 展品 ID 列表，用逗号分隔。 |

### 返回字段

| 字段名      | 类型      | 说明                           |
|-------------|-----------|--------------------------------|
| subjectId  | string    | 展品的唯一标识符。             |
| count      | number    | 签约总数（去重后）。           |

### 示例代码

```typescript
const res = await freelogApp.getExhibitSignCount("12345,67890");
console.log(res);
```


## getExhibitAuthStatus

**用途**：批量查询展品的授权状态。

### 请求参数

| 参数名       | 类型    | 必填 | 说明                      |
|--------------|---------|------|---------------------------|
| exhibitIds  | string  | 是   | 展品 ID 列表，用逗号分隔。 |

### 返回字段

| 字段名                | 类型      | 说明                                  |
|-----------------------|-----------|---------------------------------------|
| exhibitId            | string    | 展品的唯一标识符。                    |
| isAuth               | boolean   | 是否通过授权。                        |
| authCode             | number    | 授权码（例如 200 表示授权成功）。     |
| errorMsg             | string    | 错误信息（如果有）。                  |

### 示例代码

```typescript
const res = await freelogApp.getExhibitAuthStatus("12345,67890");
console.log(res);
```


## getExhibitAvailable

**用途**：批量查询展品是否可用（即是否能签约）。

### 请求参数

| 参数名       | 类型    | 必填 | 说明                      |
|--------------|---------|------|---------------------------|
| exhibitIds  | string  | 是   | 展品 ID 列表，用逗号分隔。 |

### 返回字段

| 字段名                | 类型      | 说明                                  |
|-----------------------|-----------|---------------------------------------|
| exhibitId            | string    | 展品的唯一标识符。                    |
| isAuth               | boolean   | 是否通过授权。                        |
| authCode             | number    | 授权码（例如 200 表示授权成功）。     |
| errorMsg             | string    | 错误信息（如果有）。                  |

### 示例代码

```typescript
const res = await freelogApp.getExhibitAvailable("12345,67890");
console.log(res);
```


## getSignStatistics

**用途**：统计展品的签约数据。

### 请求参数

| 参数名       | 类型    | 必填 | 说明                      |
|--------------|---------|------|---------------------------|
| keywords    | string  | 否   | 展品名称关键字，用于模糊搜索。 |

### 返回字段

| 字段名          | 类型      | 说明                                |
|-----------------|-----------|-------------------------------------|
| subjectId      | string    | 展品的唯一标识符。                  |
| subjectName    | string    | 展品名称。                          |
| policyIds      | string[]  | 签约策略的 ID 列表。                |
| latestSignDate | date      | 最近一次签约的日期。                |
| count          | number    | 签约次数。                          |

### 示例代码

```typescript
const res = await freelogApp.getSignStatistics({
  keywords: "test"
});
console.log(res);
```

