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

// src/sandbox/patchers/dynamicAppend/forStrictSandbox.ts
var forStrictSandbox_exports = {};
__export(forStrictSandbox_exports, {
  patchStrictSandbox: () => patchStrictSandbox
});
module.exports = __toCommonJS(forStrictSandbox_exports);
var import_common = require("../../common");
var import_common2 = require("./common");
var rawDocumentCreateElement = Document.prototype.createElement;
var proxyAttachContainerConfigMap = /* @__PURE__ */ new WeakMap();
var elementAttachContainerConfigMap = /* @__PURE__ */ new WeakMap();
function patchDocumentCreateElement() {
  if (Document.prototype.createElement === rawDocumentCreateElement) {
    Document.prototype.createElement = function createElement(tagName, options) {
      const element = rawDocumentCreateElement.call(this, tagName, options);
      if ((0, import_common2.isHijackingTag)(tagName)) {
        const currentRunningSandboxProxy = (0, import_common.getCurrentRunningSandboxProxy)();
        if (currentRunningSandboxProxy) {
          const proxyContainerConfig = proxyAttachContainerConfigMap.get(currentRunningSandboxProxy);
          if (proxyContainerConfig) {
            elementAttachContainerConfigMap.set(element, proxyContainerConfig);
          }
        }
      }
      return element;
    };
  }
  return function unpatch() {
    Document.prototype.createElement = rawDocumentCreateElement;
  };
}
var bootstrappingPatchCount = 0;
var mountingPatchCount = 0;
function patchStrictSandbox(appName, appWrapperGetter, proxy, mounting = true, scopedCSS = false, excludeAssetFilter) {
  let containerConfig = proxyAttachContainerConfigMap.get(proxy);
  if (!containerConfig) {
    containerConfig = {
      appName,
      proxy,
      appWrapperGetter,
      dynamicStyleSheetElements: [],
      strictGlobal: true,
      excludeAssetFilter,
      scopedCSS
    };
    proxyAttachContainerConfigMap.set(proxy, containerConfig);
  }
  const { dynamicStyleSheetElements } = containerConfig;
  const unpatchDocumentCreate = patchDocumentCreateElement();
  const unpatchDynamicAppendPrototypeFunctions = (0, import_common2.patchHTMLDynamicAppendPrototypeFunctions)(
    (element) => elementAttachContainerConfigMap.has(element),
    (element) => elementAttachContainerConfigMap.get(element)
  );
  if (!mounting)
    bootstrappingPatchCount++;
  if (mounting)
    mountingPatchCount++;
  return function free() {
    if (!mounting && bootstrappingPatchCount !== 0)
      bootstrappingPatchCount--;
    if (mounting)
      mountingPatchCount--;
    const allMicroAppUnmounted = mountingPatchCount === 0 && bootstrappingPatchCount === 0;
    if (allMicroAppUnmounted) {
      unpatchDynamicAppendPrototypeFunctions();
      unpatchDocumentCreate();
    }
    (0, import_common2.recordStyledComponentsCSSRules)(dynamicStyleSheetElements);
    return function rebuild() {
      (0, import_common2.rebuildCSSRules)(dynamicStyleSheetElements, (stylesheetElement) => {
        const appWrapper = appWrapperGetter();
        if (!appWrapper.contains(stylesheetElement)) {
          import_common2.rawHeadAppendChild.call(appWrapper, stylesheetElement);
          return true;
        }
        return false;
      });
    };
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  patchStrictSandbox
});
