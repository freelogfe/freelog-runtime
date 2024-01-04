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

// src/single-spa/single-spa.js
var single_spa_exports = {};
__export(single_spa_exports, {
  BOOTSTRAPPING: () => import_app_helpers.BOOTSTRAPPING,
  LOADING_SOURCE_CODE: () => import_app_helpers.LOADING_SOURCE_CODE,
  LOAD_ERROR: () => import_app_helpers.LOAD_ERROR,
  MOUNTED: () => import_app_helpers.MOUNTED,
  MOUNTING: () => import_app_helpers.MOUNTING,
  NOT_BOOTSTRAPPED: () => import_app_helpers.NOT_BOOTSTRAPPED,
  NOT_LOADED: () => import_app_helpers.NOT_LOADED,
  NOT_MOUNTED: () => import_app_helpers.NOT_MOUNTED,
  SKIP_BECAUSE_BROKEN: () => import_app_helpers.SKIP_BECAUSE_BROKEN,
  UNMOUNTING: () => import_app_helpers.UNMOUNTING,
  UPDATING: () => import_app_helpers.UPDATING,
  addErrorHandler: () => import_app_errors.addErrorHandler,
  ensureJQuerySupport: () => import_jquery_support.ensureJQuerySupport,
  mountRootParcel: () => import_mount_parcel.mountRootParcel,
  removeErrorHandler: () => import_app_errors.removeErrorHandler,
  setBootstrapMaxTime: () => import_timeouts.setBootstrapMaxTime,
  setMountMaxTime: () => import_timeouts.setMountMaxTime,
  setUnloadMaxTime: () => import_timeouts.setUnloadMaxTime,
  setUnmountMaxTime: () => import_timeouts.setUnmountMaxTime
});
module.exports = __toCommonJS(single_spa_exports);
var import_devtools = __toESM(require("./devtools/devtools"));
var import_runtime_environment = require("./utils/runtime-environment.js");
var import_jquery_support = require("./jquery-support.js");
var import_timeouts = require("./applications/timeouts.js");
var import_app_errors = require("./applications/app-errors.js");
var import_mount_parcel = require("./parcels/mount-parcel.js");
var import_app_helpers = require("./applications/app.helpers.js");
window.__DEV__ = false;
if (import_runtime_environment.isInBrowser && window.__SINGLE_SPA_DEVTOOLS__) {
  window.__SINGLE_SPA_DEVTOOLS__.exposedMethods = import_devtools.default;
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
  UNMOUNTING,
  UPDATING,
  addErrorHandler,
  ensureJQuerySupport,
  mountRootParcel,
  removeErrorHandler,
  setBootstrapMaxTime,
  setMountMaxTime,
  setUnloadMaxTime,
  setUnmountMaxTime
});
