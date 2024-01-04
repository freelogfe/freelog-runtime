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

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  Deferred: () => Deferred,
  getContainer: () => getContainer,
  getDefaultTplWrapper: () => getDefaultTplWrapper,
  getWrapperId: () => getWrapperId,
  getXPathForElement: () => getXPathForElement,
  isBoundedFunction: () => isBoundedFunction,
  isCallable: () => isCallable,
  isConstructable: () => isConstructable,
  isEnableScopedCSS: () => isEnableScopedCSS,
  nextTick: () => nextTick,
  performanceGetEntriesByName: () => performanceGetEntriesByName,
  performanceMark: () => performanceMark,
  performanceMeasure: () => performanceMeasure,
  sleep: () => sleep,
  toArray: () => toArray,
  validateExportLifecycle: () => validateExportLifecycle
});
module.exports = __toCommonJS(utils_exports);
var import_lodash_es = require("lodash-es");
function toArray(array) {
  return Array.isArray(array) ? array : [array];
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function nextTick(cb) {
  Promise.resolve().then(cb);
}
var constructableMap = /* @__PURE__ */ new WeakMap();
function isConstructable(fn) {
  if (constructableMap.has(fn)) {
    return constructableMap.get(fn);
  }
  const constructableFunctionRegex = /^function\b\s[A-Z].*/;
  const classRegex = /^class\b/;
  const constructable = fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1 || constructableFunctionRegex.test(fn.toString()) || classRegex.test(fn.toString());
  constructableMap.set(fn, constructable);
  return constructable;
}
var naughtySafari = typeof document.all === "function" && typeof document.all === "undefined";
var isCallable = naughtySafari ? (fn) => typeof fn === "function" && typeof fn !== "undefined" : (fn) => typeof fn === "function";
var boundedMap = /* @__PURE__ */ new WeakMap();
function isBoundedFunction(fn) {
  if (boundedMap.has(fn)) {
    return boundedMap.get(fn);
  }
  const bounded = fn.name.indexOf("bound ") === 0 && !fn.hasOwnProperty("prototype");
  boundedMap.set(fn, bounded);
  return bounded;
}
function getDefaultTplWrapper(id, name) {
  return (tpl) => `<div id="${getWrapperId(id)}" data-name="${name}">${tpl}</div>`;
}
function getWrapperId(id) {
  return `__freelog_microapp_wrapper_for_${(0, import_lodash_es.snakeCase)(id)}__`;
}
function validateExportLifecycle(exports) {
  const { bootstrap, mount, unmount } = exports ?? {};
  return (0, import_lodash_es.isFunction)(bootstrap) && (0, import_lodash_es.isFunction)(mount) && (0, import_lodash_es.isFunction)(unmount);
}
var Deferred = class {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
};
var supportsUserTiming = typeof performance !== "undefined" && typeof performance.mark === "function" && typeof performance.clearMarks === "function" && typeof performance.measure === "function" && typeof performance.clearMeasures === "function" && typeof performance.getEntriesByName === "function";
function performanceGetEntriesByName(markName, type) {
  let marks = null;
  if (supportsUserTiming) {
    marks = performance.getEntriesByName(markName, type);
  }
  return marks;
}
function performanceMark(markName) {
  if (supportsUserTiming) {
    performance.mark(markName);
  }
}
function performanceMeasure(measureName, markName) {
  if (supportsUserTiming && performance.getEntriesByName(markName, "mark").length) {
    performance.measure(measureName, markName);
    performance.clearMarks(markName);
    performance.clearMeasures(measureName);
  }
}
function isEnableScopedCSS(sandbox) {
  if (typeof sandbox !== "object") {
    return false;
  }
  if (sandbox.strictStyleIsolation) {
    return false;
  }
  return !!sandbox.experimentalStyleIsolation;
}
function getXPathForElement(el, document2) {
  if (!document2.body.contains(el)) {
    return void 0;
  }
  let xpath = "";
  let pos;
  let tmpEle;
  let element = el;
  while (element !== document2.documentElement) {
    pos = 0;
    tmpEle = element;
    while (tmpEle) {
      if (tmpEle.nodeType === 1 && tmpEle.nodeName === element.nodeName) {
        pos += 1;
      }
      tmpEle = tmpEle.previousSibling;
    }
    xpath = `*[name()='${element.nodeName}' and namespace-uri()='${element.namespaceURI === null ? "" : element.namespaceURI}'][${pos}]/${xpath}`;
    element = element.parentNode;
  }
  xpath = `/*[name()='${document2.documentElement.nodeName}' and namespace-uri()='${element.namespaceURI === null ? "" : element.namespaceURI}']/${xpath}`;
  xpath = xpath.replace(/\/$/, "");
  return xpath;
}
function getContainer(container) {
  return typeof container === "string" ? document.querySelector.bind(document)(container) : container;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Deferred,
  getContainer,
  getDefaultTplWrapper,
  getWrapperId,
  getXPathForElement,
  isBoundedFunction,
  isCallable,
  isConstructable,
  isEnableScopedCSS,
  nextTick,
  performanceGetEntriesByName,
  performanceMark,
  performanceMeasure,
  sleep,
  toArray,
  validateExportLifecycle
});
