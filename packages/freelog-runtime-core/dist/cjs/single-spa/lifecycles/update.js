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

// src/single-spa/lifecycles/update.js
var update_exports = {};
__export(update_exports, {
  toUpdatePromise: () => toUpdatePromise
});
module.exports = __toCommonJS(update_exports);
var import_app_helpers = require("../applications/app.helpers.js");
var import_app_errors = require("../applications/app-errors.js");
var import_timeouts = require("../applications/timeouts.js");
function toUpdatePromise(parcel) {
  return Promise.resolve().then(() => {
    if (parcel.status !== import_app_helpers.MOUNTED) {
      throw Error(
        (0, import_app_errors.formatErrorMessage)(
          32,
          window.__DEV__ && `Cannot update parcel '${(0, import_app_helpers.toName)(
            parcel
          )}' because it is not mounted`,
          (0, import_app_helpers.toName)(parcel)
        )
      );
    }
    parcel.status = import_app_helpers.UPDATING;
    return (0, import_timeouts.reasonableTime)(parcel, "update").then(() => {
      parcel.status = import_app_helpers.MOUNTED;
      return parcel;
    }).catch((err) => {
      throw (0, import_app_errors.transformErr)(err, parcel, import_app_helpers.SKIP_BECAUSE_BROKEN);
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  toUpdatePromise
});
