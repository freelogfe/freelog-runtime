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

// src/single-spa/lifecycles/prop.helpers.js
var prop_helpers_exports = {};
__export(prop_helpers_exports, {
  getProps: () => getProps
});
module.exports = __toCommonJS(prop_helpers_exports);
var singleSpa = __toESM(require("../single-spa.js"));
var import_mount_parcel = require("../parcels/mount-parcel.js");
var import_assign = require("../utils/assign.js");
var import_app_helpers = require("../applications/app.helpers.js");
var import_app_errors = require("../applications/app-errors.js");
function getProps(appOrParcel) {
  const name = (0, import_app_helpers.toName)(appOrParcel);
  let customProps = typeof appOrParcel.customProps === "function" ? appOrParcel.customProps(name, window.location) : appOrParcel.customProps;
  if (typeof customProps !== "object" || customProps === null || Array.isArray(customProps)) {
    customProps = {};
    console.warn(
      (0, import_app_errors.formatErrorMessage)(
        40,
        window.__DEV__ && `single-spa: ${name}'s customProps function must return an object. Received ${customProps}`
      ),
      name,
      customProps
    );
  }
  const result = (0, import_assign.assign)({}, customProps, {
    name,
    mountParcel: import_mount_parcel.mountParcel.bind(appOrParcel),
    singleSpa
  });
  if ((0, import_app_helpers.isParcel)(appOrParcel)) {
    result.unmountSelf = appOrParcel.unmountThisParcel;
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getProps
});
