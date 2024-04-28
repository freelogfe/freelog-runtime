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
  nodeId: number;
  nodeName: string;
  nodeDomain: string;
  ownerUserId: number;
  ownerUserName: string;
  nodeThemeId?: string;
  status?: number;
  uniqueKey?: string;
  tags: string[];
  nodeLogo?: string;
  nodeTitle?: string;
  nodeShortDescription?: string;
  nodeSuspendInfo?: string;
}

/**
 * 标的物类型
 */
export declare enum SubjectTypeEnum {
  /**
   * 资源
   */
  Resource = 1,
  /**
   * 展品
   */
  Presentable = 2,
  /**
   * 用户组
   */
  UserGroup = 3,
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
  userId: number;
  username: string;
}
/**
 * 合同乙方的身份类型
 */
export declare enum ContractLicenseeIdentityTypeEnum {
  /**
   * 资源方
   */
  Resource = 1,
  /**
   * 节点
   */
  Node = 2,
  /**
   * C端消费者
   */
  ClientUser = 3,
}
/**
 * 合同状态枚举
 */
export declare enum ContractStatusEnum {
  /**
   * 正常生效中
   */
  Executed = 0,
  /**
   * 合同已终止(未授权,并且不再接受新事件)
   * @type {number}
   */
  Terminated = 1,
  /**
   * 异常的,例如签名不对,冻结等.
   * @type {number}
   */
  Exception = 2,
}
