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

// src/apis.ts
var apis_exports = {};
__export(apis_exports, {
  frameworkConfiguration: () => frameworkConfiguration,
  loadMicroApp: () => loadMicroApp
});
module.exports = __toCommonJS(apis_exports);
var import_single_spa = require("./single-spa/single-spa");
var import_loader = require("./loader");
var import_utils = require("./utils");
var frameworkConfiguration = { fetch: window.fetch };
var appConfigPromiseGetterMap = /* @__PURE__ */ new Map();
function loadMicroApp(app, configuration, lifeCycles) {
  const { props, name } = app;
  frameworkConfiguration = { ...frameworkConfiguration, fetch: (configuration == null ? void 0 : configuration.fetch) ? configuration == null ? void 0 : configuration.fetch : frameworkConfiguration.fetch };
  const getContainerXpath = (container) => {
    const containerElement = (0, import_utils.getContainer)(container);
    if (containerElement) {
      return (0, import_utils.getXPathForElement)(containerElement, document);
    }
    return void 0;
  };
  const wrapParcelConfigForRemount = (config) => {
    return {
      ...config,
      // empty bootstrap hook which should not run twice while it calling from cached micro app
      bootstrap: () => Promise.resolve()
    };
  };
  const memorizedLoadingFn = async () => {
    const userConfiguration = configuration ?? { ...frameworkConfiguration, singular: false };
    const { $$cacheLifecycleByAppName } = userConfiguration;
    const container = "container" in app ? app.container : void 0;
    if (container) {
      if ($$cacheLifecycleByAppName) {
        const parcelConfigGetterPromise = appConfigPromiseGetterMap.get(name);
        if (parcelConfigGetterPromise)
          return wrapParcelConfigForRemount((await parcelConfigGetterPromise)(container));
      }
      const xpath = getContainerXpath(container);
      if (xpath) {
        const parcelConfigGetterPromise = appConfigPromiseGetterMap.get(`${name}-${xpath}`);
        if (parcelConfigGetterPromise)
          return wrapParcelConfigForRemount((await parcelConfigGetterPromise)(container));
      }
    }
    const parcelConfigObjectGetterPromise = (0, import_loader.loadApp)(app, userConfiguration, lifeCycles);
    if (container) {
      if ($$cacheLifecycleByAppName) {
        appConfigPromiseGetterMap.set(name, parcelConfigObjectGetterPromise);
      } else {
        const xpath = getContainerXpath(container);
        if (xpath)
          appConfigPromiseGetterMap.set(`${name}-${xpath}`, parcelConfigObjectGetterPromise);
      }
    }
    return (await parcelConfigObjectGetterPromise)(container);
  };
  return (0, import_single_spa.mountRootParcel)(memorizedLoadingFn, { domElement: document.createElement("div"), ...props });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  frameworkConfiguration,
  loadMicroApp
});
