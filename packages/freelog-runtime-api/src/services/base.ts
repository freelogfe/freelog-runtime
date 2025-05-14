export const placeHolder = "urlPlaceHolder";

import { baseInfo } from "../index";
export const baseConfig = () => {
  return {
    baseURL: baseInfo.baseURL,
    midURL: baseInfo.midURL,
    withCredentials: true,
    timeout: 30000,
  };
};
