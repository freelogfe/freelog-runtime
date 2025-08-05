import { ArticleTypeEnum } from "./enum";

export interface SubItemInfo {
  /**
   * 单品ID
   */
  itemId: string;
  /**
   * 单品标题
   */
  itemTitle: string;
  /**
   * 单品的排序ID
   */
  sortId: number;
  /**
   * 单品创建日期
   */
  createDate: string;
  /**
   * 单品的作品信息
   */
  articleInfo?: ItemArticleInfo;
  /**
   * 单品授权信息
   */
  authInfo?: ItemAuthResult;
}

export interface ItemArticleInfo {
  /**
   * 作品ID
   */
  articleId: string;
  /**
   * 作品名称
   */
  articleName: string;
  /**
   * 作品作者ID
   */
  articleOwnerId: number;
  /**
   * 作品作者名称
   */
  articleOwnerName: string;
  /**
   * 作品标题
   */
  articleTitle: string;
  /**
   * 作品类型 (1:独立资源 2:合集资源 3:节点合集资源 4:存储对象)
   */
  articleType: ArticleTypeEnum;
  /**
   * 作品封面图片数组
   */
  coverImages: string[];
  /**
   * 作品最近一次版本发布时间
   */
  latestVersionReleaseDate: string;
  /**
   * 作品第一个版本发布时间
   */
  firstVersionReleaseDate: string;
  /**
   * 作品资源类型数组，例如 ['image', 'photo']
   */
  intro: string;
  /**
   * 作品资源类型数组，例如 ['image', 'photo']
   */
  resourceType: string;
  /**
   * 单品对应的资源状态 1:正常 2:冻结
   */
  status: number;
  /**
   * 作品属性
   */
  articleProperty: {
    /**
     * 文件大小
     */
    fileSize: number;
    /**
     * 文件MIME类型
     */
    mime: string;
    /**
     * 其余属性，例如 imageHeight、imageWidth 等，不同作品有不同的属性值，具体请查看对应作品的属性。
     */
    [key: string]: number | string | boolean | null | object;
  };
}

export interface ItemAuthResult {
  /**
   * 单品ID
   */
  itemId: string;
  /**
   * 做出授权结果的标的物服务类型(1:作品服务 2:展品服务)
   */
  referee: number;
  /**
   * 表授权不通过的责任方，(0:无 1: 作品 2:节点 4:c 端消费者 128:未知)
   */
  defaulterIdentityType: 0 | 1 | 2 | 4 | 128;
  /**
   * 授权状态码，暂时只需要判断isAuth是否为true即可，未来会有更多状态码
   */
  authCode: number;
  /**
   * 授权是否通过
   */
  isAuth: boolean;
  /**
   * 授权错误信息
   */
  errorMsg: string;
}

export interface ItemDepTree {
  /**
   * 依赖树的节点ID
   */
  nid: string;
  /**
   * 父节点ID
   */
  parentNid: string;
  /**
   * 作品ID
   */
  articleId: string;
  /**
   * 作品名称
   */
  articleName: string;
  /**
   * 作品类型 (1:独立资源 2:合集资源 3:节点合集资源 4:存储对象)
   */
  articleType: number;
  /**
   * 作品版本号
   */
  version: string;
  /**
   * 作品版本ID
   */
  versionId: string;
  /**
   * semver版本范围，参考package.json中的dependencies中的版本范围格式
   */
  versionRange: string;
  /**
   * 作品资源类型数组，例如 ['image', 'photo']
   */
  resourceType: string[];
  /**
   * 该依赖在依赖树中的层级，从1开始
   */
  deep: number;
  /**
   * 文件SHA1值
   */
  fileSha1: string;
}
