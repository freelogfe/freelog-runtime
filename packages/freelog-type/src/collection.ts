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
   * 单品类型
   */
  sortId: number;
  /**
   * 单品创建日期
   */
  createDate: string;
  articleInfo: articleInfo; // article(作品)指广义上的资源(单品资源,合集资源,节点合集资源)+存储对象
  updateDate?: Date;
  authInfo?: ItemAuthResult;
}


export interface articleInfo {
  articleId: string;
  resourceType: string[];
  articleType: ArticleTypeEnum; // 1:独立资源 2:合集资源 3:节点合集资源 4:存储对象
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
  nid: string;
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