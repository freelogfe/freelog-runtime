import axios from "../../request";
import { placeHolder, baseConfig } from "./base";
import { compareObjects } from "../../utils";
import { baseInfo } from "../../base/baseInfo";
// import { isUserChange } from '../security'
const noAuthCode = [301, 302, 303, 304, 305, 306, 307];
const authCode = [200, 201, 202, 203];
const errorAuthCode = [401, 402, 403, 501, 502, 503, 504, 505, 900, 901];
export const nativeOpen = XMLHttpRequest.prototype.open;

/**
 *
 * @param action api namespace.apiName
 * @param urlData array, use item for replace url's placeholder
 * @param data  body data or query data  string | object | Array<any> | null | JSON | undefined
 */
export default function frequest(
  action: any,
  urlData: Array<string | number> | null | undefined | "",
  data: any,
  returnUrl?: boolean,
  config?: any
): any {
  // if(isUserChange()){
  //   return
  // }
  // @ts-ignore
  XMLHttpRequest.prototype.open = nativeOpen;
  // @ts-ignore
  const caller = this;
  let api = Object.assign({}, action);
  // type Api2 = Exclude<Api, 'url' | 'before' | 'after'>
  let url = api.url;
  if (url.indexOf(placeHolder) > -1) {
    if (!urlData || !urlData.length) {
      console.error("urlData is required: " + urlData);
      return;
    }
    urlData.forEach((item) => {
      url = url.replace(placeHolder, item + "");
    });
  }
  // filter data if there is dataModel
  if (api.dataModel && caller) {
    data = Object.assign({}, data);
    compareObjects(api.dataModel, data, !!api.isDiff);
  }
  // pre method
  if (api.before) {
    data = api.before(data) || data;
  }
  if (api.method.toLowerCase() === "get") {
    api.params = data;
  } else {
    api.data = data;
  }
  // delete extra keys
  ["url", "before", "after"].forEach((item) => {
    delete api[item];
  });
  let _config: any = {};
  if (config) {
    [
      "onUploadProgress",
      "onDownloadProgress",
      "responseType",
      "timeout",
    ].forEach((key) => {
      if (config[key]) _config[key] = config[key];
    });
  }
  let _api = Object.assign(_config, baseConfig(), api);
  if (returnUrl && _api.method.toLowerCase() === "get") {
    let query = "";
    if (_api.params) {
      Object.keys(_api.params).forEach((key) => {
        query = query
          ? query + "&" + key + "=" + _api.params[key]
          : key + "=" + _api.params[key];
      });
    }
    if (query) {
      query = "?" + query;
    }
    return _api.baseURL + url + query;
  }
  // show msg
  return new Promise((resolve, reject) => {
    axios(url, _api)
      .then(async (response) => {
        api.after && api.after(response);
        resolve(response);
      })
      .catch((error) => {
        // 防止error为空
        reject({ error });
      });
  });
}
