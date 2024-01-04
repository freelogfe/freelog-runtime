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

// src/sandbox/index.ts
var sandbox_exports = {};
__export(sandbox_exports, {
  createSandboxContainer: () => createSandboxContainer,
  css: () => import_patchers2.css
});
module.exports = __toCommonJS(sandbox_exports);
var import_patchers = require("./patchers");
var import_proxySandbox = __toESM(require("./proxySandbox"));
var import_patchers2 = require("./patchers");
function createSandboxContainer(appName, elementGetter, scopedCSS, useLooseSandbox, excludeAssetFilter, proxyHooks) {
  let sandbox;
  sandbox = new import_proxySandbox.default(appName, proxyHooks);
  const bootstrappingFreers = (0, import_patchers.patchAtBootstrapping)(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter);
  let mountingFreers = [];
  let sideEffectsRebuilders = [];
  return {
    instance: sandbox,
    /**
     * 沙箱被 mount
     * 可能是从 bootstrap 状态进入的 mount
     * 也可能是从 unmount 之后再次唤醒进入 mount
     */
    async mount() {
      sandbox.active();
      const sideEffectsRebuildersAtBootstrapping = sideEffectsRebuilders.slice(0, bootstrappingFreers.length);
      const sideEffectsRebuildersAtMounting = sideEffectsRebuilders.slice(bootstrappingFreers.length);
      if (sideEffectsRebuildersAtBootstrapping.length) {
        sideEffectsRebuildersAtBootstrapping.forEach((rebuild) => rebuild());
      }
      mountingFreers = (0, import_patchers.patchAtMounting)(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter);
      if (sideEffectsRebuildersAtMounting.length) {
        sideEffectsRebuildersAtMounting.forEach((rebuild) => rebuild());
      }
      sideEffectsRebuilders = [];
    },
    /**
     * 恢复 global 状态，使其能回到应用加载之前的状态
     */
    async unmount() {
      sideEffectsRebuilders = [...bootstrappingFreers, ...mountingFreers].map((free) => free());
      sandbox.inactive();
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createSandboxContainer,
  css
});
