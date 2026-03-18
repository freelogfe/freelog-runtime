export const placeHolder = "urlPlaceHolder";

import { baseInfo } from "../config/env";
export const baseConfig = () => {
  return {
    baseURL: baseInfo.baseURL,
    midURL: baseInfo.midURL,
    withCredentials: true,
    timeout: 30000,
  };
};
