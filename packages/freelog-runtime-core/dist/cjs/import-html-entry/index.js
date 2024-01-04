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

// src/import-html-entry/index.js
var import_html_entry_exports = {};
__export(import_html_entry_exports, {
  default: () => importHTML,
  execScripts: () => execScripts,
  getExternalScripts: () => getExternalScripts,
  getExternalStyleSheets: () => getExternalStyleSheets,
  importEntry: () => importEntry
});
module.exports = __toCommonJS(import_html_entry_exports);
var import_process_tpl = __toESM(require("./process-tpl"));
var import_utils = require("./utils");
var styleCache = {};
var scriptCache = {};
var embedHTMLCache = {};
if (!window.fetch) {
  throw new Error('[import-html-entry] Here is no "fetch" on the window env, you need to polyfill it');
}
var defaultFetch = window.fetch;
function defaultGetTemplate(tpl) {
  return tpl;
}
function getEmbedHTML(template, styles, opts = {}, baseURI) {
  const { fetch = defaultFetch } = opts;
  let embedHTML = template.replace(/<meta\s*name=\"viewport\".*?>/, "");
  return getExternalStyleSheets(styles, fetch).then((styleSheets) => {
    embedHTML = styles.reduce((html, styleSrc, i) => {
      html = html.replace((0, import_process_tpl.genLinkReplaceSymbol)(styleSrc), `<style>/* ${styleSrc} */${styleSheets[i]}</style>`);
      return html;
    }, embedHTML);
    return embedHTML;
  });
}
var isInlineCode = (code) => code.startsWith("<");
function getExecutableScript(scriptSrc, scriptText, proxy, strictGlobal) {
  const sourceUrl = isInlineCode(scriptSrc) ? "" : `//# sourceURL=${scriptSrc}
`;
  const globalWindow = (0, eval)("window");
  globalWindow.proxy = proxy;
  return strictGlobal ? `;(function(window, self, globalThis){with(window){;${scriptText}
${sourceUrl}}}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);` : `;(function(window, self, globalThis){;${scriptText}
${sourceUrl}}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);`;
}
function getExternalStyleSheets(styles, fetch = defaultFetch) {
  return Promise.all(styles.map(
    (styleLink) => {
      if (isInlineCode(styleLink)) {
        return (0, import_utils.getInlineCode)(styleLink);
      } else {
        return styleCache[styleLink] || (styleCache[styleLink] = fetch(styleLink).then((response) => {
          let text = response.text();
          return text;
        }));
      }
    }
  ));
}
function getExternalScripts(scripts, fetch = defaultFetch, errorCallback = () => {
}) {
  const fetchScript = (scriptUrl) => scriptCache[scriptUrl] || (scriptCache[scriptUrl] = fetch(scriptUrl).then((response) => {
    if (response.status >= 400) {
      errorCallback();
      throw new Error(`${scriptUrl} load failed with status ${response.status}`);
    }
    return response.text();
  }));
  return Promise.all(scripts.map(
    (script) => {
      if (typeof script === "string") {
        if (isInlineCode(script)) {
          return (0, import_utils.getInlineCode)(script);
        } else {
          return fetchScript(script);
        }
      } else {
        const { src, async } = script;
        if (async) {
          return {
            src,
            async: true,
            content: new Promise((resolve, reject) => (0, import_utils.requestIdleCallback)(() => fetchScript(src).then(resolve, reject)))
          };
        }
        return fetchScript(src);
      }
    }
  ));
}
function throwNonBlockingError(error, msg) {
  setTimeout(() => {
    console.error(msg);
    throw error;
  });
}
var supportsUserTiming = typeof performance !== "undefined" && typeof performance.mark === "function" && typeof performance.clearMarks === "function" && typeof performance.measure === "function" && typeof performance.clearMeasures === "function";
function execScripts(entry, scripts, proxy = window, opts = {}) {
  const {
    fetch = defaultFetch,
    strictGlobal = false,
    success,
    error = () => {
    },
    beforeExec = () => {
    },
    afterExec = () => {
    }
  } = opts;
  return getExternalScripts(scripts, fetch, error).then((scriptsText) => {
    const geval = (scriptSrc, inlineScript) => {
      const rawCode = beforeExec(inlineScript, scriptSrc) || inlineScript;
      const code = getExecutableScript(scriptSrc, rawCode, proxy, strictGlobal);
      (0, eval)(code);
      afterExec(inlineScript, scriptSrc);
    };
    function exec(scriptSrc, inlineScript, resolve) {
      const markName = `Evaluating script ${scriptSrc}`;
      const measureName = `Evaluating Time Consuming: ${scriptSrc}`;
      if (process.env.NODE_ENV === "development" && supportsUserTiming) {
        performance.mark(markName);
      }
      if (scriptSrc === entry) {
        (0, import_utils.noteGlobalProps)(strictGlobal ? proxy : window);
        try {
          geval(scriptSrc, inlineScript);
          const exports = proxy[(0, import_utils.getGlobalProp)(strictGlobal ? proxy : window)] || {};
          resolve(exports);
        } catch (e) {
          console.error(`[import-html-entry]: error occurs while executing entry script ${scriptSrc}`);
          throw e;
        }
      } else {
        if (typeof inlineScript === "string") {
          try {
            geval(scriptSrc, inlineScript);
          } catch (e) {
            throwNonBlockingError(e, `[import-html-entry]: error occurs while executing normal script ${scriptSrc}`);
          }
        } else {
          inlineScript.async && (inlineScript == null ? void 0 : inlineScript.content.then((downloadedScriptText) => geval(inlineScript.src, downloadedScriptText)).catch((e) => {
            throwNonBlockingError(e, `[import-html-entry]: error occurs while executing async script ${inlineScript.src}`);
          }));
        }
      }
      if (process.env.NODE_ENV === "development" && supportsUserTiming) {
        performance.measure(measureName, markName);
        performance.clearMarks(markName);
        performance.clearMeasures(measureName);
      }
    }
    function schedule(i, resolvePromise) {
      if (i < scripts.length) {
        const scriptSrc = scripts[i];
        const inlineScript = scriptsText[i];
        exec(scriptSrc, inlineScript, resolvePromise);
        if (!entry && i === scripts.length - 1) {
          resolvePromise();
        } else {
          schedule(i + 1, resolvePromise);
        }
      }
    }
    return new Promise((resolve) => schedule(0, success || resolve));
  });
}
function importHTML(url, opts = {}) {
  let fetch = defaultFetch;
  let autoDecodeResponse = false;
  let getPublicPath = import_utils.defaultGetPublicPath;
  let getTemplate = defaultGetTemplate;
  if (typeof opts === "function") {
    fetch = opts;
  } else {
    if (opts.fetch) {
      if (typeof opts.fetch === "function") {
        fetch = opts.fetch;
      } else {
        fetch = opts.fetch.fn || defaultFetch;
        autoDecodeResponse = !!opts.fetch.autoDecodeResponse;
      }
    }
    getPublicPath = opts.getPublicPath || opts.getDomain || import_utils.defaultGetPublicPath;
    getTemplate = opts.getTemplate || defaultGetTemplate;
  }
  if (/\/$/.test(url)) {
    url = url.substr(0, url.length - 1);
  }
  return embedHTMLCache[url] || (embedHTMLCache[url] = fetch(url + "/index.html").then((response) => (0, import_utils.readResAsString)(response, autoDecodeResponse)).then((html) => {
    const assetPublicPath = url;
    const { template, scripts, entry, styles } = (0, import_process_tpl.default)(getTemplate(html), assetPublicPath);
    return getEmbedHTML(template, styles, { fetch }, assetPublicPath).then((embedHTML) => ({
      template: embedHTML,
      assetPublicPath,
      getExternalScripts: () => getExternalScripts(scripts, fetch),
      getExternalStyleSheets: () => getExternalStyleSheets(styles, fetch),
      execScripts: (proxy, strictGlobal, execScriptsHooks = {}) => {
        if (!scripts.length) {
          return Promise.resolve();
        }
        return execScripts(entry, scripts, proxy, {
          fetch,
          strictGlobal,
          beforeExec: execScriptsHooks.beforeExec,
          afterExec: execScriptsHooks.afterExec
        });
      }
    }));
  }));
}
function importEntry(entry, opts = {}) {
  const { fetch = defaultFetch, getTemplate = defaultGetTemplate } = opts;
  const getPublicPath = opts.getPublicPath || opts.getDomain || import_utils.defaultGetPublicPath;
  if (!entry) {
    throw new SyntaxError("entry should not be empty!");
  }
  if (typeof entry === "string") {
    return importHTML(entry, {
      fetch,
      getPublicPath,
      getTemplate
    });
  }
  if (Array.isArray(entry.scripts) || Array.isArray(entry.styles)) {
    const { scripts = [], styles = [], html = "" } = entry;
    const getHTMLWithStylePlaceholder = (tpl) => styles.reduceRight((html2, styleSrc) => `${(0, import_process_tpl.genLinkReplaceSymbol)(styleSrc)}${html2}`, tpl);
    const getHTMLWithScriptPlaceholder = (tpl) => scripts.reduce((html2, scriptSrc) => `${html2}${(0, import_process_tpl.genScriptReplaceSymbol)(scriptSrc)}`, tpl);
    return getEmbedHTML(getTemplate(getHTMLWithScriptPlaceholder(getHTMLWithStylePlaceholder(html))), styles, { fetch }).then((embedHTML) => ({
      template: embedHTML,
      assetPublicPath: getPublicPath(entry),
      getExternalScripts: () => getExternalScripts(scripts, fetch),
      getExternalStyleSheets: () => getExternalStyleSheets(styles, fetch),
      execScripts: (proxy, strictGlobal, execScriptsHooks = {}) => {
        if (!scripts.length) {
          return Promise.resolve();
        }
        return execScripts(scripts[scripts.length - 1], scripts, proxy, {
          fetch,
          strictGlobal,
          beforeExec: execScriptsHooks.beforeExec,
          afterExec: execScriptsHooks.afterExec
        });
      }
    }));
  } else {
    throw new SyntaxError("entry scripts or styles should be array!");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  execScripts,
  getExternalScripts,
  getExternalStyleSheets,
  importEntry
});
