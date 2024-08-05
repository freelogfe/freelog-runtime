

# 展品获取

## getExhibitListByPaging

**用途：分页获取展品**

```ts
**参数说明**
  参见“query 可选参数”

**用法**
const res = await freelogApp.getExhibitListByPaging({
  skip: 0,
  limit: 20,
});
```

**query 可选参数**

| 参数                    | 必选 | 类型及范围    | 说明                                                         |
| :---------------------- | :--- | :------------ | :----------------------------------------------------------- |
| skip                    | 可选 | number        | 跳过的数量.默认为 0.                                         |
| limit                   | 可选 | number        | 本次请求获取的数据条数.一般不允许超过 100                    |
| sort                    | 可选 | string        | 排序,格式为{排序字段}:{1\|-1},1 是正序,-1 是倒序             |
| articleResourceTypes    | 可选 | string        | 作品资源类型,多个用逗号分隔                                  |
| omitArticleResourceType | 可选 | string        | 忽略的作品资源类型,与 resourceType 参数互斥                  |
| onlineStatus            | 可选 | number        | 上线状态 (0:下线 1:上线 2:全部) 默认 1                       |
| tags                    | 可选 | string        | 用户创建 presentable 时设置的自定义标签,多个用","分割        |
| tagQueryType            | 可选 | number        | tags 的查询方式 1:任意匹配一个标签 2:全部匹配所有标签 默认:1 |
| projection              | 可选 | string        | 指定返回的字段,多个用逗号分隔                                |
| keywords                | 可选 | string[1,100] | 搜索关键字,目前支持模糊搜索节点资源名称和资源名称            |
| isLoadVersionProperty   | 可选 | number        | 是否响应展品版本属性                                         |
| isLoadPolicyInfo        | 可选 | number        | 是否加载策略信息.测试环境自动忽略此参数                      |
| isTranslate             | 可选 | number        | 是否同步翻译.测试环境自动忽略此参数                          |

**返回说明：**

