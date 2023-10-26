import axios from "../../request";
import { placeHolder, baseConfig } from "./base";
import { compareObjects } from "../../utils/utils";
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
  console.log(baseConfig,67777)
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
    // TODO 需要用deepclone
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
  let _api = Object.assign(_config, baseConfig, api);
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
        // 如果是授权接口，而且有数据
        if (caller && caller.isAuth && response.data && response.data.data) {
          const resData = response.data.data;
          const exhibitId = response.headers["freelog-exhibit-id"];
          const exhibitName = decodeURI(
            response.headers["freelog-exhibit-name"]
          );
          const articleNid = decodeURI(response.headers["freelog-article-nid"]);
          const resourceType = decodeURI(
            response.headers["freelog-article-resource-type"]
          );
          let subDep = decodeURI(
            response.headers["freelog-article-sub-dependencies"]
          );
          subDep = subDep ? JSON.parse(decodeURIComponent(subDep)) : [];

          let exhibitProperty = decodeURI(
            response.headers["freelog-exhibit-property"]
          );
          exhibitProperty = exhibitProperty
            ? JSON.parse(decodeURIComponent(exhibitProperty))
            : {};
          if (
            noAuthCode.includes(resData.authCode) &&
            (caller.exhibitId || caller.articleIdOrName)
          ) {
            // @ts-ignore
            baseInfo.setPresentableQueue(exhibitId, {
              widget: caller.name,
              authCode: resData.authCode,
              contracts: resData.data ? resData.data.contracts : [],
              policies: resData.data ? resData.data.policies : [],
              exhibitName,
              exhibitId,
              articleNid,
              resourceType,
              subDep,
              versionInfo: { exhibitProperty },
              ...resData,
            });
            resolve({
              authErrorType: 1, // 存在但未授权
              authCode: resData.authCode,
              exhibitName,
              exhibitId,
              articleNid,
              resourceType,
              subDep,
              versionInfo: { exhibitProperty },
              ...resData,
            });
          } else if (errorAuthCode.includes(resData.authCode)) {
            resolve({
              authErrorType: 2,
              authCode: resData.authCode,
              exhibitName,
              exhibitId,
              articleNid,
              resourceType,
              subDep,
              versionInfo: { exhibitProperty },
              ...resData,
            });
          } else {
            resolve(response);
          }
        } else {
          resolve(response);
        }
      })
      .catch((error) => {
        // 防止error为空
        reject({ error });
      });
  });
}
