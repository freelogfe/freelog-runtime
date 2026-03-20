let ENV = "prod";
let HOST = "freelog.cn";
let HOST_END = ".cn"
const _host = window.location.host;
if (_host.includes(".devfreelog.com")) {
  ENV = "dev";
  HOST_END = ".com";
  HOST = "devfreelog.com";
} else if (_host.includes(".testfreelog.com")) {
  ENV = "test";
  HOST_END = ".com";
  HOST = "testfreelog.com";
}
const protocol = window.location.protocol;
const _directURL = protocol + `//api.${HOST}/v2/`;
window.ENV = ENV;
window.HOST_END = HOST_END;
export const baseInfo: any = {
  ENV,
  HOST,
  nodeId: "",
  baseURL: _directURL,
};