| 返回值字段              | 字段类型 | 字段说明                                                     |
| :---------------------- | :------- | :----------------------------------------------------------- |
| exhibitId               | string   | 展品 ID                                                      |
| exhibitName             | string   | 展品名称                                                     |
| exhibitTitle            | string   | 展品标题                                                     |
| tags                    | string[] | 展品标签                                                     |
| intro                   | string   | 展品简介                                                     |
| coverImages             | string[] | 展品封面图                                                   |
| version                 | string   | 展品版本                                                     |
| onlineStatus            | number   | 上线状态 0:下线 1:上线                                       |
| exhibitSubjectType      | number   | 展品对应的标的物类型(1:资源 2:展品 3:用户组)                 |
| userId                  | number   | 展品的创建者 ID                                              |
| nodeId                  | number   | 展品所属节点 ID                                              |
| status                  | number   | 状态(0:正常)                                                 |
| policies                | object[] | 对外授权的策略组                                             |
| \*\* policyId           | string   | 策略 ID                                                      |
| \*\* policyName         | string   | 策略名称                                                     |
| \*\* status             | number   | 策略状态 0:下线(未启用) 1:上线(启用)                         |
| \*\* policyText         | string   | 策略文本                                                     |
| \*\* translateInfo      | object   | 翻译信息<详见策略翻译文档>                                   |
| \*\* fsmDescriptionInfo | object   | 策略状态机描述信息<策略语言编译对象>                         |
| articleInfo             | object   | 展品实际挂载的作品信息                                       |
| \*\* articleId          | string   | 作品 ID                                                      |
| \*\* articleName        | string   | 作品名称                                                     |
| \*\* resourceType       | string[] | 作品资源类型                                                 |
| \*\* articleType        | number   | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象)   |
| \*\* articleOwnerId     | number   | 作品所有者 ID                                                |
| \*\* articleOwnerName   | string   | 作品所有者名称                                               |
| versionInfo             | object   | 展品的版本信息,加载版本属性时,才会赋值                       |
| \*\*exhibitProperty     | object   | 展品的版本属性                                               |
| \*\*dependencyTree      | object[] | 展品的版本依赖树                                             |
| \*\*\*\*nid             | string   | 依赖 ID(指的是此依赖在依赖树上的 id,用来确定依赖的唯一性)    |
| \*\*\*\*articleId       | string   | 作品 ID,配合作品类型一起理解. 例如类型是资源,此处就是资源 ID |
| \*\*\*\*articleName     | string   | 作品名称                                                     |
| \*\*\*\*articleType     | number   | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象)   |
| \*\*\*\*version         | string   | 版本号                                                       |
| \*\*\*\*versionRange    | string   | semver 版本范围                                              |
| \*\*\*\*resourceType    | stirng[] | 作品资源类型                                                 |
| \*\*\*\*deep            | number   | 该依赖在依赖树中的层级                                       |
| \*\*\*\*parentNid       | string   | 父级依赖 ID                                                  |
| createDate              | date     | 创建日期                                                     |
| updateDate              | date     | 更新日期                                                     |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": {
    "skip": 0,
    "limit": 10,
    "totalItem": 10,
    "dataList": [
      {
        "exhibitId": "61430ab27d0f6c002ec76ade",
        "exhibitName": "哥斯达黎加蒙特祖玛的海岸线",
        "exhibitTitle": "哥斯达黎加蒙特祖玛的海岸线",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [
          "https://image.freelog.com/preview-image/3f78173235c2bead482ed68a6489f082195738c5.jpg"
        ],
        "version": "0.1.0",
        "policies": [
          {
            "policyId": "bdddfb1df2e27dedd1f7e65ff19743ed",
            "policyName": "免费订阅（包月）",
            "status": 1
          },
          {
            "policyId": "1a8a1aa4bd3441a2f578d83c1070282c",
            "policyName": "付费订阅（包月）",
            "status": 0
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "61430a71f27e48003f5e230e",
          "articleName": "chtes/哥斯达黎加蒙特祖玛的海岸线",
          "resourceType": "image",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "chtes"
        },
        "status": 0
      },
      {
        "exhibitId": "606568df32ae6505c4e795e5",
        "exhibitName": "markdown-theme",
        "exhibitTitle": "markdown-theme",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [],
        "version": "0.1.3",
        "policies": [
          {
            "policyId": "53eeaec402d6cbc118cb40ed652227bb",
            "policyName": "免费策略",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "605355cb347afb003a54ceea",
          "articleName": "Freelog/markdown-theme",
          "resourceType": "theme",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "Freelog"
        },
        "status": 0
      },
      {
        "exhibitId": "60092955894f9d002e311f94",
        "exhibitName": "基本概念",
        "exhibitTitle": "基本概念",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [],
        "version": "0.1.0",
        "policies": [
          {
            "policyId": "53eeaec402d6cbc118cb40ed652227bb",
            "policyName": "免费策略",
            "status": 1
          },
          {
            "policyId": "bdddfb1df2e27dedd1f7e65ff19743ed",
            "policyName": "免费订阅（包月）",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "60092939973b31003a4fbf3b",
          "articleName": "chtes/基本概念",
          "resourceType": "markdown",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "chtes"
        },
        "status": 0
      },
      {
        "exhibitId": "60079cac135f16002f3b4005",
        "exhibitName": "测试MD依赖图",
        "exhibitTitle": "测试MD依赖图",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [],
        "version": "0.1.0",
        "policies": [
          {
            "policyId": "53eeaec402d6cbc118cb40ed652227bb",
            "policyName": "免费策略",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "60079c59973b31003a4fbf2c",
          "articleName": "chtes/测试MD依赖图",
          "resourceType": "markdown",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "chtes"
        },
        "status": 0
      },
      {
        "exhibitId": "60069b95664533002e72f0eb",
        "exhibitName": "123456789012345678901234567890",
        "exhibitTitle": "狮子",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [
          "https://image.freelog.com/preview-image/6f8b324691c14490156715f125f0247421183432"
        ],
        "version": "0.0.1",
        "policies": [
          {
            "policyId": "53eeaec402d6cbc118cb40ed652227bb",
            "policyName": "免费策略",
            "status": 0
          },
          {
            "policyId": "1a8a1aa4bd3441a2f578d83c1070282c",
            "policyName": "付费订阅（包月）",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "5f2a5b8df2dbae002f1891f7",
          "articleName": "12345676789/123456789012345678901234567890",
          "resourceType": "json",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "12345676789"
        },
        "status": 0
      },
      {
        "exhibitId": "60069481664533002e72f0e9",
        "exhibitName": "pubu",
        "exhibitTitle": "pubu",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [
          "https://image.freelog.com/preview-image/25fed1339632dd0a75d8b96e4a6da7e1b4a89fd8"
        ],
        "version": "0.0.3",
        "policies": [
          {
            "policyId": "53eeaec402d6cbc118cb40ed652227bb",
            "policyName": "免费策略",
            "status": 1
          },
          {
            "policyId": "bdddfb1df2e27dedd1f7e65ff19743ed",
            "policyName": "免费订阅（包月）",
            "status": 1
          },
          {
            "policyId": "1a8a1aa4bd3441a2f578d83c1070282c",
            "policyName": "付费订阅（包月）",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "5f1f8ba540641d002ba34a8e",
          "articleName": "12345676789/pubu",
          "resourceType": "image",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "12345676789"
        },
        "status": 0
      },
      {
        "exhibitId": "60068ce3135f16002f3b4000",
        "exhibitName": "猫头鹰{}",
        "exhibitTitle": "猫头鹰{}",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [
          "https://image.freelog.com/preview-image/4f89e78533c0a82f15339bc049aaaf2ec1055ff8"
        ],
        "version": "0.0.3",
        "policies": [
          {
            "policyId": "53eeaec402d6cbc118cb40ed652227bb",
            "policyName": "免费策略",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "5f39faed57da85002e9e5cc5",
          "articleName": "12345676789/haveDep2",
          "resourceType": "image",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "12345676789"
        },
        "status": 0
      },
      {
        "exhibitId": "60068cb3664533002e72f0e7",
        "exhibitName": "dudu",
        "exhibitTitle": "dudu",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [
          "https://image.freelog.com/preview-image/5efa440b0659eb108ea56e47e7e13348e6b2608b"
        ],
        "version": "0.1.0",
        "policies": [
          {
            "policyId": "1a8a1aa4bd3441a2f578d83c1070282c",
            "policyName": "付费订阅（包月）",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "6005553fb71c95003921aa1a",
          "articleName": "yanghongtian/dudu",
          "resourceType": "image",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "yanghongtian"
        },
        "status": 0
      },
      {
        "exhibitId": "5fec4d7a00bb3f002edda327",
        "exhibitName": "testimage",
        "exhibitTitle": "testimage",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [
          "https://image.freelog.com/preview-image/4db8571f47de3d556a59e39ab5cfe5da7ffdd92b"
        ],
        "version": "4.2.0",
        "policies": [
          {
            "policyId": "53eeaec402d6cbc118cb40ed652227bb",
            "policyName": "免费策略",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "5f9fb45a6bb6b9002e348697",
          "articleName": "chtes/testimage",
          "resourceType": "image",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "chtes"
        },
        "status": 0
      },
      {
        "exhibitId": "5fec4d6d00bb3f002edda325",
        "exhibitName": "西班牙奥尔德萨和佩尔迪多山国家公园中的奥尔德萨峡谷",
        "exhibitTitle": "西班牙奥尔德萨和佩尔迪多山国家公园中的奥尔德萨峡谷",
        "exhibitSubjectType": 2,
        "tags": [],
        "intro": "展品产品侧未提供简介字段",
        "coverImages": [
          "https://image.freelog.com/preview-image/81ff6d47fba8e6e79a1e598250b5a6f0ce58d0df"
        ],
        "version": "2.0.2",
        "policies": [
          {
            "policyId": "1a8a1aa4bd3441a2f578d83c1070282c",
            "policyName": "付费订阅（包月）",
            "status": 1
          }
        ],
        "onlineStatus": 1,
        "nodeId": 80000009,
        "userId": 50022,
        "articleInfo": {
          "articleId": "5feacb45b851b5002e59d8cd",
          "articleName": "chtes/西班牙奥尔德萨和佩尔迪多山国家公园中的奥尔德萨峡谷",
          "resourceType": "image",
          "articleType": 1,
          "articleOwnerId": 0,
          "articleOwnerName": "chtes"
        },
        "status": 0
      }
    ]
  }
}
```

## getExhibitRecommend

**用途：查找展品**

```ts
**参数说明**
  exhibitId: string, // 展品ID,推荐是根据此展品的信息进行推荐的
  query:{
    recommendNorm: string, // 推荐指标多个用逗号分隔,优先级也按照实际顺序来, 具体指标为 resourceType: 相同资源类型 tag:相同标签(部分) latestCreate:最新创建的
    size: 20, // 推荐数量,默认是10, 最大100
  }

**用法**
const res = await freelogApp.getExhibitRecommend(exhibitId, {
  recommendNorm: "resourceType",
  size: 20,
});
```

### 返回说明：

| 返回值字段         | 字段类型 | 字段说明                                     |
| :----------------- | :------- | :------------------------------------------- |
| exhibitId          | string   | 展品 ID                                      |
| exhibitName        | string   | 展品名称                                     |
| exhibitTitle       | string   | 展品标题                                     |
| tags               | string[] | 展品标签                                     |
| intro              | string   | 展品简介                                     |
| coverImages        | string[] | 展品封面图                                   |
| version            | string   | 展品版本                                     |
| onlineStatus       | int      | 上线状态 0:下线 1:上线                       |
| exhibitSubjectType | int      | 展品对应的标的物类型(1:资源 2:展品 3:用户组) |
| userId             | int      | 展品的创建者 ID                              |
| nodeId             | int      | 展品所属节点 ID                              |
| status             | int      | 状态(0:正常)                                 |
| createDate         | date     | 创建日期                                     |
| updateDate         | date     | 更新日期                                     |

### 返回示例

```json
{
  "ret": 0,
  "errCode": 0,
  "errcode": 0,
  "msg": "success",
  "data": [
    {
      "exhibitId": "6694c6a33a6fd1002fbf6124",
      "exhibitName": "第五章_聚气散",
      "exhibitTitle": "第五章 聚气散",
      "exhibitIntro": "这里是属于斗气的世界，没有花俏艳丽的魔法，有的，仅仅是繁衍到巅峰的斗气！",
      "exhibitSubjectType": 2,
      "tags": ["玄幻", "异世界"],
      "coverImages": [
        "https://image.freelog.com/preview-image/395002835c6ea7980bc9c450737159d599ea880a.jpeg"
      ],
      "version": "1.0.1",
      "policies": [],
      "onlineStatus": 0,
      "nodeId": 80000187,
      "userId": 50153,
      "articleInfo": {
        "articleId": "668f7dc29d270a002f4d03f9",
        "articleName": "luojiutian/第五章_聚气散",
        "resourceType": ["阅读", "文章"],
        "articleType": 1,
        "serializeStatus": 1,
        "articleOwnerId": 50145,
        "articleOwnerName": "luojiutian"
      },
      "status": 0,
      "createDate": "2024-07-15T06:50:11.984Z",
      "updateDate": "2024-07-15T08:16:36.580Z"
    },
    {
      "exhibitId": "668df576fa64bc002f484826",
      "exhibitName": "docs-collection",
      "exhibitTitle": "docs-collection",
      "exhibitIntro": "",
      "exhibitSubjectType": 2,
      "tags": [],
      "coverImages": [
        "https://image.freelog.com/preview-image/78e5c710bc13c56770094c73d0782f4bca1941a8.jpeg"
      ],
      "version": "1.0.0",
      "policies": [
        {
          "policyId": "2665bd4e6e035c9dc0260cf8c7ee01b1",
          "policyName": "永久免费",
          "status": 1
        }
      ],
      "onlineStatus": 1,
      "nodeId": 80000251,
      "userId": 50493,
      "articleInfo": {
        "articleId": "668df50b1fecaf002f40c349",
        "articleName": "dj-test/docs-collection",
        "resourceType": ["阅读", "文章"],
        "articleType": 2,
        "serializeStatus": 1,
        "articleOwnerId": 50493,
        "articleOwnerName": "dj-test"
      },
      "status": 0,
      "createDate": "2024-07-10T02:44:06.800Z",
      "updateDate": "2024-07-10T02:44:12.591Z"
    },
    {
      "exhibitId": "668ba694e90d0a002fc48caf",
      "exhibitName": "向阳而生",
      "exhibitTitle": "向阳而生",
      "exhibitIntro": "",
      "exhibitSubjectType": 2,
      "tags": [],
      "coverImages": [
        "https://image.freelog.com/preview-image/bdb0652c8e9ad59ac8b60bbe9288887314252c30.jpeg"
      ],
      "version": "1.0.0",
      "policies": [
        {
          "policyId": "2665bd4e6e035c9dc0260cf8c7ee01b1",
          "policyName": "永久免费",
          "status": 0
        },
        {
          "policyId": "d4a2e222f85994e6ad5269765c4cfec2",
          "policyName": "永久解锁",
          "status": 1
        }
      ],
      "onlineStatus": 1,
      "nodeId": 80000201,
      "userId": 50156,
      "articleInfo": {
        "articleId": "668ba634f2abab002f53012b",
        "articleName": "Nodeconsumer/向阳而生",
        "resourceType": ["阅读", "文章"],
        "articleType": 1,
        "serializeStatus": 1,
        "articleOwnerId": 50156,
        "articleOwnerName": "Nodeconsumer"
      },
      "status": 0,
      "createDate": "2024-07-08T08:43:00.905Z",
      "updateDate": "2024-07-08T09:33:44.792Z"
    },
    {
      "exhibitId": "66879202e90d0a002fc46c5f",
      "exhibitName": "Vue3源码与原理",
      "exhibitTitle": "Vue3源码与原理",
      "exhibitIntro": "Vue3源码与原理",
      "exhibitSubjectType": 2,
      "tags": ["编程", "Vue"],
      "coverImages": [
        "https://image.freelog.com/preview-image/1c47f10e145bc20a699c4d68213fe87acbcd5d28.jpg"
      ],
      "version": "0.1.0",
      "policies": [
        {
          "policyId": "2665bd4e6e035c9dc0260cf8c7ee01b1",
          "policyName": "永久免费",
          "status": 1
        }
      ],
      "onlineStatus": 1,
      "nodeId": 80000251,
      "userId": 50493,
      "articleInfo": {
        "articleId": "61b06b7ae4cc45002e663240",
        "articleName": "ZhuC/Vue3源码与原理",
        "resourceType": ["阅读", "文章"],
        "articleType": 1,
        "serializeStatus": 1,
        "articleOwnerId": 50060,
        "articleOwnerName": "ZhuC"
      },
      "status": 0,
      "createDate": "2024-07-05T06:26:10.772Z",
      "updateDate": "2024-07-05T06:26:19.101Z"
    },
    {
      "exhibitId": "668664cbe90d0a002fc453bb",
      "exhibitName": "测试展品授权链异常MD",
      "exhibitTitle": "测试展品授权链异常MD",
      "exhibitIntro": "",
      "exhibitSubjectType": 2,
      "tags": [],
      "coverImages": ["//static.testfreelog.com/static/default_cover.png"],
      "version": "0.1.0",
      "policies": [],
      "onlineStatus": 0,
      "nodeId": 80000161,
      "userId": 50145,
      "articleInfo": {
        "articleId": "620368b3972df6003976c6bb",
        "articleName": "chtes/测试展品授权链异常MD",
        "resourceType": ["阅读", "文章"],
        "articleType": 1,
        "serializeStatus": 1,
        "articleOwnerId": 50022,
        "articleOwnerName": "chtes"
      },
      "status": 0,
      "createDate": "2024-07-04T09:00:59.316Z",
      "updateDate": "2024-07-04T09:00:59.316Z"
    },
    {
      "exhibitId": "668519a2834594002f35eb63",
      "exhibitName": "合集034",
      "exhibitTitle": "合集034",
      "exhibitIntro": "",
      "exhibitSubjectType": 2,
      "tags": [],
      "coverImages": ["//static.testfreelog.com/static/default_cover.png"],
      "version": "1.0.0",
      "policies": [],
      "onlineStatus": 0,
      "nodeId": 80000000,
      "userId": 50028,
      "articleInfo": {
        "articleId": "66851970452377002e168cdc",
        "articleName": "12345676789/合集034",
        "resourceType": ["阅读", "文章"],
        "articleType": 2,
        "serializeStatus": 1,
        "articleOwnerId": 50028,
        "articleOwnerName": "12345676789"
      },
      "status": 0,
      "createDate": "2024-07-03T09:28:02.531Z",
      "updateDate": "2024-07-05T03:25:51.969Z"
    },
    {
      "exhibitId": "6675315534f648002f93e4c4",
      "exhibitName": "驱魔人",
      "exhibitTitle": "驱魔人",
      "exhibitIntro": "",
      "exhibitSubjectType": 2,
      "tags": ["惊悚", "异能", "悬疑", "灵异", "都市", "冒险", "犯罪", "科幻"],
      "coverImages": [
        "https://image.freelog.com/preview-image/83bdeeee6cb3e01c8a39403852326917d4b05599.jpg#x=0&y=1.0714285714285714&r=0&w=120.00000000000001&h=90&width=120&height=150"
      ],
      "version": "0.1.1",
      "policies": [
        {
          "policyId": "2665bd4e6e035c9dc0260cf8c7ee01b1",
          "policyName": "永久免费",
          "status": 1
        }
      ],
      "onlineStatus": 1,
      "nodeId": 80000251,
      "userId": 50493,
      "articleInfo": {
        "articleId": "64b4f10df21cc6002f9fead2",
        "articleName": "zyconsumer/驱魔人",
        "resourceType": ["阅读", "文章"],
        "articleType": 1,
        "serializeStatus": 1,
        "articleOwnerId": 50155,
        "articleOwnerName": "zyconsumer"
      },
      "status": 0,
      "createDate": "2024-06-21T07:52:53.171Z",
      "updateDate": "2024-06-21T07:53:00.474Z"
    },
    {
      "exhibitId": "6673987ccf9929002f7b3d59",
      "exhibitName": "啊大大大是",
      "exhibitTitle": "啊大大大是",
      "exhibitIntro": "",
      "exhibitSubjectType": 2,
      "tags": [],
      "coverImages": ["//static.testfreelog.com/static/default_cover.png"],
      "version": "1.0.0",
      "policies": [
        {
          "policyId": "2665bd4e6e035c9dc0260cf8c7ee01b1",
          "policyName": "永久免费",
          "status": 1
        },
        {
          "policyId": "2baa280d4b01ec114e9d6b33f8ec5683",
          "policyName": "免费30秒支付可用30秒",
          "status": 1
        }
      ],
      "onlineStatus": 1,
      "nodeId": 80000159,
      "userId": 50145,
      "articleInfo": {
        "articleId": "66728fdb6c7248002e95760a",
        "articleName": "luojiutian/啊大大大是",
        "resourceType": ["阅读", "文章"],
        "articleType": 1,
        "serializeStatus": 1,
        "articleOwnerId": 50145,
        "articleOwnerName": "luojiutian"
      },
      "status": 0,
      "createDate": "2024-06-20T02:48:28.135Z",
      "updateDate": "2024-07-02T09:21:25.052Z"
    },
    {
      "exhibitId": "6672925ecf9929002f7b2c6f",
      "exhibitName": "啊大大大是",
      "exhibitTitle": "啊大大大是",
      "exhibitIntro": "",
      "exhibitSubjectType": 2,
      "tags": [],
      "coverImages": ["//static.testfreelog.com/static/default_cover.png"],
      "version": "1.0.0",
      "policies": [
        {
          "policyId": "2665bd4e6e035c9dc0260cf8c7ee01b1",
          "policyName": "永久免费",
          "status": 1
        }
      ],
      "onlineStatus": 1,
      "nodeId": 80000164,
      "userId": 50145,
      "articleInfo": {
        "articleId": "66728fdb6c7248002e95760a",
        "articleName": "luojiutian/啊大大大是",
        "resourceType": ["阅读", "文章"],
        "articleType": 1,
        "serializeStatus": 1,
        "articleOwnerId": 50145,
        "articleOwnerName": "luojiutian"
      },
      "status": 0,
      "createDate": "2024-06-19T08:10:06.073Z",
      "updateDate": "2024-06-19T08:10:12.943Z"
    },
    {
      "exhibitId": "666aa7bccf9929002f7a81cc",
      "exhibitName": "活人禁忌",
      "exhibitTitle": "活人禁忌",
      "exhibitIntro": "",
      "exhibitSubjectType": 2,
      "tags": ["玄幻", "悬疑", "灵异", "冒险"],
      "coverImages": [
        "https://image.freelog.com/preview-image/f40ff8bbc3cc7d7c4d777142e9deaa322f77f208.jpeg"
      ],
      "version": "1.0.0",
      "policies": [
        {
          "policyId": "2665bd4e6e035c9dc0260cf8c7ee01b1",
          "policyName": "永久免费",
          "status": 1
        }
      ],
      "onlineStatus": 1,
      "nodeId": 80000250,
      "userId": 50493,
      "articleInfo": {
        "articleId": "665ecc9a6c7248002e92c6e9",
        "articleName": "Nodeconsumer/活人禁忌",
        "resourceType": ["阅读", "文章"],
        "articleType": 1,
        "serializeStatus": 1,
        "articleOwnerId": 50156,
        "articleOwnerName": "Nodeconsumer"
      },
      "status": 0,
      "createDate": "2024-06-13T08:03:08.362Z",
      "updateDate": "2024-06-13T08:03:20.113Z"
    }
  ]
}
```

## getExhibitListById

**用途：查找展品**

```ts
**参数说明**
  query:{
    exhibitIds: string,  展品ids 多个使用","隔开
    isLoadVersionProperty: 0 | 1, 可选，是否加载版本信息,默认0
  }

**用法**
const res = await freelogApp.getExhibitListById(query)
```

**返回说明**

| 返回值字段              | 字段类型 | 字段说明                                                   |
| :---------------------- | :------- | :--------------------------------------------------------- |
| exhibitId               | string   | 展品 ID                                                    |
| exhibitName             | string   | 展品名称                                                   |
| exhibitTitle            | string   | 展品标题                                                   |
| tags                    | string[] | 展品标签                                                   |
| intro                   | string   | 展品简介                                                   |
| coverImages             | string[] | 展品封面图                                                 |
| version                 | string   | 展品版本                                                   |
| onlineStatus            | number   | 上线状态 0:下线 1:上线                                     |
| userId                  | number   | 展品的创建者 ID                                            |
| nodeId                  | number   | 展品所属节点 ID                                            |
| policies                | object[] | 对外授权的策略组                                           |
| \*\* policyId           | string   | 策略 ID                                                    |
| \*\* policyName         | string   | 策略名称                                                   |
| \*\* status             | number   | 策略状态 0:下线(未启用) 1:上线(启用)                       |
| \*\* policyText         | string   | 策略文本                                                   |
| \*\* translateInfo      | object   | 翻译信息<详见策略翻译文档>                                 |
| \*\* fsmDescriptionInfo | object   | 策略状态机描述信息<策略语言编译对象>                       |
| articleInfo             | object   | 展品实际挂载的作品信息                                     |
| \*\* articleId          | string   | 作品 ID                                                    |
| \*\* articleName        | string   | 作品名称                                                   |
| \*\* resourceType       | string   | 作品资源类型                                               |
| \*\* articleType        | number   | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象) |
| \*\* articleOwnerId     | number   | 作品所有者 ID                                              |
| \*\* articleOwnerName   | string   | 作品所有者名称                                             |
| versionInfo             | object   | 展品的版本信息,加载版本属性时,才会赋值                     |
| \*\*exhibitProperty     | object   | 展品的版本属性                                             |
| createDate              | date     | 创建日期                                                   |
| updateDate              | date     | 更新日期                                                   |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "exhibitId": "61430ab27d0f6c002ec76ade",
      "exhibitName": "哥斯达黎加蒙特祖玛的海岸线",
      "exhibitTitle": "哥斯达黎加蒙特祖玛的海岸线",
      "exhibitSubjectType": 2,
      "tags": [],
      "intro": "展品产品侧未提供简介字段",
      "coverImages": [
        "https://image.freelog.com/preview-image/3f78173235c2bead482ed68a6489f082195738c5.jpg"
      ],
      "version": "0.1.0",
      "policies": [
        {
          "policyId": "bdddfb1df2e27dedd1f7e65ff19743ed",
          "policyName": "免费订阅（包月）",
          "status": 1,
          "translateInfo": {
            "audienceInfos": [
              {
                "origin": {
                  "name": "public",
                  "type": "public"
                },
                "content": "公开（所有人可签约）"
              }
            ],
            "fsmInfos": [
              {
                "stateInfo": {
                  "origin": "initial",
                  "content": "初始状态"
                },
                "serviceStateInfos": [
                  {
                    "origin": "active",
                    "content": "已授权"
                  }
                ],
                "eventTranslateInfos": [
                  {
                    "origin": {
                      "id": "51f0371f1c8d49ee8168c69037f04216",
                      "name": "RelativeTimeEvent",
                      "args": {
                        "elapsed": 1,
                        "timeUnit": "month"
                      },
                      "state": "finish"
                    },
                    "content": "1个月之后，进入 终止状态"
                  }
                ]
              },
              {
                "stateInfo": {
                  "origin": "finish",
                  "content": "终止状态"
                },
                "serviceStateInfos": [],
                "eventTranslateInfos": []
              }
            ],
            "content": "\n初始状态[已授权]：\n\t1个月之后，进入 终止状态\n终止状态：\n\t\n"
          },
          "policyText": "for public\n\ninitial[active]:\n  ~freelog.RelativeTimeEvent(\"1\",\"month\") => finish\nfinish:\n  terminate",
          "fsmDescriptionInfo": {
            "initial": {
              "transitions": [
                {
                  "toState": "finish",
                  "service": "freelog",
                  "name": "RelativeTimeEvent",
                  "args": {
                    "elapsed": 1,
                    "timeUnit": "month"
                  },
                  "code": "A103",
                  "isSingleton": false,
                  "eventId": "51f0371f1c8d49ee8168c69037f04216"
                }
              ],
              "serviceStates": ["active"],
              "isInitial": true,
              "isAuth": true,
              "isTestAuth": false
            },
            "finish": {
              "transitions": [],
              "serviceStates": [],
              "isAuth": false,
              "isTestAuth": false,
              "isTerminate": true
            }
          }
        },
        {
          "policyId": "1a8a1aa4bd3441a2f578d83c1070282c",
          "policyName": "付费订阅（包月）",
          "status": 0,
          "translateInfo": {
            "audienceInfos": [
              {
                "origin": {
                  "name": "public",
                  "type": "public"
                },
                "content": "公开（所有人可签约）"
              }
            ],
            "fsmInfos": [
              {
                "stateInfo": {
                  "origin": "initial",
                  "content": "初始状态"
                },
                "serviceStateInfos": [],
                "eventTranslateInfos": [
                  {
                    "origin": {
                      "id": "d0d171a7f64c493da59a3cc80b049b21",
                      "name": "TransactionEvent",
                      "args": {
                        "amount": 10,
                        "account": "self.account"
                      },
                      "state": "auth"
                    },
                    "content": "支付 10枚 羽币，进入 状态auth"
                  }
                ]
              },
              {
                "stateInfo": {
                  "origin": "auth",
                  "content": "状态auth"
                },
                "serviceStateInfos": [
                  {
                    "origin": "active",
                    "content": "已授权"
                  }
                ],
                "eventTranslateInfos": [
                  {
                    "origin": {
                      "id": "b4ae32e9732b4bf0b69f5493bf51b8be",
                      "name": "RelativeTimeEvent",
                      "args": {
                        "elapsed": 1,
                        "timeUnit": "month"
                      },
                      "state": "finish"
                    },
                    "content": "1个月之后，进入 终止状态"
                  }
                ]
              },
              {
                "stateInfo": {
                  "origin": "finish",
                  "content": "终止状态"
                },
                "serviceStateInfos": [],
                "eventTranslateInfos": []
              }
            ],
            "content": "\n初始状态：\n\t支付 10枚 羽币，进入 状态auth\n状态auth[已授权]：\n\t1个月之后，进入 终止状态\n终止状态：\n\t\n"
          },
          "policyText": "for public\n\ninitial:\n  ~freelog.TransactionEvent(\"10\",\"self.account\") => auth\nauth[active]:\n  ~freelog.RelativeTimeEvent(\"1\",\"month\") => finish\nfinish:\n  terminate",
          "fsmDescriptionInfo": {
            "initial": {
              "transitions": [
                {
                  "toState": "auth",
                  "service": "freelog",
                  "name": "TransactionEvent",
                  "args": {
                    "amount": 10,
                    "account": "self.account"
                  },
                  "code": "S201",
                  "isSingleton": true,
                  "eventId": "d0d171a7f64c493da59a3cc80b049b21"
                }
              ],
              "serviceStates": [],
              "isInitial": true,
              "isAuth": false,
              "isTestAuth": false
            },
            "auth": {
              "transitions": [
                {
                  "toState": "finish",
                  "service": "freelog",
                  "name": "RelativeTimeEvent",
                  "args": {
                    "elapsed": 1,
                    "timeUnit": "month"
                  },
                  "code": "A103",
                  "isSingleton": false,
                  "eventId": "b4ae32e9732b4bf0b69f5493bf51b8be"
                }
              ],
              "serviceStates": ["active"],
              "isAuth": true,
              "isTestAuth": false
            },
            "finish": {
              "transitions": [],
              "serviceStates": [],
              "isAuth": false,
              "isTestAuth": false,
              "isTerminate": true
            }
          }
        }
      ],
      "onlineStatus": 1,
      "nodeId": 80000009,
      "userId": 50022,
      "articleInfo": {
        "articleId": "61430a71f27e48003f5e230e",
        "articleName": "chtes/哥斯达黎加蒙特祖玛的海岸线",
        "resourceType": "image",
        "articleType": 1,
        "articleOwnerId": 0,
        "articleOwnerName": "chtes"
      },
      "status": 0,
      "versionInfo": {
        "exhibitId": "61430ab27d0f6c002ec76ade",
        "exhibitProperty": {
          "fileSize": 747917,
          "width": 1920,
          "height": 1080,
          "type": "jpg",
          "mime": "image/jpeg"
        }
      }
    }
  ]
}
```

## getExhibitInfo

**用途：获取单个展品详情**

```ts
**参数说明**
  exhibitId: string,  展品id
  query:{
    isLoadVersionProperty: 0 | 1, 可选，是否加载版本信息,默认0
  }

**用法**
const res = await freelogApp.getExhibitInfo(exhibitId, query)
```

**返回说明**

| 返回值字段              | 字段类型 | 字段说明                                                     |
| :---------------------- | :------- | :----------------------------------------------------------- |
| exhibitId               | string   | 展品 ID                                                      |
| exhibitName             | string   | 展品名称                                                     |
| exhibitTitle            | string   | 展品标题                                                     |
| tags                    | string[] | 展品标签                                                     |
| intro                   | string   | 展品简介                                                     |
| coverImages             | string[] | 展品封面图                                                   |
| version                 | string   | 展品版本                                                     |
| onlineStatus            | number   | 上线状态 0:下线 1:上线                                       |
| exhibitSubjectType      | number   | 展品对应的标的物类型(1:资源 2:展品 3:用户组)                 |
| userId                  | number   | 展品的创建者 ID                                              |
| nodeId                  | number   | 展品所属节点 ID                                              |
| status                  | number   | 状态(0:正常)                                                 |
| policies                | object[] | 对外授权的策略组                                             |
| \*\* policyId           | string   | 策略 ID                                                      |
| \*\* policyName         | string   | 策略名称                                                     |
| \*\* status             | number   | 策略状态 0:下线(未启用) 1:上线(启用)                         |
| \*\* policyText         | string   | 策略文本                                                     |
| \*\* translateInfo      | object   | 翻译信息<详见策略翻译文档>                                   |
| \*\* fsmDescriptionInfo | object   | 策略状态机描述信息<策略语言编译对象>                         |
| articleInfo             | object   | 展品实际挂载的作品信息                                       |
| \*\* articleId          | string   | 作品 ID                                                      |
| \*\* articleName        | string   | 作品名称                                                     |
| \*\* resourceType       | string[] | 作品资源类型                                                 |
| \*\* articleType        | number   | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象)   |
| \*\* articleOwnerId     | number   | 作品所有者 ID                                                |
| \*\* articleOwnerName   | string   | 作品所有者名称                                               |
| versionInfo             | object   | 展品的版本信息,加载版本属性时,才会赋值                       |
| \*\*exhibitProperty     | object   | 展品的版本属性                                               |
| \*\*dependencyTree      | object[] | 展品的版本依赖树                                             |
| \*\*\*\*nid             | string   | 依赖 ID(指的是此依赖在依赖树上的 id,用来确定依赖的唯一性)    |
| \*\*\*\*articleId       | string   | 作品 ID,配合作品类型一起理解. 例如类型是资源,此处就是资源 ID |
| \*\*\*\*articleName     | string   | 作品名称                                                     |
| \*\*\*\*articleType     | number   | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象)   |
| \*\*\*\*version         | string   | 版本号                                                       |
| \*\*\*\*versionRange    | string   | semver 版本范围                                              |
| \*\*\*\*resourceType    | stirng[] | 作品资源类型                                                 |
| \*\*\*\*deep            | number   | 该依赖在依赖树中的层级                                       |
| \*\*\*\*parentNid       | string   | 父级依赖 ID                                                  |
| createDate              | date     | 创建日期                                                     |
| updateDate              | date     | 更新日期                                                     |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": {
    "exhibitId": "61430ab27d0f6c002ec76ade",
    "exhibitName": "哥斯达黎加蒙特祖玛的海岸线",
    "exhibitTitle": "哥斯达黎加蒙特祖玛的海岸线",
    "exhibitSubjectType": 2,
    "tags": [],
    "intro": "展品产品侧未提供简介字段",
    "coverImages": [
      "https://image.freelog.com/preview-image/3f78173235c2bead482ed68a6489f082195738c5.jpg"
    ],
    "version": "0.1.0",
    "policies": [
      {
        "policyId": "bdddfb1df2e27dedd1f7e65ff19743ed",
        "policyName": "免费订阅（包月）",
        "status": 1
      },
      {
        "policyId": "1a8a1aa4bd3441a2f578d83c1070282c",
        "policyName": "付费订阅（包月）",
        "status": 0
      }
    ],
    "onlineStatus": 1,
    "nodeId": 80000009,
    "userId": 50022,
    "articleInfo": {
      "articleId": "61430a71f27e48003f5e230e",
      "articleName": "chtes/哥斯达黎加蒙特祖玛的海岸线",
      "resourceType": "image",
      "articleType": 1,
      "articleOwnerId": 0,
      "articleOwnerName": "chtes"
    },
    "status": 0,
    "versionInfo": {
      "exhibitId": "61430ab27d0f6c002ec76ade",
      "exhibitProperty": {
        "fileSize": 747917,
        "width": 1920,
        "height": 1080,
        "type": "jpg",
        "mime": "image/jpeg"
      }
    }
  }
}
```

## getExhibitFileStream

**用途：获取展品作品文件**

```ts
**参数说明**
  exhibitId: string // 展品id，
  options: {
    returnUrl?: boolean; // 是否只返回url， 例如img标签图片只需要url
    config?: {
      onUploadProgress?: (progressEvent: any) => void;
      onDownloadProgress?: (progressEvent: any) => void;
      timeout?: number; // 请求超时时间，默认30000ms
      responseType?: ResponseType;
    };  // axios的config 目前仅支持"onUploadProgress",  "onDownloadProgress", "responseType"
    subFilePath?: string;  // 漫画中的图片等子文件的路径
  },

**用法**
const res = await freelogApp.getExhibitFileStream(
  exhibitId,
  {
    returnUrl,
    config
  }
)
```

## getExhibitDepInfo

**用途：批量查询展品依赖的作品信息**

```ts
**参数说明**
  exhibitId: string ,  // 展品id
  {articleNids: string}, // 展品依赖的作品NID(依赖树上的节点ID),多个用逗号分隔

**用法**
const res = await freelogApp.getExhibitDepInfo(
  exhibitId,
  {articleNids: string}
)
```

**返回说明**

| 返回值字段      | 字段类型 | 字段说明                                                   |
| :-------------- | :------- | :--------------------------------------------------------- |
| nid             | string   | 作品在展品依赖树上的节点 ID                                |
| articleId       | string   | 作品 ID                                                    |
| articleName     | string   | 作品名称                                                   |
| articleType     | number   | 作品类型 (1:独立资源 2:组合资源 3:节点组合资源 4:存储对象) |
| version         | string   | 作品的版本                                                 |
| resourceType    | string   | 作品的资源类型                                             |
| articleProperty | object   | 作品的属性                                                 |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "nid": "608667da52ab",
      "articleId": "60865bb6348128003490ae87",
      "articleName": "Freelog/novel-theme",
      "articleType": 1,
      "version": "0.1.3",
      "resourceType": "theme",
      "articleProperty": {
        "fileSize": 258027,
        "mime": "application/zip"
      }
    },
    {
      "nid": "c5da1573850f",
      "articleId": "607bd7e87d6b53002f251d03",
      "articleName": "Freelog/novel",
      "articleType": 1,
      "version": "0.1.7",
      "resourceType": "widget",
      "articleProperty": {
        "fileSize": 301818,
        "mime": "application/zip"
      }
    }
  ]
}
```

## getExhibitDepFileStream

**用途：获取展品子依赖作品文件**

```ts
**参数说明**
  exhibitId: string, // 自身展品id
  query: {
    parentNid: string; // 依赖树上的父级节点ID,一般获取展品子依赖需要传递
    subArticleId: string; // 子依赖的作品ID
    returnUrl?: boolean; // 是否只返回url， 例如img标签图片只需要url
    config?: {
      onUploadProgress?: (progressEvent: any) => void;
      onDownloadProgress?: (progressEvent: any) => void;
      timeout?: number; // 请求超时时间，默认30000ms
      responseType?: ResponseType;
    },   //  axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"
  }

**用法**
const res = await freelogApp.getExhibitDepFileStream(
  exhibitId,
  query:{
    parentNid,
    subArticleId,
    returnUrl
  }
)
```

## getExhibitSignCount

**用途：查找展品签约数量（同一个用户的多次签约只计算一次）**

```ts
**参数说明**
  exhibitIds: string,  // 用英文逗号隔开的一个或多个展品id

**用法**
const res = await freelogApp.getExhibitSignCount(exhibitIds)
```

**返回说明**

| 返回值字段 | 字段类型 | 字段说明                 |
| :--------- | :------- | :----------------------- |
| subjectId  | string   | 标的物 ID，这里是展品 id |
| count      | number   | 已签约的总数(已去重)     |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "subjectId": "60a754e0587d2500392a2874",
      "count": 5
    },
    {
      "subjectId": "61400b2940808e002e482d32",
      "count": 4
    }
  ]
}
```

## getExhibitAuthStatus

**用途：批量查询展品授权**

```ts
**参数说明**
  exhibitIds: string, // 用英文逗号隔开的一个或多个展品id

