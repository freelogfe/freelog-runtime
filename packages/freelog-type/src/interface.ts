import {
  ContractLicenseeIdentityTypeEnum,
  ContractStatusEnum,
  FreelogUserInfo,
  PageResult,
  SubjectTypeEnum,
} from 'egg-freelog-base';
import {
  ArticleTypeEnum,
  PresentableAuthStatusEnum,
  PresentableOnlineStatusEnum,
} from './enum';

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
  // createDate: Date;
  // updateDate: Date;
  articleInfo: MountArticleInfo; // article(作品)指广义上的资源(单品资源,组合资源,节点组合资源)+存储对象
  versionInfo?: ExhibitVersionInfo;
  createDate?: Date;
  updateDate?: Date;
  contracts?: ContractInfo[];
}
export interface BasePolicyInfo {
  policyId: string;
  policyText: string;
  subjectType?: number;
  fsmDescriptionInfo: FsmDescriptionInfo;
  fsmDeclarationInfo?: any;
  translateInfo?: any;
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
  // createDate: Date;
  // updateDate: Date;
}

export interface ContractInfo {
  contractId: string;
  contractName: string;

  // 甲方相关信息
  licensorId: string | number;
  licensorName: string;
  licensorOwnerId: number;
  licensorOwnerName: string;

  // 乙方相关信息
  licenseeId: string | number;
  licenseeName: string;
  licenseeOwnerId: number;
  licenseeOwnerName: string;
  licenseeIdentityType: ContractLicenseeIdentityTypeEnum;

  // 标的物相关信息
  subjectId: string;
  subjectName: string;
  subjectType: SubjectTypeEnum;

  // 合同状态机部分
  fsmCurrentState?: string | null;
  fsmRunningStatus?: number;
  fsmDeclarations?: object;

  // 其他信息
  policyId: string;
  status?: ContractStatusEnum;
  authStatus: number;
  createDate?: Date;

  isAuth?: boolean;
  isTestAuth?: boolean;
}

export interface FsmDescriptionInfo {
  [stateName: string]: FsmStateDescriptionInfo;
}

export interface FsmStateDescriptionInfo {
  isAuth: boolean;
  isTestAuth: boolean;
  isInitial?: boolean;
  isTerminate?: boolean;
  serviceStates: string[];
  transitions: PolicyEventInfo[];
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

export interface PolicyEventInfo {
  code: string;
  service: string;
  name: string;
  eventId: string;
  toState: string;
  args?: {
    [paramName: string]: any;
  };
}
