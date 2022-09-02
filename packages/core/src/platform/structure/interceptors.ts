import { rawFetch, rawURL } from "./rawObjects";

// @ts-ignore
window.fetch = (url: string, options?: any) => {
  if (url.endsWith("?subFilePath=")) {
    url = url + "/index.html";
  }
  options = options || {};
  if (url.indexOf("freelog.com") > -1) {
    return rawFetch(url, { ...options, credentials: "include" });
  } else {
    return rawFetch(url, { ...options });
  }
};
// @ts-ignore
window.URL = function (url: string, baseURI: string) {
  // 处理因为拦截defaultGetPublicPath方法造成的 ? 转义与多一个"/"
  if (baseURI.includes("fileStream%3FsubFilePath=/")) {
    baseURI = baseURI.replace(
      "fileStream%3FsubFilePath=/",
      "fileStream?subFilePath="
    );
  }
  
  // 拦截import-html-entry/index.js 中的 defaultGetPublicPath 方法中的new URI
  // 该方法会在最后加一个"/"
  if (baseURI === location.href) {
    const a = new rawURL(url + "/ ");
    // 这一行代码会造成?变成%3F，无法作为url的search识别
    a.pathname = a.pathname + a.search;
    return a;
  }

  if (!baseURI || !baseURI.includes("fileStream?subFilePath=")) {
    return new rawURL(url, baseURI);
  }

  // new URL 虽然可保安全，但我们有特殊需求
  if (/\/\/$/.test(baseURI)) {
    baseURI = baseURI.substr(0, baseURI.length - 1);
  }
  if (!/\/$/.test(baseURI)) {
    baseURI = baseURI + "/";
  }
  if (url.startsWith("/")) url = url.replace("/", "");
  const urlResult = baseURI + url;
  this.toString = function () {
    return urlResult;
  };
};
