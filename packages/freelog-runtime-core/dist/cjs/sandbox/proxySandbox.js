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

// src/sandbox/proxySandbox.ts
var proxySandbox_exports = {};
__export(proxySandbox_exports, {
  default: () => ProxySandbox
});
module.exports = __toCommonJS(proxySandbox_exports);
var import_interfaces = require("../interfaces");
var import_utils = require("../utils");
var import_common = require("./common");
function uniq(array) {
  return array.filter(function filter(element) {
    return element in this ? false : this[element] = true;
  }, /* @__PURE__ */ Object.create(null));
}
var rawObjectDefineProperty = Object.defineProperty;
var variableWhiteListInDev = process.env.NODE_ENV === "development" || window.__FREELOG_DEVELOPMENT__ ? [
  // for react hot reload
  // see https://github.com/facebook/create-react-app/blob/66bf7dfc43350249e2f09d138a20840dae8a0a4a/packages/react-error-overlay/src/index.js#L180
  "__REACT_ERROR_OVERLAY_GLOBAL_HOOK__"
] : [];
var variableWhiteList = [
  // FIXME System.js used a indirect call with eval, which would make it scope escape to global
  // To make System.js works well, we write it back to global window temporary
  // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/evaluate.js#L106
  "System",
  // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/instantiate.js#L357
  "__cjsWrapper",
  ...variableWhiteListInDev
];
var unscopables = {
  undefined: true,
  Array: true,
  Object: true,
  String: true,
  Boolean: true,
  Math: true,
  Number: true,
  Symbol: true,
  parseFloat: true,
  Float32Array: true
};
function createFakeWindow(global) {
  const propertiesWithGetter = /* @__PURE__ */ new Map();
  const fakeWindow = {};
  Object.getOwnPropertyNames(global).filter((p) => {
    const descriptor = Object.getOwnPropertyDescriptor(global, p);
    return !(descriptor == null ? void 0 : descriptor.configurable);
  }).forEach((p) => {
    const descriptor = Object.getOwnPropertyDescriptor(global, p);
    if (descriptor) {
      const hasGetter = Object.prototype.hasOwnProperty.call(
        descriptor,
        "get"
      );
      if (p === "top" || p === "parent" || p === "self" || p === "window" || process.env.NODE_ENV === "test" && (p === "mockTop" || p === "mockSafariTop")) {
        descriptor.configurable = true;
        if (!hasGetter) {
          descriptor.writable = true;
        }
      }
      if (hasGetter)
        propertiesWithGetter.set(p, true);
      rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
    }
  });
  return {
    fakeWindow,
    propertiesWithGetter
  };
}
var activeSandboxCount = 0;
var ProxySandbox = class {
  constructor(name, proxyHooks) {
    /** window 值变更记录 */
    this.updatedValueSet = /* @__PURE__ */ new Set();
    this.sandboxRunning = true;
    this.latestSetProp = null;
    this.name = name;
    this.type = import_interfaces.SandBoxType.Proxy;
    const { updatedValueSet } = this;
    const rawWindow = window;
    const { fakeWindow, propertiesWithGetter } = createFakeWindow(rawWindow);
    const descriptorTargetMap = /* @__PURE__ */ new Map();
    const hasOwnProperty = (key) => fakeWindow.hasOwnProperty(key) || rawWindow.hasOwnProperty(key);
    let _this = this;
    const proxy = new Proxy(fakeWindow, {
      set: (target, p, value) => {
        if (p === "freelogApp" || p === "freelogAuth")
          return false;
        if (this.sandboxRunning) {
          const hook = proxyHooks.setHooks.get(p);
          if (hook) {
            if (typeof hook === "function") {
              return hook(name, _this, proxy, target);
            }
            return hook;
          }
          if (!target.hasOwnProperty(p) && rawWindow.hasOwnProperty(p)) {
            const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
            const { writable, configurable, enumerable } = descriptor;
            if (writable) {
              Object.defineProperty(target, p, {
                configurable,
                enumerable,
                writable,
                value
              });
            }
          } else {
            target[p] = value;
          }
          if (variableWhiteList.indexOf(p) !== -1) {
            rawWindow[p] = value;
          }
          updatedValueSet.add(p);
          this.latestSetProp = p;
          return true;
        }
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[freelog] Set window.${p.toString()} while sandbox destroyed or inactive in ${name}!`
          );
        }
        return true;
      },
      get(target, p, receiver) {
        const hook = proxyHooks.getHooks.get(p);
        if (hook) {
          if (typeof hook === "function") {
            if (p === "document") {
              (0, import_common.setCurrentRunningSandboxProxy)(proxy);
              (0, import_utils.nextTick)(function() {
                return (0, import_common.setCurrentRunningSandboxProxy)(null);
              });
            }
            return hook(name, _this);
          }
          return hook;
        }
        if (p === Symbol.unscopables)
          return unscopables;
        if (p === "window" || p === "self") {
          return proxy;
        }
        if (p === "globalThis") {
          return proxy;
        }
        if (p === "top" || p === "parent" || process.env.NODE_ENV === "test" && (p === "mockTop" || p === "mockSafariTop")) {
          if (rawWindow === rawWindow.parent) {
            return proxy;
          }
          return rawWindow[p];
        }
        if (p === "hasOwnProperty") {
          return hasOwnProperty;
        }
        if (p === "widgetName") {
          return name;
        }
        if (p === "document" || p === "eval") {
          (0, import_common.setCurrentRunningSandboxProxy)(proxy);
          (0, import_utils.nextTick)(function() {
            return (0, import_common.setCurrentRunningSandboxProxy)(null);
          });
          switch (p) {
            case "eval":
              return eval;
          }
        }
        const value = propertiesWithGetter.has(p) ? rawWindow[p] : p in target ? target[p] : rawWindow[p];
        return (0, import_common.getTargetValue)(rawWindow, value);
      },
      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has(target, p) {
        return p in unscopables || p in target || p in rawWindow;
      },
      getOwnPropertyDescriptor(target, p) {
        if (target.hasOwnProperty(p)) {
          const descriptor = Object.getOwnPropertyDescriptor(target, p);
          descriptorTargetMap.set(p, "target");
          return descriptor;
        }
        if (rawWindow.hasOwnProperty(p)) {
          const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
          descriptorTargetMap.set(p, "rawWindow");
          if (descriptor && !descriptor.configurable) {
            descriptor.configurable = true;
          }
          return descriptor;
        }
        return void 0;
      },
      // trap to support iterator with sandbox
      // @ts-ignore
      ownKeys(target) {
        const keys = uniq(
          Reflect.ownKeys(rawWindow).concat(Reflect.ownKeys(target))
        );
        return keys;
      },
      defineProperty(target, p, attributes) {
        const from = descriptorTargetMap.get(p);
        switch (from) {
          case "rawWindow":
            return Reflect.defineProperty(rawWindow, p, attributes);
          default:
            return Reflect.defineProperty(target, p, attributes);
        }
      },
      deleteProperty(target, p) {
        if (target.hasOwnProperty(p)) {
          delete target[p];
          updatedValueSet.delete(p);
          return true;
        }
        return true;
      }
    });
    this.proxy = proxy;
    activeSandboxCount++;
    (proxyHooks == null ? void 0 : proxyHooks.saveSandBox) && (proxyHooks == null ? void 0 : proxyHooks.saveSandBox(name, this));
  }
  active() {
    if (!this.sandboxRunning)
      activeSandboxCount++;
    this.sandboxRunning = true;
  }
  inactive() {
    if (process.env.NODE_ENV === "development") {
      console.info(
        `[freelog:sandbox] ${this.name} modified global properties restore...`,
        [
          // @ts-ignore
          ...this.updatedValueSet.keys()
        ]
      );
    }
    if (--activeSandboxCount === 0) {
      variableWhiteList.forEach((p) => {
        if (this.proxy.hasOwnProperty(p)) {
          delete window[p];
        }
      });
    }
    this.sandboxRunning = false;
  }
};
