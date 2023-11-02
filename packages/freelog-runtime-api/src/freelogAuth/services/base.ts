export const placeHolder = "urlPlaceHolder";
// @ts-ignore
import { baseInfo } from "../../base/baseInfo";
console.log(baseInfo,666666)

export const baseConfig = {
  baseURL: baseInfo.baseURL,
  withCredentials: true,
  timeout: 30000,
};
// TODO 上传文件进度等需要配置
