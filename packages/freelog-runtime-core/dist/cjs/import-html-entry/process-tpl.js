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

// src/import-html-entry/process-tpl.js
var process_tpl_exports = {};
__export(process_tpl_exports, {
  default: () => processTpl,
  genIgnoreAssetReplaceSymbol: () => genIgnoreAssetReplaceSymbol,
  genLinkReplaceSymbol: () => genLinkReplaceSymbol,
  genModuleScriptReplaceSymbol: () => genModuleScriptReplaceSymbol,
  genScriptReplaceSymbol: () => genScriptReplaceSymbol,
  inlineScriptReplaceSymbol: () => inlineScriptReplaceSymbol
});
module.exports = __toCommonJS(process_tpl_exports);
var import_utils = require("./utils");
var ALL_SCRIPT_REGEX = /(<script[\s\S]*?>)[\s\S]*?<\/script>/gi;
var SCRIPT_TAG_REGEX = /<(script)\s+((?!type=('|")text\/ng-template\3).)*?>.*?<\/\1>/is;
var SCRIPT_SRC_REGEX = /.*\ssrc=('|")?([^>'"\s]+)/;
var SCRIPT_TYPE_REGEX = /.*\stype=('|")?([^>'"\s]+)/;
var SCRIPT_ENTRY_REGEX = /.*\sentry\s*.*/;
var SCRIPT_ASYNC_REGEX = /.*\sasync\s*.*/;
var SCRIPT_NO_MODULE_REGEX = /.*\snomodule\s*.*/;
var SCRIPT_MODULE_REGEX = /.*\stype=('|")?module('|")?\s*.*/;
var LINK_TAG_REGEX = /<(link)\s+.*?>/isg;
var LINK_PRELOAD_OR_PREFETCH_REGEX = /\srel=('|")?(preload|prefetch)\1/;
var LINK_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
var LINK_AS_FONT = /.*\sas=('|")?font\1.*/;
var STYLE_TAG_REGEX = /<style[^>]*>[\s\S]*?<\/style>/gi;
var STYLE_TYPE_REGEX = /\s+rel=('|")?stylesheet\1.*/;
var STYLE_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
var HTML_COMMENT_REGEX = /<!--([\s\S]*?)-->/g;
var LINK_IGNORE_REGEX = /<link(\s+|\s+.+\s+)ignore(\s*|\s+.*|=.*)>/is;
var STYLE_IGNORE_REGEX = /<style(\s+|\s+.+\s+)ignore(\s*|\s+.*|=.*)>/is;
var SCRIPT_IGNORE_REGEX = /<script(\s+|\s+.+\s+)ignore(\s*|\s+.*|=.*)>/is;
function hasProtocol(url) {
  return url.startsWith("//") || url.startsWith("http://") || url.startsWith("https://");
}
function getEntirePath(path, baseURI) {
  if (/\/\/$/.test(baseURI)) {
    baseURI = baseURI.substr(0, baseURI.length - 1);
  }
  if (!/\/$/.test(baseURI)) {
    baseURI = baseURI + "/";
  }
  if (path.startsWith("/"))
    path = path.replace("/", "");
  const url = baseURI + path;
  return url;
}
function isValidJavaScriptType(type) {
  const handleTypes = ["text/javascript", "module", "application/javascript", "text/ecmascript", "application/ecmascript"];
  return !type || handleTypes.indexOf(type) !== -1;
}
var genLinkReplaceSymbol = (linkHref, preloadOrPrefetch = false) => `<!-- ${preloadOrPrefetch ? "prefetch/preload" : ""} link ${linkHref} replaced by import-html-entry -->`;
var genScriptReplaceSymbol = (scriptSrc, async = false) => `<!-- ${async ? "async" : ""} script ${scriptSrc} replaced by import-html-entry -->`;
var inlineScriptReplaceSymbol = `<!-- inline scripts replaced by import-html-entry -->`;
var genIgnoreAssetReplaceSymbol = (url) => `<!-- ignore asset ${url || "file"} replaced by import-html-entry -->`;
var genModuleScriptReplaceSymbol = (scriptSrc, moduleSupport) => `<!-- ${moduleSupport ? "nomodule" : "module"} script ${scriptSrc} ignored by import-html-entry -->`;
function processTpl(tpl, baseURI) {
  let scripts = [];
  const styles = [];
  let entry = null;
  const moduleSupport = (0, import_utils.isModuleScriptSupported)();
  if (/\/\/$/.test(baseURI)) {
    baseURI = baseURI.substr(0, baseURI.length - 1);
  }
  ;
  if (!/\/$/.test(baseURI)) {
    baseURI = baseURI + "/";
  }
  ;
  const template = tpl.replace(/url\(static/g, `url(${baseURI}static`).replace(/url\(\/static/g, `url(${baseURI}static`).replace(HTML_COMMENT_REGEX, "").replace(LINK_TAG_REGEX, (match) => {
    const styleType = !!match.match(STYLE_TYPE_REGEX);
    if (styleType) {
      const styleHref = match.match(STYLE_HREF_REGEX);
      const styleIgnore = match.match(LINK_IGNORE_REGEX);
      if (styleHref) {
        const href = styleHref && styleHref[2];
        let newHref = href;
        if (href && !hasProtocol(href)) {
          newHref = getEntirePath(href, baseURI);
        }
        if (styleIgnore) {
          return genIgnoreAssetReplaceSymbol(newHref);
        }
        styles.push(newHref);
        return genLinkReplaceSymbol(newHref);
      }
    }
    const preloadOrPrefetchType = match.match(LINK_PRELOAD_OR_PREFETCH_REGEX) && match.match(LINK_HREF_REGEX) && !match.match(LINK_AS_FONT);
    if (preloadOrPrefetchType) {
      const [, , linkHref] = match.match(LINK_HREF_REGEX);
      return genLinkReplaceSymbol(linkHref, true);
    }
    return match;
  }).replace(STYLE_TAG_REGEX, (match) => {
    if (STYLE_IGNORE_REGEX.test(match)) {
      return genIgnoreAssetReplaceSymbol("style file");
    }
    return match;
  }).replace(ALL_SCRIPT_REGEX, (match, scriptTag) => {
    const scriptIgnore = scriptTag.match(SCRIPT_IGNORE_REGEX);
    const moduleScriptIgnore = moduleSupport && !!scriptTag.match(SCRIPT_NO_MODULE_REGEX) || !moduleSupport && !!scriptTag.match(SCRIPT_MODULE_REGEX);
    const matchedScriptTypeMatch = scriptTag.match(SCRIPT_TYPE_REGEX);
    const matchedScriptType = matchedScriptTypeMatch && matchedScriptTypeMatch[2];
    if (!isValidJavaScriptType(matchedScriptType)) {
      return match;
    }
    if (SCRIPT_TAG_REGEX.test(match) && scriptTag.match(SCRIPT_SRC_REGEX)) {
      const matchedScriptEntry = scriptTag.match(SCRIPT_ENTRY_REGEX);
      const matchedScriptSrcMatch = scriptTag.match(SCRIPT_SRC_REGEX);
      let matchedScriptSrc = matchedScriptSrcMatch && matchedScriptSrcMatch[2];
      if (entry && matchedScriptEntry) {
        throw new SyntaxError("You should not set multiply entry script!");
      } else {
        if (matchedScriptSrc && !hasProtocol(matchedScriptSrc)) {
          matchedScriptSrc = getEntirePath(matchedScriptSrc, baseURI);
        }
        entry = entry || matchedScriptEntry && matchedScriptSrc;
      }
      if (scriptIgnore) {
        return genIgnoreAssetReplaceSymbol(matchedScriptSrc || "js file");
      }
      if (moduleScriptIgnore) {
        return genModuleScriptReplaceSymbol(matchedScriptSrc || "js file", moduleSupport);
      }
      if (matchedScriptSrc) {
        const asyncScript = !!scriptTag.match(SCRIPT_ASYNC_REGEX);
        scripts.push(asyncScript ? { async: true, src: matchedScriptSrc } : matchedScriptSrc);
        return genScriptReplaceSymbol(matchedScriptSrc, asyncScript);
      }
      return match;
    } else {
      if (scriptIgnore) {
        return genIgnoreAssetReplaceSymbol("js file");
      }
      if (moduleScriptIgnore) {
        return genModuleScriptReplaceSymbol("js file", moduleSupport);
      }
      const code = (0, import_utils.getInlineCode)(match);
      const isPureCommentBlock = code.split(/[\r\n]+/).every((line) => !line.trim() || line.trim().startsWith("//"));
      if (!isPureCommentBlock) {
        scripts.push(match);
      }
      return inlineScriptReplaceSymbol;
    }
  });
  scripts = scripts.filter(function(script) {
    return !!script;
  });
  return {
    template,
    scripts,
    styles,
    // set the last script as entry if have not set
    entry: entry || scripts[scripts.length - 1]
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  genIgnoreAssetReplaceSymbol,
  genLinkReplaceSymbol,
  genModuleScriptReplaceSymbol,
  genScriptReplaceSymbol,
  inlineScriptReplaceSymbol
});
