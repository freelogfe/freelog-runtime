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

// src/freelogApp/index.ts
var freelogApp_exports = {};
__export(freelogApp_exports, {
  freelogApp: () => freelogApp
});
module.exports = __toCommonJS(freelogApp_exports);
var import_api = require("./api");
var freelogApp = {
  pushMessage4Task: import_api.pushMessage4Task,
  getExhibitListById: import_api.getExhibitListById,
  getExhibitListByPaging: import_api.getExhibitListByPaging,
  getExhibitInfo: import_api.getExhibitInfo,
  getExhibitSignCount: import_api.getExhibitSignCount,
  getExhibitAuthStatus: import_api.getExhibitAuthStatus,
  getExhibitFileStream: import_api.getExhibitFileStream,
  getExhibitDepFileStream: import_api.getExhibitDepFileStream,
  getExhibitInfoByAuth: import_api.getExhibitInfoByAuth,
  getExhibitDepInfo: import_api.getExhibitDepInfo,
  getExhibitDepTree: import_api.getExhibitDepTree,
  getSignStatistics: import_api.getSignStatistics,
  getExhibitAvailalbe: import_api.getExhibitAvailalbe
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  freelogApp
});
