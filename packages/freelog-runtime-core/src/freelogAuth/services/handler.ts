import axios from "../../request";
import { placeHolder, baseConfig } from "./base";
import { compareObjects } from "../../utils/utils";
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
  // if(window.freelogApp.isUserChange()){
  //   return 
  // }
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
  if (api.dataModel) {
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
    ["onUploadProgress", "onDownloadProgress", "responseType"].forEach(
      (key) => {
        if (config[key]) _config[key] = config[key];
      }
    );
  }
  let _api = Object.assign(_config, baseConfig(), api);
  if (returnUrl && _api.method.toLowerCase() === "get") {
    let query = "";
    if (_api.params) {
      Object.keys(_api.params).forEach((key) => {
        query = query + "&" + key + "=" + _api.params[key];
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
         /** 301 合同未获得授权
         *  303 标的物未签约
         *  502 未登录的用户
         */
        api.after && api.after(response);   
        resolve(response)    
      })
      .catch((error) => {
        // 防止error为空
        reject({ error });
        if (typeof error === "string") {
        } else {
        }
      });
  });
}
