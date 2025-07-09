let ENV = "prod";
let HOST = "freelog.com";
if (window.location.host.includes(".testfreelog.com")) {
  ENV = "test";
  HOST = "testfreelog.com";
}
window.ENV = ENV;
export const isTest = window.location.host.split(".")[1] === "t";
let _baseURL = window.location.protocol + "//api.freelog.com/v2/";
if (window.location.href.indexOf("testfreelog") > -1) {
  _baseURL = window.location.protocol + "//api.testfreelog.com/v2/";
}
export const baseURL = _baseURL;
window.baseURL = _baseURL;
window.isTest = isTest;
// @ts-ignore
export const baseInfo: any = {
  ENV,
  HOST,
  isTest: isTest,
  nodeId: "",
  baseURL: baseURL,
};
