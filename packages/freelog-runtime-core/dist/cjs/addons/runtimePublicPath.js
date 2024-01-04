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

// src/addons/runtimePublicPath.ts
var runtimePublicPath_exports = {};
__export(runtimePublicPath_exports, {
  default: () => getAddOn
});
module.exports = __toCommonJS(runtimePublicPath_exports);
var rawPublicPath = window.__INJECTED_PUBLIC_PATH_BY_FREELOG__;
function getAddOn(global, publicPath = "/") {
  let hasMountedOnce = false;
  return {
    async beforeLoad() {
      global.__INJECTED_PUBLIC_PATH_BY_FREELOG__ = publicPath;
    },
    async beforeMount() {
      if (hasMountedOnce) {
        global.__INJECTED_PUBLIC_PATH_BY_FREELOG__ = publicPath;
      }
    },
    async beforeUnmount() {
      if (rawPublicPath === void 0) {
        delete global.__INJECTED_PUBLIC_PATH_BY_FREELOG__;
      } else {
        global.__INJECTED_PUBLIC_PATH_BY_FREELOG__ = rawPublicPath;
      }
      hasMountedOnce = true;
    }
  };
}
