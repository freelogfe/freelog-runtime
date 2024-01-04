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

// src/sandbox/patchers/dynamicAppend/common.ts
var common_exports = {};
__export(common_exports, {
  getStyledElementCSSRules: () => getStyledElementCSSRules,
  isHijackingTag: () => isHijackingTag,
  isStyledComponentsLike: () => isStyledComponentsLike,
  patchHTMLDynamicAppendPrototypeFunctions: () => patchHTMLDynamicAppendPrototypeFunctions,
  rawHeadAppendChild: () => rawHeadAppendChild,
  rebuildCSSRules: () => rebuildCSSRules,
  recordStyledComponentsCSSRules: () => recordStyledComponentsCSSRules
});
module.exports = __toCommonJS(common_exports);
var import_import_html_entry = require("../../../import-html-entry");
var import_lodash_es = require("lodash-es");
var import_apis = require("../../../apis");
var css = __toESM(require("../css"));
var rawHeadAppendChild = HTMLHeadElement.prototype.appendChild;
var rawHeadRemoveChild = HTMLHeadElement.prototype.removeChild;
var rawBodyAppendChild = HTMLBodyElement.prototype.appendChild;
var rawBodyRemoveChild = HTMLBodyElement.prototype.removeChild;
var rawHeadInsertBefore = HTMLHeadElement.prototype.insertBefore;
var rawRemoveChild = HTMLElement.prototype.removeChild;
var SCRIPT_TAG_NAME = "SCRIPT";
var LINK_TAG_NAME = "LINK";
var STYLE_TAG_NAME = "STYLE";
function isHijackingTag(tagName) {
  return (tagName == null ? void 0 : tagName.toUpperCase()) === LINK_TAG_NAME || (tagName == null ? void 0 : tagName.toUpperCase()) === STYLE_TAG_NAME || (tagName == null ? void 0 : tagName.toUpperCase()) === SCRIPT_TAG_NAME;
}
function isStyledComponentsLike(element) {
  var _a, _b;
  return !element.textContent && (((_a = element.sheet) == null ? void 0 : _a.cssRules.length) || ((_b = getStyledElementCSSRules(element)) == null ? void 0 : _b.length));
}
function patchCustomEvent(e, elementGetter) {
  Object.defineProperties(e, {
    srcElement: {
      get: elementGetter
    },
    target: {
      get: elementGetter
    }
  });
  return e;
}
function manualInvokeElementOnLoad(element) {
  const loadEvent = new CustomEvent("load");
  const patchedEvent = patchCustomEvent(loadEvent, () => element);
  if ((0, import_lodash_es.isFunction)(element.onload)) {
    element.onload(patchedEvent);
  } else {
    element.dispatchEvent(patchedEvent);
  }
}
function manualInvokeElementOnError(element) {
  const errorEvent = new CustomEvent("error");
  const patchedEvent = patchCustomEvent(errorEvent, () => element);
  if ((0, import_lodash_es.isFunction)(element.onerror)) {
    element.onerror(patchedEvent);
  } else {
    element.dispatchEvent(patchedEvent);
  }
}
function convertLinkAsStyle(element, postProcess, fetchFn) {
  const styleElement = document.createElement("style");
  const { href } = element;
  styleElement.dataset.freelogHref = href;
  fetchFn(href).then((res) => res.text()).then((styleContext) => {
    styleElement.appendChild(document.createTextNode(styleContext));
    postProcess(styleElement);
    manualInvokeElementOnLoad(element);
  }).catch(() => manualInvokeElementOnError(element));
  return styleElement;
}
var styledComponentCSSRulesMap = /* @__PURE__ */ new WeakMap();
var dynamicScriptAttachedCommentMap = /* @__PURE__ */ new WeakMap();
var dynamicLinkAttachedInlineStyleMap = /* @__PURE__ */ new WeakMap();
function recordStyledComponentsCSSRules(styleElements) {
  styleElements.forEach((styleElement) => {
    if (styleElement instanceof HTMLStyleElement && isStyledComponentsLike(styleElement)) {
      if (styleElement.sheet) {
        styledComponentCSSRulesMap.set(styleElement, styleElement.sheet.cssRules);
      }
    }
  });
}
function getStyledElementCSSRules(styledElement) {
  return styledComponentCSSRulesMap.get(styledElement);
}
function getOverwrittenAppendChildOrInsertBefore(opts) {
  return function appendChildOrInsertBefore(newChild, refChild) {
    var _a, _b;
    let element = newChild;
    const { rawDOMAppendOrInsertBefore, isInvokedByMicroApp, containerConfigGetter } = opts;
    if (!isHijackingTag(element.tagName) || !isInvokedByMicroApp(element)) {
      return rawDOMAppendOrInsertBefore.call(this, element, refChild);
    }
    if (element.tagName) {
      const containerConfig = containerConfigGetter(element);
      const {
        appName,
        appWrapperGetter,
        proxy,
        strictGlobal,
        dynamicStyleSheetElements,
        scopedCSS,
        excludeAssetFilter
      } = containerConfig;
      switch (element.tagName) {
        case LINK_TAG_NAME:
        case STYLE_TAG_NAME: {
          let stylesheetElement = newChild;
          const { href } = stylesheetElement;
          if (excludeAssetFilter && href && excludeAssetFilter(href)) {
            return rawDOMAppendOrInsertBefore.call(this, element, refChild);
          }
          const mountDOM = appWrapperGetter();
          if (scopedCSS) {
            const linkElementUsingStylesheet = ((_a = element.tagName) == null ? void 0 : _a.toUpperCase()) === LINK_TAG_NAME && element.rel === "stylesheet" && element.href;
            if (linkElementUsingStylesheet) {
              const fetch = typeof import_apis.frameworkConfiguration.fetch === "function" ? import_apis.frameworkConfiguration.fetch : (_b = import_apis.frameworkConfiguration.fetch) == null ? void 0 : _b.fn;
              stylesheetElement = convertLinkAsStyle(
                element,
                (styleElement) => css.process(mountDOM, styleElement, appName),
                fetch
              );
              dynamicLinkAttachedInlineStyleMap.set(element, stylesheetElement);
            } else {
              css.process(mountDOM, stylesheetElement, appName);
            }
          }
          dynamicStyleSheetElements.push(stylesheetElement);
          const referenceNode = mountDOM.contains(refChild) ? refChild : null;
          return rawDOMAppendOrInsertBefore.call(mountDOM, stylesheetElement, referenceNode);
        }
        case SCRIPT_TAG_NAME: {
          const { src, text } = element;
          if (excludeAssetFilter && src && excludeAssetFilter(src)) {
            return rawDOMAppendOrInsertBefore.call(this, element, refChild);
          }
          const mountDOM = appWrapperGetter();
          const { fetch } = import_apis.frameworkConfiguration;
          const referenceNode = mountDOM.contains(refChild) ? refChild : null;
          if (src) {
            (0, import_import_html_entry.execScripts)(null, [src], proxy, {
              fetch,
              strictGlobal,
              beforeExec: () => {
                Object.defineProperty(document, "currentScript", {
                  get() {
                    return element;
                  },
                  configurable: true
                });
              },
              success: () => {
                manualInvokeElementOnLoad(element);
                element = null;
              },
              error: () => {
                manualInvokeElementOnError(element);
                element = null;
              }
            });
            const dynamicScriptCommentElement = document.createComment(`dynamic script ${src} replaced by freelog`);
            dynamicScriptAttachedCommentMap.set(element, dynamicScriptCommentElement);
            return rawDOMAppendOrInsertBefore.call(mountDOM, dynamicScriptCommentElement, referenceNode);
          }
          (0, import_import_html_entry.execScripts)(null, [`<script>${text}</script>`], proxy, { strictGlobal });
          const dynamicInlineScriptCommentElement = document.createComment("dynamic inline script replaced by freelog");
          dynamicScriptAttachedCommentMap.set(element, dynamicInlineScriptCommentElement);
          return rawDOMAppendOrInsertBefore.call(mountDOM, dynamicInlineScriptCommentElement, referenceNode);
        }
        default:
          break;
      }
    }
    return rawDOMAppendOrInsertBefore.call(this, element, refChild);
  };
}
function getNewRemoveChild(headOrBodyRemoveChild, appWrapperGetterGetter) {
  return function removeChild(child) {
    const { tagName } = child;
    if (!isHijackingTag(tagName))
      return headOrBodyRemoveChild.call(this, child);
    try {
      let attachedElement;
      switch (tagName) {
        case LINK_TAG_NAME: {
          attachedElement = dynamicLinkAttachedInlineStyleMap.get(child) || child;
          break;
        }
        case SCRIPT_TAG_NAME: {
          attachedElement = dynamicScriptAttachedCommentMap.get(child) || child;
          break;
        }
        default: {
          attachedElement = child;
        }
      }
      const appWrapperGetter = appWrapperGetterGetter(child);
      const container = appWrapperGetter();
      if (container.contains(attachedElement)) {
        return rawRemoveChild.call(container, attachedElement);
      }
    } catch (e) {
      console.warn(e);
    }
    return headOrBodyRemoveChild.call(this, child);
  };
}
function patchHTMLDynamicAppendPrototypeFunctions(isInvokedByMicroApp, containerConfigGetter) {
  if (HTMLHeadElement.prototype.appendChild === rawHeadAppendChild && HTMLBodyElement.prototype.appendChild === rawBodyAppendChild && HTMLHeadElement.prototype.insertBefore === rawHeadInsertBefore) {
    HTMLHeadElement.prototype.appendChild = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawHeadAppendChild,
      containerConfigGetter,
      isInvokedByMicroApp
    });
    HTMLBodyElement.prototype.appendChild = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawBodyAppendChild,
      containerConfigGetter,
      isInvokedByMicroApp
    });
    HTMLHeadElement.prototype.insertBefore = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawHeadInsertBefore,
      containerConfigGetter,
      isInvokedByMicroApp
    });
  }
  if (HTMLHeadElement.prototype.removeChild === rawHeadRemoveChild && HTMLBodyElement.prototype.removeChild === rawBodyRemoveChild) {
    HTMLHeadElement.prototype.removeChild = getNewRemoveChild(
      rawHeadRemoveChild,
      (element) => containerConfigGetter(element).appWrapperGetter
    );
    HTMLBodyElement.prototype.removeChild = getNewRemoveChild(
      rawBodyRemoveChild,
      (element) => containerConfigGetter(element).appWrapperGetter
    );
  }
  return function unpatch() {
    HTMLHeadElement.prototype.appendChild = rawHeadAppendChild;
    HTMLHeadElement.prototype.removeChild = rawHeadRemoveChild;
    HTMLBodyElement.prototype.appendChild = rawBodyAppendChild;
    HTMLBodyElement.prototype.removeChild = rawBodyRemoveChild;
    HTMLHeadElement.prototype.insertBefore = rawHeadInsertBefore;
  };
}
function rebuildCSSRules(styleSheetElements, reAppendElement) {
  styleSheetElements.forEach((stylesheetElement) => {
    const appendSuccess = reAppendElement(stylesheetElement);
    if (appendSuccess) {
      if (stylesheetElement instanceof HTMLStyleElement && isStyledComponentsLike(stylesheetElement)) {
        const cssRules = getStyledElementCSSRules(stylesheetElement);
        if (cssRules) {
          for (let i = 0; i < cssRules.length; i++) {
            const cssRule = cssRules[i];
            const cssStyleSheetElement = stylesheetElement.sheet;
            cssStyleSheetElement.insertRule(cssRule.cssText, cssStyleSheetElement.cssRules.length);
          }
        }
      }
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getStyledElementCSSRules,
  isHijackingTag,
  isStyledComponentsLike,
  patchHTMLDynamicAppendPrototypeFunctions,
  rawHeadAppendChild,
  rebuildCSSRules,
  recordStyledComponentsCSSRules
});
