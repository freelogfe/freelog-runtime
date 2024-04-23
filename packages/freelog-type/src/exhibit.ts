import { SubjectTypeEnum } from "egg-freelog-base";
import { ArticleTypeEnum } from "./enum";
import {
  ContractInfo,
  BasePolicyInfo,
} from "./policyContract";
/**
 * 展品信息
 */
export interface ExhibitInfo {
  exhibitId: string;
  exhibitName: string;
  exhibitTitle: string;
  exhibitIntro?: string;
  exhibitSubjectType: SubjectTypeEnum; // 展品或展品组合
  tags: string[];
  coverImages: string[];
  version: string; // 默认使用的资源版本号
  status: number; // 备用
  onlineStatus: number;
  nodeId: number;
  userId: number;
  policies: BasePolicyInfo[];
  articleInfo: MountArticleInfo; // article(作品)指广义上的资源(单品资源,组合资源,节点组合资源)+存储对象
  versionInfo?: ExhibitVersionInfo;
  createDate?: Date;
  updateDate?: Date;
  contracts?: ContractInfo[];
}

/**
 * 展品版本信息
 */
export interface ExhibitVersionInfo {
  exhibitId: string;
  version: string;
  articleId: string;
  articleSystemProperty?: {
    [key: string]: number | string | boolean | null | object;
  };
  articleCustomPropertyDescriptors?: any[];
  exhibitRewriteProperty?: any[];
  exhibitProperty?: {
    [key: string]: number | string | boolean | null | object;
  };
  authTree: ExhibitAuthNodeInfo[];
  dependencyTree: ExhibitDependencyNodeInfo[];
}
export interface ExhibitAuthNodeInfo {
  nid: string; // 树节点ID
  articleId: string;
  articleName: string;
  articleType: ArticleTypeEnum;
  resourceType: string[];
  version: string;
  versionId: string;
  parentNid: string;
  deep: number;
}
export interface ExhibitDependencyNodeInfo {
  nid: string; // 树节点ID
  articleId: string;
  articleName: string;
  articleType: ArticleTypeEnum;
  version: string;
  versionRange: string;
  resourceType: string[];
  versionId: string;
  deep: number;
  parentNid: string;
}
/**
 * 展品挂载的作品信息
 */
export interface MountArticleInfo {
  articleId: string;
  articleName: string;
  articleType: ArticleTypeEnum; // 1:独立资源 2:组合资源 3:节点组合资源 4:存储对象
  articleOwnerId: number;
  articleOwnerName: string;
  resourceType: string[];
  otherInfo?: {
    [key: string]: any;
  };
}

export interface ResourceDependencyTree {
  resourceId: string;
  resourceName: string;
  version: string;
  versions: string[];
  versionRange: string;
  resourceType: string[];
  resourceTypeCode?: string;
  versionId: string;
  fileSha1: string;
  baseUpcastResources: any[];
  dependencies: ResourceDependencyTree[];
}

export interface ExhibitDependencyTree {
  nid?: string;
  resourceId: string;
  resourceName: string;
  version: string;
  versionRange: string;
  resourceType: string[];
  versionId: string;
  fileSha1: string;
  dependencies: ExhibitDependencyTree[];
}

export interface AuthResult {
  exhibitId: string;
  exhibitName: string;
  authCode: number;
  referee: number;
  defaulterIdentityType: number;
  isAuth: boolean;
  errorMsg: string;
}

export interface SignItem {
  subjectId: string;
  count: number;
}

export interface DependArticleInfo {
  nid: string;
  articleId: string;
  articleName: string;
  articleType: 1;
  version: string;
  resourceType: string;
  articleProperty: {
    fileSize: number;
    mime: string;
  };
}
export interface SignCount {
  subjectId: string;
  subjectName: string;
  policyIds: string[];
  latestSignDate: string;
  count: number;
}
