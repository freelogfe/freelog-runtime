let ENV = "prod";
let HOST = "freelog.com";
const _host = window.location.host;
if (_host.includes(".testfreelog.com")) {
  ENV = "test";
  HOST = "testfreelog.com";
}
const protocol = window.location.protocol;
const _directURL = protocol + `//api.${HOST}/v2/`;
const _midURL = protocol + `//api.${HOST}/v2/runtimes/`;
window.ENV = ENV;
export const baseInfo: any = {
  ENV,
  HOST,
  isTest: ENV === "test",
  nodeId: "",
  baseURL: _midURL,
  directURL: _directURL,
};
