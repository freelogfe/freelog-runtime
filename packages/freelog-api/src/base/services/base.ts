// window.isTest =  window.location.host.split('.')[1] === 't';
export const placeHolder = "urlPlaceHolder";
// let baseURL = window.location.protocol + '//qi.freelog.com/v2/'
// if (window.location.href.indexOf('testfreelog') > -1) {
//     baseURL = window.location.protocol + '//qi.testfreelog.com/v2/'
// }
import { baseInfo } from "../baseInfo";
// window.baseURL = baseURL
export const baseConfig = () => {
  return {
    baseURL: baseInfo.baseURL,
    withCredentials: true,
    timeout: 30000,
  };
};
