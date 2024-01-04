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

// src/single-spa/applications/app.helpers.js
var app_helpers_exports = {};
__export(app_helpers_exports, {
  BOOTSTRAPPING: () => BOOTSTRAPPING,
  LOADING_SOURCE_CODE: () => LOADING_SOURCE_CODE,
  LOAD_ERROR: () => LOAD_ERROR,
  MOUNTED: () => MOUNTED,
  MOUNTING: () => MOUNTING,
  NOT_BOOTSTRAPPED: () => NOT_BOOTSTRAPPED,
  NOT_LOADED: () => NOT_LOADED,
  NOT_MOUNTED: () => NOT_MOUNTED,
  SKIP_BECAUSE_BROKEN: () => SKIP_BECAUSE_BROKEN,
  UNLOADING: () => UNLOADING,
  UNMOUNTING: () => UNMOUNTING,
  UPDATING: () => UPDATING,
  isActive: () => isActive,
  isParcel: () => isParcel,
  objectType: () => objectType,
  shouldBeActive: () => shouldBeActive,
  toName: () => toName
});
module.exports = __toCommonJS(app_helpers_exports);
var import_app_errors = require("./app-errors.js");
var NOT_LOADED = "NOT_LOADED";
var LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE";
var NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED";
var BOOTSTRAPPING = "BOOTSTRAPPING";
var NOT_MOUNTED = "NOT_MOUNTED";
var MOUNTING = "MOUNTING";
var MOUNTED = "MOUNTED";
var UPDATING = "UPDATING";
var UNMOUNTING = "UNMOUNTING";
var UNLOADING = "UNLOADING";
var LOAD_ERROR = "LOAD_ERROR";
var SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN";
function isActive(app) {
  return app.status === MOUNTED;
}
function shouldBeActive(app) {
  try {
    return app.activeWhen(window.location);
  } catch (err) {
    (0, import_app_errors.handleAppError)(err, app, SKIP_BECAUSE_BROKEN);
    return false;
  }
}
function toName(app) {
  return app.name;
}
function isParcel(appOrParcel) {
  return Boolean(appOrParcel.unmountThisParcel);
}
function objectType(appOrParcel) {
  return isParcel(appOrParcel) ? "parcel" : "application";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BOOTSTRAPPING,
  LOADING_SOURCE_CODE,
  LOAD_ERROR,
  MOUNTED,
  MOUNTING,
  NOT_BOOTSTRAPPED,
  NOT_LOADED,
  NOT_MOUNTED,
  SKIP_BECAUSE_BROKEN,
  UNLOADING,
  UNMOUNTING,
  UPDATING,
  isActive,
  isParcel,
  objectType,
  shouldBeActive,
  toName
});
