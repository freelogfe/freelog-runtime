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

// src/single-spa/lifecycles/mount.js
var mount_exports = {};
__export(mount_exports, {
  toMountPromise: () => toMountPromise
});
module.exports = __toCommonJS(mount_exports);
var import_app_helpers = require("../applications/app.helpers.js");
var import_app_errors = require("../applications/app-errors.js");
var import_timeouts = require("../applications/timeouts.js");
var import_custom_event = __toESM(require("custom-event"));
var import_unmount = require("./unmount.js");
var beforeFirstMountFired = false;
var firstMountFired = false;
function toMountPromise(appOrParcel, hardFail) {
  return Promise.resolve().then(() => {
    if (appOrParcel.status !== import_app_helpers.NOT_MOUNTED) {
      return appOrParcel;
    }
    if (!beforeFirstMountFired) {
      window.dispatchEvent(new import_custom_event.default("single-spa:before-first-mount"));
      beforeFirstMountFired = true;
    }
    return (0, import_timeouts.reasonableTime)(appOrParcel, "mount").then(() => {
      appOrParcel.status = import_app_helpers.MOUNTED;
      if (!firstMountFired) {
        window.dispatchEvent(new import_custom_event.default("single-spa:first-mount"));
        firstMountFired = true;
      }
      return appOrParcel;
    }).catch((err) => {
      appOrParcel.status = import_app_helpers.MOUNTED;
      return (0, import_unmount.toUnmountPromise)(appOrParcel, true).then(
        setSkipBecauseBroken,
        setSkipBecauseBroken
      );
      function setSkipBecauseBroken() {
        if (!hardFail) {
          (0, import_app_errors.handleAppError)(err, appOrParcel, import_app_helpers.SKIP_BECAUSE_BROKEN);
          return appOrParcel;
        } else {
          throw (0, import_app_errors.transformErr)(err, appOrParcel, import_app_helpers.SKIP_BECAUSE_BROKEN);
        }
      }
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  toMountPromise
});
