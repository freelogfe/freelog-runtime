export const placeHolder = 'urlPlaceHolder'
let baseURL = 'http://qi.freelog.com/v2/'
if (window.location.href.indexOf('testfreelog') > -1) {
    baseURL = 'http://qi.testfreelog.com/v2/'
}
export const baseUrl = baseURL
export const baseConfig = {
        baseURL,
        withCredentials: true,
        timeout: 30000
    };
    // TODO 上传文件进度等需要配置