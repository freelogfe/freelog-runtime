var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  baseInit: () => import_base.baseInit,
  baseURL: () => baseURL,
  freelogApp: () => import_freelogApp.freelogApp,
  freelogAuthApi: () => import_freelogAuth.freelogAuthApi,
  getCurrentUser: () => import_base.getCurrentUser,
  getInfoByNameOrDomain: () => import_base.getInfoByNameOrDomain,
  getUserData: () => import_base.getUserData,
  init: () => import_base.init,
  isTest: () => isTest,
  putUserData: () => import_base.putUserData
});
module.exports = __toCommonJS(src_exports);
var import_baseInfo = require("./base/baseInfo");
var import_freelogApp = require("./freelogApp");
var import_freelogAuth = require("./freelogAuth");
var import_base = require("./base");
var baseURL = import_baseInfo.baseInfo.baseURL;
var isTest = import_baseInfo.baseInfo.isTest;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  baseInit,
  baseURL,
  freelogApp,
  freelogAuthApi,
  getCurrentUser,
  getInfoByNameOrDomain,
  getUserData,
  init,
  isTest,
  putUserData
});