**用法**
const res = await freelogApp.getExhibitAuthStatus(exhibitIds)
```

**返回说明**

| 返回值字段            | 字段类型 | 字段说明                                                   |
| :-------------------- | :------- | :--------------------------------------------------------- |
| exhibitId             | string   | 展品 ID                                                    |
| exhibitName           | string   | 展品名称                                                   |
| referee               | number   | 做出授权结果的标的物服务类型(1:资源服务 2:展品服务)        |
| defaulterIdentityType | number   | 授权不通过责任方(0:无 1:资源 2:节点 4:c 端消费者 128:未知) |
| authCode              | number   | 授权码                                                     |
| isAuth                | boolean  | 是否授权通过                                               |
| errorMsg              | string   | 错误信息                                                   |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "exhibitId": "608667da52abf900867dfd48",
      "exhibitName": "novel-theme",
      "authCode": 200,
      "referee": 2,
      "defaulterIdentityType": 0,
      "isAuth": true,
      "errorMsg": ""
    }
  ]
}
```

## getExhibitAvailable

**用途：批量查询展品是否可用（即能否提供给用户签约）**

```ts
**参数说明**
  exhibitIds:: string,  // 用英文逗号隔开的一个或多个展品id

**用法**
const res = await freelogApp.getExhibitAvailable(exhibitIds)
```

