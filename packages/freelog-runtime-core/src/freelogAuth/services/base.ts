export const placeHolder = "urlPlaceHolder";
// @ts-ignore
import { baseInfo } from "freelog-runtime-api";

export const baseConfig = () => {
  return {
    baseURL: baseInfo.directURL,
    withCredentials: true,
    timeout: 30000,
  };
};
