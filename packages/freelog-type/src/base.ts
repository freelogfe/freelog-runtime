import { AxiosProgressEvent, ResponseType, responseEncoding } from "axios";

export interface AxiosConfig {
  responseType?: ResponseType;
  responseEncoding?: responseEncoding | string;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
  maxContentLength?: number;
  maxBodyLength?: number;
  timeout?: number;
}


export interface IApiDataFormat<T> {
  ret: RetCodeEnum;
  errCode: ErrCodeEnum;
  msg: string;
  data: T;
}
/**
 * 一级错误码
 */
export declare enum RetCodeEnum {
  serverRepair = -10,
  success = 0,
  serverError = 1,
  authenticationFailure = 2,
  authorizationFailure = 3,
  agentError = 4,
}
/**
 * 二级错误码
 */
export declare enum ErrCodeEnum {
  success = 0,
  autoSnapError = 1,
  applicationError = 2,
  authorizationError = 3,
  argumentError = 4,
  apiInvokingError = 5,
  logicError = 6,
  networkError = 7,
  applicationRouterMatchError = 8,
  databaseConnectionError = 9,
  loginUserFreezeError = 10,
  authenticationError = 30,
  gatewayHttpComponentInvokingError = 31,
  gatewayRouterMatchError = 32,
  gatewayUpstreamApiError = 33,
  apiError = 100,
}
export interface PlainObject {
  [str: string]: any;
  [num: number]: any;
}

export interface NodeInfo {
  nodeName: string;
  ownerUserName: string;
  ownerUserId: number;
  tags: string[];
  nodeLogo?: string;
  nodeTitle?: string;
  nodeShortDescription?: string;
}

/**
 * 标的物类型
 */
export declare enum SubjectTypeEnum {
  /**
   * 作品
   */
  Article = 1,
  /**
   * 展品
   */
  Exhibit = 2,
  /**
   * 用户组
   */
  UserGroup = 3,
  /**
   * 集合
   */
  Collection = 4,
}

/**
 * freelog-api通用分页数据格式
 */
export interface PageResult<T> {
  /**
   * 数据查询起点条数,类似于(page-1)*pageSize
   */
  skip: number;
  /**
   * 获取的数据数量,类似于pageSize
   */
  limit: number;
  /**
   * 总数量
   */
  totalItem: number;
  /**
   * 当前分页的数据集
   */
  dataList: T[];
}

export interface FreelogUserInfo {
  [key: string]: any;
  username: string;
  headImage: string;
  isOwner: boolean;
}

