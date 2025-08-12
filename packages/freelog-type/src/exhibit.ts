import { SubjectTypeEnum } from "./base";
import { ArticleTypeEnum } from "./enum";

/**
 * 展品信息
 */
export interface ExhibitInfo {
  /**
   * 展品ID
   */
  exhibitId: string;
  /**
   * 展品名称
   */
  exhibitName: string;
  /**
   * 展品标题
   */
  exhibitTitle: string;
  /**
   * 展品简介
   */
  exhibitIntro: string;
  /**
   * 展品对应的标的物类型(1:资源 2:展品 3:用户组 4: 合集)
   */
  exhibitSubjectType: SubjectTypeEnum;
  /**
   * 展品标签数组
   */
  tags: string[];
  /**
   * 授权信息
   */
  authInfo?: AuthResult;
  /**
   * 展品封面图片数组
   */
  coverImages: string[];
  /**
   * 展品版本号
   */
  version: string;
  /**
   * 展品上线状态 0:下线 1:上线
   */
  onlineStatus: number;
  /**
   * 备用状态，目前无意义。 0 正常
   */
  status: number;
  /**
   * 作品作者id
   */
  userId: number;
  /**
   * 作品信息
   */
  articleInfo: MountArticleInfo; // article(作品)指广义上的资源(单品资源,合集资源,节点合集资源)+存储对象
  /**
   * 展品版本信息，包含依赖信息
   */
  versionInfo?: ExhibitVersionInfo;
  /**
   * 展品创建时间
   */
  createDate: Date;
  /**
   * 展品更新时间
   */
  updateDate: Date;
}

/**
 * 展品版本信息
 */
export interface ExhibitVersionInfo {
  /**
   * 展品ID
   */
  exhibitId: string;
  /**
   * 作品属性
   */
  exhibitProperty: {
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
  /**
   * 依赖的作品信息，一级数组，子孙依赖都在一起，根据parentNid与nid进行关联查找。
   */
  dependencyTree: DependencyNodeInfo[];
}

export interface DependencyNodeInfo {
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
  articleType: ArticleTypeEnum;
  /**
   * 作品版本号
   */
  version: string;
  /**
   * semver版本范围，参考package.json中的dependencies中的版本范围格式
   */
  versionRange: string;
  /**
   * 作品资源类型数组，例如 ['image', 'photo']
   */
  resourceType: string[];
  /**
   * 作品版本ID
   */
  versionId: string;
  /**
   * 该依赖在依赖树中的层级，从1开始
   */
  deep: number;
  /**
   * 文件SHA1值
   */
  fileSha1: string;
}
/**
 * 展品挂载的作品信息
 */
export interface MountArticleInfo {
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
  articleType: ArticleTypeEnum;
  /**
   * 作品作者ID
   */
  articleOwnerId: number;
  /**
   * 作品作者名称
   */
  articleOwnerName: string;
  /**
   * 作品资源类型，例如图片,照片等
   */
  resourceType: string[];
}

export interface AuthResult {
  /**
   * 展品ID
   */
  exhibitId: string;
  /**
   * 展品名称
   */
  exhibitName: string;
  /**
   * 授权是否通过
   */
  isAuth: boolean;
  /**
   * 授权状态码，暂时只需要判断isAuth是否为true即可，未来会有更多状态码
   */
  authCode: number;
  /**
   * 做出授权结果的标的物服务类型(1:作品服务 2:展品服务)
   */
  referee: 1 | 2;
  /**
   * 表授权不通过的责任方，(0:无 1: 作品 2:节点 4:c 端消费者 128:未知)
   */
  defaulterIdentityType: 0 | 1 | 2 | 4 | 128;
  /**
   * 授权错误信息
   */
  errorMsg: string;
}

export interface DependArticleInfo {
  /**
   * 依赖树的节点ID
   */
  nid: string;
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
  articleType: ArticleTypeEnum;
  /**
   * 作品版本号
   */
  version: string;
  /**
   * 作品资源类型数组，例如 ['image', 'photo']
   */
  resourceType: string;
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
export interface SignCount {
  /**
   * 标的物ID，当前是展品ID
   */
  subjectId: string;
  /**
   * 标的物名称，当前是展品名称
   */
  subjectName: string;
  /**
   * 签约的策略ID数组
   */
  policyIds: string[];
  /**
   * 最后一次签约日期
   */
  latestSignDate: string;
  /**
   * 签约次数
   */
  count: number;
}
export interface SignItem {
  /**
   * 标的物ID，当前是展品ID
   */
  subjectId: string;
  /**
   * 已签约的总数(已去重)
   */
  count: number;
}
