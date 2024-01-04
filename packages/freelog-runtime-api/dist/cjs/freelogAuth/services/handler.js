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

// src/freelogAuth/services/handler.ts
var handler_exports = {};
__export(handler_exports, {
  default: () => frequest
});
module.exports = __toCommonJS(handler_exports);
var import_request = __toESM(require("../../request"));
var import_base = require("./base");
var import_utils = require("../../utils/utils");
function frequest(action, urlData, data, returnUrl, config) {
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
  if (api.dataModel) {
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
        query = query + "&" + key + "=" + _api.params[key];
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
      resolve(response);
    }).catch((error) => {
      reject({ error });
      if (typeof error === "string") {
      } else {
      }
    });
  });
}
