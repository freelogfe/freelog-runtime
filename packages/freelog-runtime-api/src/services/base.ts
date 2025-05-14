export const placeHolder = "urlPlaceHolder";
// let baseURL = window.location.protocol + '//qi.freelog.com/v2/'
// if (window.location.href.indexOf('testfreelog') > -1) {
//     baseURL = window.location.protocol + '//qi.testfreelog.com/v2/'
// }
// window.baseURL = baseURL
import { baseInfo } from "../index";
export const baseConfig = () => {
  return {
    baseURL: baseInfo.baseURL,
    midURL: baseInfo.midURL,
    withCredentials: true,
    timeout: 30000,
  };
};
