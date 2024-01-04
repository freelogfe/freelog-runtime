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

// src/base/index.ts
var base_exports = {};
__export(base_exports, {
  baseInit: () => baseInit,
  getCurrentUser: () => getCurrentUser,
  getInfoByNameOrDomain: () => getInfoByNameOrDomain,
  getUserData: () => getUserData,
  init: () => init,
  putUserData: () => putUserData
});
module.exports = __toCommonJS(base_exports);
var import_baseInfo = require("./baseInfo");
var import_handler = __toESM(require("./services/handler"));
var import_user = __toESM(require("./services/api/modules/user"));
var import_node = __toESM(require("./services/api/modules/node"));
async function getCurrentUser() {
  return (0, import_handler.default)(import_user.default.getCurrent, "", "");
}
async function putUserData(urlData, query) {
  return (0, import_handler.default)(import_node.default.putUserData, urlData, query);
}
async function getUserData(urlData) {
  return (0, import_handler.default)(import_node.default.getUserData, urlData, "");
}
async function getInfoByNameOrDomain(query) {
  return (0, import_handler.default)(import_node.default.getInfoByNameOrDomain, "", query);
}
function init(fnodeId, setPresentableQueue) {
  import_baseInfo.baseInfo.nodeId = fnodeId;
  import_baseInfo.baseInfo.setPresentableQueue = setPresentableQueue;
}
function baseInit(baseURL, isTest) {
  import_baseInfo.baseInfo.isTest = isTest;
  import_baseInfo.baseInfo.baseURL = baseURL;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  baseInit,
  getCurrentUser,
  getInfoByNameOrDomain,
  getUserData,
  init,
  putUserData
});
