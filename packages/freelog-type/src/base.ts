
export interface IApiDataFormat<T> {
  ret: RetCodeEnum;
  errCode: ErrCodeEnum;
  msg: string;
  data: T | object | string | number | any[] | null;
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
