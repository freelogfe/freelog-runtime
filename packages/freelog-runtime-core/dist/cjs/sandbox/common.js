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

// src/sandbox/common.ts
var common_exports = {};
__export(common_exports, {
  getCurrentRunningSandboxProxy: () => getCurrentRunningSandboxProxy,
  getProxyPropertyValue: () => getProxyPropertyValue,
  getTargetValue: () => getTargetValue,
  setCurrentRunningSandboxProxy: () => setCurrentRunningSandboxProxy
});
module.exports = __toCommonJS(common_exports);
var import_utils = require("../utils");
var currentRunningSandboxProxy;
function getCurrentRunningSandboxProxy() {
  return currentRunningSandboxProxy;
}
function setCurrentRunningSandboxProxy(proxy) {
  currentRunningSandboxProxy = proxy;
}
var functionBoundedValueMap = /* @__PURE__ */ new WeakMap();
function getTargetValue(target, value) {
  const cachedBoundFunction = functionBoundedValueMap.get(value);
  if (cachedBoundFunction) {
    return cachedBoundFunction;
  }
  if ((0, import_utils.isCallable)(value) && !(0, import_utils.isBoundedFunction)(value) && !(0, import_utils.isConstructable)(value)) {
    const boundValue = Function.prototype.bind.call(value, target);
    for (const key in value) {
      boundValue[key] = value[key];
    }
    if (value.hasOwnProperty("prototype") && !boundValue.hasOwnProperty("prototype"))
      boundValue.prototype = value.prototype;
    functionBoundedValueMap.set(value, boundValue);
    return boundValue;
  }
  return value;
}
var getterInvocationResultMap = /* @__PURE__ */ new WeakMap();
function getProxyPropertyValue(getter) {
  const getterResult = getterInvocationResultMap.get(getter);
  if (!getterResult) {
    const result = getter();
    getterInvocationResultMap.set(getter, result);
    return result;
  }
  return getterResult;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCurrentRunningSandboxProxy,
  getProxyPropertyValue,
  getTargetValue,
  setCurrentRunningSandboxProxy
});
