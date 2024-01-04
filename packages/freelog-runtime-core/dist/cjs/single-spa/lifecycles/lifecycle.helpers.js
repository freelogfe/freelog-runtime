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

// src/single-spa/lifecycles/lifecycle.helpers.js
var lifecycle_helpers_exports = {};
__export(lifecycle_helpers_exports, {
  flattenFnArray: () => flattenFnArray,
  smellsLikeAPromise: () => smellsLikeAPromise,
  validLifecycleFn: () => validLifecycleFn
});
module.exports = __toCommonJS(lifecycle_helpers_exports);
var import_find = require("../utils/find.js");
var import_app_helpers = require("../applications/app.helpers.js");
var import_app_errors = require("../applications/app-errors.js");
function validLifecycleFn(fn) {
  return fn && (typeof fn === "function" || isArrayOfFns(fn));
  function isArrayOfFns(arr) {
    return Array.isArray(arr) && !(0, import_find.find)(arr, (item) => typeof item !== "function");
  }
}
function flattenFnArray(appOrParcel, lifecycle) {
  let fns = appOrParcel[lifecycle] || [];
  fns = Array.isArray(fns) ? fns : [fns];
  if (fns.length === 0) {
    fns = [() => Promise.resolve()];
  }
  const type = (0, import_app_helpers.objectType)(appOrParcel);
  const name = (0, import_app_helpers.toName)(appOrParcel);
  return function(props) {
    return fns.reduce((resultPromise, fn, index) => {
      return resultPromise.then(() => {
        const thisPromise = fn(props);
        return smellsLikeAPromise(thisPromise) ? thisPromise : Promise.reject(
          (0, import_app_errors.formatErrorMessage)(
            15,
            window.__DEV__ && `Within ${type} ${name}, the lifecycle function ${lifecycle} at array index ${index} did not return a promise`,
            type,
            name,
            lifecycle,
            index
          )
        );
      });
    }, Promise.resolve());
  };
}
function smellsLikeAPromise(promise) {
  return promise && typeof promise.then === "function" && typeof promise.catch === "function";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  flattenFnArray,
  smellsLikeAPromise,
  validLifecycleFn
});
