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

// src/sandbox/patchers/css.ts
var css_exports = {};
__export(css_exports, {
  FreelogCSSRewriteAttr: () => FreelogCSSRewriteAttr,
  ScopedCSS: () => ScopedCSS,
  process: () => process
});
module.exports = __toCommonJS(css_exports);
var arrayify = (list) => {
  return [].slice.call(list, 0);
};
var rawDocumentBodyAppend = HTMLBodyElement.prototype.appendChild;
var _ScopedCSS = class {
  constructor(data) {
    const styleNode = document.createElement("style");
    rawDocumentBodyAppend.call(document.body, styleNode);
    this.appName = data.appName;
    this.swapNode = styleNode;
    this.sheet = styleNode.sheet;
    this.sheet.disabled = true;
  }
  process(styleNode, prefix = "") {
    if (styleNode.textContent !== "") {
      const textNode = document.createTextNode(styleNode.textContent || "");
      this.swapNode.appendChild(textNode);
      const sheet = this.swapNode.sheet;
      const rules = arrayify((sheet == null ? void 0 : sheet.cssRules) ?? []);
      const css = this.rewrite(rules, prefix);
      styleNode.textContent = css;
      this.swapNode.removeChild(textNode);
      return;
    }
    const mutator = new MutationObserver((mutations) => {
      for (let i = 0; i < mutations.length; i += 1) {
        const mutation = mutations[i];
        if (_ScopedCSS.ModifiedTag in styleNode) {
          return;
        }
        if (mutation.type === "childList") {
          const sheet = styleNode.sheet;
          const rules = arrayify((sheet == null ? void 0 : sheet.cssRules) ?? []);
          const css = this.rewrite(rules, prefix);
          styleNode.textContent = css;
          styleNode[_ScopedCSS.ModifiedTag] = true;
        }
      }
    });
    mutator.observe(styleNode, { childList: true });
  }
  rewrite(rules, prefix = "") {
    let css = "";
    rules.forEach((rule) => {
      switch (rule.type) {
        case 1 /* STYLE */:
          css += this.ruleStyle(rule, prefix);
          break;
        case 4 /* MEDIA */:
          css += this.ruleMedia(rule, prefix);
          break;
        case 12 /* SUPPORTS */:
          css += this.ruleSupport(rule, prefix);
          break;
        default:
          css += `${rule.cssText}`;
          break;
      }
    });
    return css;
  }
  // @font-face repalce exclude [http, data:,//]
  // private ruleFont(rule: any, prefix: string) {
  //   let { cssText } = rule;
  //   // url("/
  //   cssText = cssText.replace(/url\(\"\//ig,'url("' +  widgetsConfig.get(this.appName).entry + '/');
  //   return cssText;
  // }
  // handle case:
  // .app-main {}
  // html, body {}
  // eslint-disable-next-line class-methods-use-this
  ruleStyle(rule, prefix) {
    const rootSelectorRE = /((?:[^\w\-.#]|^)(body|html|:root))/gm;
    const rootCombinationRE = /(html[^\w{[]+)/gm;
    const selector = rule.selectorText.trim();
    let { cssText } = rule;
    if (selector === "html" || selector === "body" || selector === ":root") {
      return cssText.replace(rootSelectorRE, prefix);
    }
    if (rootCombinationRE.test(rule.selectorText)) {
      const siblingSelectorRE = /(html[^\w{]+)(\+|~)/gm;
      if (!siblingSelectorRE.test(rule.selectorText)) {
        cssText = cssText.replace(rootCombinationRE, "");
      }
    }
    cssText = cssText.replace(
      /^[\s\S]+{/,
      (selectors) => selectors.replace(/(^|,\n?)([^,]+)/g, (item, p, s) => {
        if (rootSelectorRE.test(item)) {
          return item.replace(rootSelectorRE, (m) => {
            const whitePrevChars = [",", "("];
            if (m && whitePrevChars.includes(m[0])) {
              return `${m[0]}${prefix}`;
            }
            return prefix;
          });
        }
        return `${p}${prefix} ${s.replace(/^ */, "")}`;
      })
    );
    return cssText;
  }
  // handle case:
  // @media screen and (max-width: 300px) {}
  ruleMedia(rule, prefix) {
    const css = this.rewrite(arrayify(rule.cssRules), prefix);
    return `@media ${rule.conditionText} {${css}}`;
  }
  // handle case:
  // @supports (display: grid) {}
  ruleSupport(rule, prefix) {
    const css = this.rewrite(arrayify(rule.cssRules), prefix);
    return `@supports ${rule.conditionText} {${css}}`;
  }
};
var ScopedCSS = _ScopedCSS;
ScopedCSS.ModifiedTag = "Symbol(style-modified-freelog)";
var processor;
var FreelogCSSRewriteAttr = "data-freelog";
var process = (appWrapper, stylesheetElement, appName) => {
  if (!processor) {
    processor = new ScopedCSS({ appName });
  }
  if (stylesheetElement.tagName === "LINK") {
    console.warn("Feature: sandbox.experimentalStyleIsolation is not support for link element yet.");
  }
  const mountDOM = appWrapper;
  if (!mountDOM) {
    return;
  }
  const tag = (mountDOM.tagName || "").toLowerCase();
  if (tag && stylesheetElement.tagName === "STYLE") {
    const prefix = `${tag}[${FreelogCSSRewriteAttr}="${appName}"]`;
    processor.process(stylesheetElement, prefix);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FreelogCSSRewriteAttr,
  ScopedCSS,
  process
});
