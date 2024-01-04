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

// src/errorHandler.ts
var errorHandler_exports = {};
__export(errorHandler_exports, {
  addErrorHandler: () => import_single_spa.addErrorHandler,
  addGlobalUncaughtErrorHandler: () => addGlobalUncaughtErrorHandler,
  removeErrorHandler: () => import_single_spa.removeErrorHandler,
  removeGlobalUncaughtErrorHandler: () => removeGlobalUncaughtErrorHandler
});
module.exports = __toCommonJS(errorHandler_exports);
var import_single_spa = require("./single-spa/single-spa");
function addGlobalUncaughtErrorHandler(errorHandler) {
  window.addEventListener("error", errorHandler);
  window.addEventListener("unhandledrejection", errorHandler);
}
function removeGlobalUncaughtErrorHandler(errorHandler) {
  window.removeEventListener("error", errorHandler);
  window.removeEventListener("unhandledrejection", errorHandler);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addErrorHandler,
  addGlobalUncaughtErrorHandler,
  removeErrorHandler,
  removeGlobalUncaughtErrorHandler
});
