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

// src/addons/engineFlag.ts
var engineFlag_exports = {};
__export(engineFlag_exports, {
  default: () => getAddOn
});
module.exports = __toCommonJS(engineFlag_exports);
function getAddOn(global) {
  return {
    async beforeLoad() {
      global.__POWERED_BY_FREELOG__ = true;
    },
    async beforeMount() {
      global.__POWERED_BY_FREELOG__ = true;
    },
    async beforeUnmount() {
      delete global.__POWERED_BY_FREELOG__;
    }
  };
}
