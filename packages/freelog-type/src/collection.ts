import { SubjectTypeEnum } from "./base";
import { ArticleTypeEnum } from "./enum";
import { ContractInfo, BasePolicyInfo } from "./policyContract";
/**
 * 展品信息
 */
export interface SubItemInfo {
  itemId: string;
  itemTitle: string;
  sortId: number;
  createDate: string;
  articleInfo: articleInfo; // article(作品)指广义上的资源(单品资源,组合资源,节点组合资源)+存储对象
  updateDate?: Date;
}


export interface articleInfo {
  articleId: string;
  resourceType: string[];
  articleType: ArticleTypeEnum; // 1:独立资源 2:组合资源 3:节点组合资源 4:存储对象
  articleOwnerId: number;
  articleOwnerName: string;
  intro: string;
  coverImages: string[];
  otherInfo?: {
    [key: string]: any;
  };
}

export interface ItemAuthResult {
  itemId: string;
  referee: number;
  defaulterIdentityType: number;
  authCode: number;
  isAuth: boolean;
  errorMsg: string;
}

export interface ItemDepTree {
  nid?: string;
  articleId: string;
  articleName: string;
  articleType:number;
  version: string;
  versionRange: string;
  resourceType: string[];
  versionId: string;
  deep: number;
  parentNid: string;
  fileSha1: string;
}