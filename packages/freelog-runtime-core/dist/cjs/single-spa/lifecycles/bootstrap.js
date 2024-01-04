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

// src/single-spa/lifecycles/bootstrap.js
var bootstrap_exports = {};
__export(bootstrap_exports, {
  toBootstrapPromise: () => toBootstrapPromise
});
module.exports = __toCommonJS(bootstrap_exports);
var import_app_helpers = require("../applications/app.helpers.js");
var import_timeouts = require("../applications/timeouts.js");
var import_app_errors = require("../applications/app-errors.js");
function toBootstrapPromise(appOrParcel, hardFail) {
  return Promise.resolve().then(() => {
    if (appOrParcel.status !== import_app_helpers.NOT_BOOTSTRAPPED) {
      return appOrParcel;
    }
    appOrParcel.status = import_app_helpers.BOOTSTRAPPING;
    if (!appOrParcel.bootstrap) {
      return Promise.resolve().then(successfulBootstrap);
    }
    return (0, import_timeouts.reasonableTime)(appOrParcel, "bootstrap").then(successfulBootstrap).catch((err) => {
      if (hardFail) {
        throw (0, import_app_errors.transformErr)(err, appOrParcel, import_app_helpers.SKIP_BECAUSE_BROKEN);
      } else {
        (0, import_app_errors.handleAppError)(err, appOrParcel, import_app_helpers.SKIP_BECAUSE_BROKEN);
        return appOrParcel;
      }
    });
  });
  function successfulBootstrap() {
    appOrParcel.status = import_app_helpers.NOT_MOUNTED;
    return appOrParcel;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  toBootstrapPromise
});
