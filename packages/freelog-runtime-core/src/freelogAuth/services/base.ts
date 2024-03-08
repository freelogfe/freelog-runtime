export const placeHolder = "urlPlaceHolder";
// @ts-ignore
import { baseInfo } from "../../base/baseInfo";

export const baseConfig = () => {
  return {
    baseURL: baseInfo.baseURL,
    withCredentials: true,
    timeout: 30000,
  };
};
