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

// src/single-spa/devtools/devtools.js
var devtools_exports = {};
__export(devtools_exports, {
  default: () => devtools_default
});
module.exports = __toCommonJS(devtools_exports);
var import_app = require("../applications/app.helpers");
var import_load = require("../lifecycles/load");
var import_bootstrap = require("../lifecycles/bootstrap");
var devtools_default = {
  NOT_LOADED: import_app.NOT_LOADED,
  toLoadPromise: import_load.toLoadPromise,
  toBootstrapPromise: import_bootstrap.toBootstrapPromise
};
