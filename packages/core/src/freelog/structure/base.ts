// export { isTest, baseURL } from "freelog-runtime-api";
export const isTest =  window.location.host.split('.')[1] === 't';
let _baseURL = window.location.protocol + '//api1.freelog.com/v2/'
if (window.location.href.indexOf('testfreelog') > -1) {
    _baseURL = window.location.protocol + '//api1.testfreelog.com/v2/'
}
export const baseURL = _baseURL
window.baseURL = _baseURL;
window.isTest = isTest
