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

// src/import-html-entry/utils.js
var utils_exports = {};
__export(utils_exports, {
  defaultGetPublicPath: () => defaultGetPublicPath,
  getGlobalProp: () => getGlobalProp,
  getInlineCode: () => getInlineCode,
  isModuleScriptSupported: () => isModuleScriptSupported,
  noteGlobalProps: () => noteGlobalProps,
  readResAsString: () => readResAsString,
  requestIdleCallback: () => requestIdleCallback
});
module.exports = __toCommonJS(utils_exports);
var isIE11 = typeof navigator !== "undefined" && navigator.userAgent.indexOf("Trident") !== -1;
function shouldSkipProperty(global, p) {
  if (!global.hasOwnProperty(p) || !isNaN(p) && p < global.length)
    return true;
  if (isIE11) {
    try {
      return global[p] && typeof window !== "undefined" && global[p].parent === window;
    } catch (err) {
      return true;
    }
  } else {
    return false;
  }
}
var firstGlobalProp;
var secondGlobalProp;
var lastGlobalProp;
function getGlobalProp(global) {
  let cnt = 0;
  let lastProp;
  let hasIframe = false;
  for (let p in global) {
    if (shouldSkipProperty(global, p))
      continue;
    for (let i = 0; i < window.frames.length && !hasIframe; i++) {
      const frame = window.frames[i];
      if (frame === global[p]) {
        hasIframe = true;
        break;
      }
    }
    if (!hasIframe && (cnt === 0 && p !== firstGlobalProp || cnt === 1 && p !== secondGlobalProp))
      return p;
    cnt++;
    lastProp = p;
  }
  if (lastProp !== lastGlobalProp)
    return lastProp;
}
function noteGlobalProps(global) {
  firstGlobalProp = secondGlobalProp = void 0;
  for (let p in global) {
    if (shouldSkipProperty(global, p))
      continue;
    if (!firstGlobalProp)
      firstGlobalProp = p;
    else if (!secondGlobalProp)
      secondGlobalProp = p;
    lastGlobalProp = p;
  }
  return lastGlobalProp;
}
function getInlineCode(match) {
  const start = match.indexOf(">") + 1;
  const end = match.lastIndexOf("<");
  return match.substring(start, end);
}
function defaultGetPublicPath(entry) {
  if (typeof entry === "object") {
    return "/";
  }
  try {
    const { origin, pathname } = new URL(entry.startsWith("//") ? `${window.location.protocol}${entry}` : entry, window.location.href);
    const paths = pathname.split("/");
    return `${origin}${paths.join("/")}/`;
  } catch (e) {
    console.warn(e);
    return "";
  }
}
function isModuleScriptSupported() {
  const s = document.createElement("script");
  return "noModule" in s;
}
var requestIdleCallback = window.requestIdleCallback || function requestIdleCallback2(cb) {
  const start = Date.now();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};
function readResAsString(response, autoDetectCharset) {
  if (!autoDetectCharset) {
    return response.text();
  }
  if (!response.headers) {
    return response.text();
  }
  const contentType = response.headers.get("Content-Type");
  if (!contentType) {
    return response.text();
  }
  let charset = "utf-8";
  const parts = contentType.split(";");
  if (parts.length === 2) {
    const [, value] = parts[1].split("=");
    const encoding = value && value.trim();
    if (encoding) {
      charset = encoding;
    }
  }
  if (charset.toUpperCase() === "UTF-8") {
    return response.text();
  }
  return response.blob().then((file) => new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsText(file, charset);
  }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defaultGetPublicPath,
  getGlobalProp,
  getInlineCode,
  isModuleScriptSupported,
  noteGlobalProps,
  readResAsString,
  requestIdleCallback
});
