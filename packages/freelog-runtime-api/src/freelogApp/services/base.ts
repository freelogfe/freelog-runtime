export const placeHolder = 'urlPlaceHolder'
// let baseURL = window.location.protocol + '//qi.freelog.com/v2/'
// if (window.location.href.indexOf('testfreelog') > -1) {
//     baseURL = window.location.protocol + '//qi.testfreelog.com/v2/'
// }
// window.baseURL = baseURL
import {baseInfo} from "../../base"

export const baseConfig = {
        baseURL: baseInfo.baseURL,
        withCredentials: true,
        timeout: 30000
    };
    // TODO 上传文件进度等需要配置