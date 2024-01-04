var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/freelogApp/services/handler.ts
var handler_exports = {};
__export(handler_exports, {
  default: () => frequest,
  nativeOpen: () => nativeOpen
});
module.exports = __toCommonJS(handler_exports);
var import_request = __toESM(require("../../request"));
var import_base = require("./base");
var import_utils = require("../../utils/utils");
var import_baseInfo = require("../../base/baseInfo");
var noAuthCode = [301, 302, 303, 304, 305, 306, 307];
var errorAuthCode = [401, 402, 403, 501, 502, 503, 504, 505, 900, 901];
var nativeOpen = XMLHttpRequest.prototype.open;
function frequest(action, urlData, data, returnUrl, config) {
  XMLHttpRequest.prototype.open = nativeOpen;
  const caller = this;
  let api = Object.assign({}, action);
  let url = api.url;
  if (url.indexOf(import_base.placeHolder) > -1) {
    if (!urlData || !urlData.length) {
      console.error("urlData is required: " + urlData);
      return;
    }
    urlData.forEach((item) => {
      url = url.replace(import_base.placeHolder, item + "");
    });
  }
  if (api.dataModel && caller) {
    data = Object.assign({}, data);
    (0, import_utils.compareObjects)(api.dataModel, data, !!api.isDiff);
  }
  if (api.before) {
    data = api.before(data) || data;
  }
  if (api.method.toLowerCase() === "get") {
    api.params = data;
  } else {
    api.data = data;
  }
  ["url", "before", "after"].forEach((item) => {
    delete api[item];
  });
  let _config = {};
  if (config) {
    ["onUploadProgress", "onDownloadProgress", "responseType"].forEach(
      (key) => {
        if (config[key])
          _config[key] = config[key];
      }
    );
  }
  let _api = Object.assign(_config, import_base.baseConfig, api);
  if (returnUrl && _api.method.toLowerCase() === "get") {
    let query = "";
    if (_api.params) {
      Object.keys(_api.params).forEach((key) => {
        query = query ? query + "&" + key + "=" + _api.params[key] : key + "=" + _api.params[key];
      });
    }
    if (query) {
      query = "?" + query;
    }
    return _api.baseURL + url + query;
  }
  return new Promise((resolve, reject) => {
    (0, import_request.default)(url, _api).then(async (response) => {
      api.after && api.after(response);
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
        exhibitProperty = exhibitProperty ? JSON.parse(decodeURIComponent(exhibitProperty)) : {};
        if (noAuthCode.includes(resData.authCode) && (caller.exhibitId || caller.articleIdOrName)) {
          import_baseInfo.baseInfo.setPresentableQueue(exhibitId, {
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
            ...resData
          });
          resolve({
            authErrorType: 1,
            // 存在但未授权
            authCode: resData.authCode,
            exhibitName,
            exhibitId,
            articleNid,
            resourceType,
            subDep,
            versionInfo: { exhibitProperty },
            ...resData
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
            ...resData
          });
        } else {
          resolve(response);
        }
      } else {
        resolve(response);
      }
    }).catch((error) => {
      reject({ error });
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  nativeOpen
});