**返回说明**

| 返回值字段            | 字段类型 | 字段说明                                                   |
| :-------------------- | :------- | :--------------------------------------------------------- |
| exhibitId             | string   | 展品 ID                                                    |
| exhibitName           | string   | 展品名称                                                   |
| referee               | number   | 做出授权结果的标的物服务类型(1:作品服务 2:展品服务)        |
| defaulterIdentityType | number   | 授权不通过责任方(0:无 1:作品 2:节点 4:c 端消费者 128:未知) |
| authCode              | number   | 授权码                                                     |
| isAuth                | boolean  | 是否授权通过                                               |
| errorMsg              | string   | 错误信息                                                   |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "exhibitId": "608667da52abf900867dfd48",
      "exhibitName": "novel-theme",
      "authCode": 200,
      "referee": 2,
      "defaulterIdentityType": 0,
      "isAuth": true,
      "errorMsg": ""
    }
  ]
}
```

## getSignStatistics

**用途：统计展品签约量**

```ts
**参数说明**
   query?: {
     keywords: string // 标的物名称，这里指展品名称
    }

**用法**
const res = await freelogApp.getSignStatistics(query)
```

**返回说明**

| 返回值字段     | 字段类型 | 字段说明                           |
| :------------- | :------- | :--------------------------------- |
| subjectId      | string   | 标的物 ID，这里指展品 id,exhibitId |
| subjectName    | string   | 标的物名称                         |
| policyIds      | string[] | 签约的策略                         |
| latestSignDate | date     | 最后签约日期                       |
| count          | number   | 签约次数                           |

**返回示例**

```json
{
  "ret": 0,
  "errCode": 0,
  "msg": "success",
  "data": [
    {
      "subjectId": "61e7b893f04747002e473d63",
      "subjectName": "nes",
      "policyIds": ["7daf80d238c6750761b21b5ac2af20c9"],
      "latestSignDate": "2022-01-20T06:48:55.720Z",
      "count": 1
    },
    {
      "subjectId": "61e9046637cb3c002ea8776a",
      "subjectName": "nes-redwhite",
      "policyIds": ["7daf80d238c6750761b21b5ac2af20c9"],
      "latestSignDate": "2022-01-20T06:48:55.081Z",
      "count": 1
    },
    {
      "subjectId": "61e6724d9dc4d5002e5b20c1",
      "subjectName": "hdjshdjka",
      "policyIds": ["bdddfb1df2e27dedd1f7e65ff19743ed"],
      "latestSignDate": "2022-01-18T07:55:28.558Z",
      "count": 1
    },
    {
      "subjectId": "61400b2940808e002e482d32",
      "subjectName": "gallery-theme",
      "policyIds": ["2665bd4e6e035c9dc0260cf8c7ee01b1"],
      "latestSignDate": "2022-01-18T03:24:58.641Z",
      "count": 1
    },
    {
      "subjectId": "60f92963a7f4d8002ef06d01",
      "subjectName": "novel-word",
      "policyIds": ["3104b19e139f132b9407c9b89c32f637"],
      "latestSignDate": "2022-01-18T03:21:02.855Z",
      "count": 1
    },
    {
      "subjectId": "60ef9ca6f35f70002eccd1e4",
      "subjectName": "novel-theme",
      "policyIds": ["3104b19e139f132b9407c9b89c32f637"],
      "latestSignDate": "2022-01-18T03:21:01.988Z",
      "count": 1
    },
    {
      "subjectId": "61e6282ff07610002e1c9446",
      "subjectName": "设计规范文档",
      "policyIds": ["d4922410431ed4796fb8be04579ea66c"],
      "latestSignDate": "2022-01-18T02:44:01.346Z",
      "count": 1
    },
    {
      "subjectId": "61b99394c9dacc002e9f5821",
      "subjectName": "测试md的",
      "policyIds": ["f70e09b0698a7db9fcf720d583169f3a"],
      "latestSignDate": "2022-01-18T02:15:07.530Z",
      "count": 1
    },
    {
      "subjectId": "617665044f0b48002ef2eb26",
      "subjectName": "blog-theme",
      "policyIds": ["2665bd4e6e035c9dc0260cf8c7ee01b1"],
      "latestSignDate": "2022-01-18T02:14:57.665Z",
      "count": 1
    },
    {
      "subjectId": "61e53bfd9d23c2002e1f73eb",
      "subjectName": "blog-theme",
      "policyIds": ["d4922410431ed4796fb8be04579ea66c"],
      "latestSignDate": "2022-01-17T10:01:38.319Z",
      "count": 1
    },
    {
      "subjectId": "5fec4d7a00bb3f002edda327",
      "subjectName": "testimage",
      "policyIds": ["53eeaec402d6cbc118cb40ed652227bb"],
      "latestSignDate": "2022-01-17T09:25:52.551Z",
      "count": 1
    },
    {
      "subjectId": "60068ce3135f16002f3b4000",
      "subjectName": "猫头鹰{}",
      "policyIds": ["53eeaec402d6cbc118cb40ed652227bb"],
      "latestSignDate": "2022-01-17T09:25:52.510Z",
      "count": 1
    },
    {
      "subjectId": "60069481664533002e72f0e9",
      "subjectName": "pubu",
      "policyIds": ["53eeaec402d6cbc118cb40ed652227bb"],
      "latestSignDate": "2022-01-17T09:25:52.481Z",
      "count": 1
    },
    {
      "subjectId": "6142ebf67d0f6c002ec7696a",
      "subjectName": "gallery-theme",
      "policyIds": ["2665bd4e6e035c9dc0260cf8c7ee01b1"],
      "latestSignDate": "2022-01-17T09:25:51.548Z",
      "count": 1
    },
    {
      "subjectId": "61dbd630779333002e7cd2c9",
      "subjectName": "novel-theme",
      "policyIds": ["2665bd4e6e035c9dc0260cf8c7ee01b1"],
      "latestSignDate": "2022-01-17T09:23:27.205Z",
      "count": 1
    },
    {
      "subjectId": "61dd3697779333002e7d0dd6",
      "subjectName": "西游记（小说）",
      "policyIds": ["d4922410431ed4796fb8be04579ea66c"],
      "latestSignDate": "2022-01-17T09:10:14.181Z",
      "count": 1
    },
    {
      "subjectId": "60079cac135f16002f3b4005",
      "subjectName": "测试MD依赖图",
      "policyIds": ["53eeaec402d6cbc118cb40ed652227bb"],
      "latestSignDate": "2022-01-17T09:10:14.146Z",
      "count": 1
    },
    {
      "subjectId": "60092955894f9d002e311f94",
      "subjectName": "基本概念",
      "policyIds": ["53eeaec402d6cbc118cb40ed652227bb"],
      "latestSignDate": "2022-01-17T09:10:14.040Z",
      "count": 1
    },
    {
      "subjectId": "61b9b67467dd96002ec62ba4",
      "subjectName": "blog-theme",
      "policyIds": ["bdddfb1df2e27dedd1f7e65ff19743ed"],
      "latestSignDate": "2022-01-17T09:10:11.059Z",
      "count": 1
    },
    {
      "subjectId": "607bc554b188330065fddfb8",
      "subjectName": "飞致开元",
      "policyIds": ["8a06d9d54789215782a748f1b4634a5e"],
      "latestSignDate": "2022-01-17T07:21:34.137Z",
      "count": 1
    },
    {
      "subjectId": "608667da52abf900867dfd48",
      "subjectName": "novel-theme",
      "policyIds": ["1a8a1aa4bd3441a2f578d83c1070282c"],
      "latestSignDate": "2022-01-17T07:21:13.620Z",
      "count": 1
    }
  ]
}
```
