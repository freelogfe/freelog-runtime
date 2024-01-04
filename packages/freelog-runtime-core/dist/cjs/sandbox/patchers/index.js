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

// src/sandbox/patchers/index.ts
var patchers_exports = {};
__export(patchers_exports, {
  css: () => css,
  patchAtBootstrapping: () => patchAtBootstrapping,
  patchAtMounting: () => patchAtMounting
});
module.exports = __toCommonJS(patchers_exports);
var import_interfaces = require("../../interfaces");
var css = __toESM(require("./css"));
var import_dynamicAppend = require("./dynamicAppend");
var import_historyListener = __toESM(require("./historyListener"));
var import_interval = __toESM(require("./interval"));
var import_windowListener = __toESM(require("./windowListener"));
function patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter) {
  var _a;
  const basePatchers = [
    () => (0, import_interval.default)(sandbox.proxy),
    () => (0, import_windowListener.default)(sandbox.proxy),
    () => (0, import_historyListener.default)()
  ];
  const patchersInSandbox = {
    [import_interfaces.SandBoxType.Proxy]: [
      ...basePatchers,
      () => (0, import_dynamicAppend.patchStrictSandbox)(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter)
    ]
  };
  return (_a = patchersInSandbox[sandbox.type]) == null ? void 0 : _a.map((patch) => patch());
}
function patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter) {
  var _a;
  const patchersInSandbox = {
    [import_interfaces.SandBoxType.Proxy]: [
      () => (0, import_dynamicAppend.patchStrictSandbox)(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter)
    ]
  };
  return (_a = patchersInSandbox[sandbox.type]) == null ? void 0 : _a.map((patch) => patch());
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  css,
  patchAtBootstrapping,
  patchAtMounting
});
