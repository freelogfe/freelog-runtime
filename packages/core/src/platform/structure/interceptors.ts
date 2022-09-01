import { rawFetch, rawURL } from "./rawObjects";

// @ts-ignore
window.fetch = (url: string, options?: any) => {
  if (url.endsWith("?subFilePath=")) {
    url = url + "/index.html";
  }
  console.log(22222 , url)

  if(url.includes("fileStream%3FsubFilePath=/")){
    url = url.replace("fileStream%3FsubFilePath=//", "fileStream?subFilePath=/")
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
  console.log(3333, url,baseURI )
  if(url.includes("fileStream%3FsubFilePath=/")){
    console.log(3333, url )
    url = url.replace("fileStream%3FsubFilePath=//", "fileStream?subFilePath=/")
  }
  if (baseURI === location.href) {
    console.log(url, baseURI);
    const a = new rawURL(url + "/ ");
    a.pathname = a.pathname + a.search;
    console.log(a);
    return a;
  }
  if(baseURI.includes("fileStream%3FsubFilePath=/")){
    baseURI = baseURI.replace("fileStream%3FsubFilePath=/", "fileStream?subFilePath=")
  }
  if (baseURI && !baseURI.includes("fileStream?subFilePath=")) {
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

export function defaultGetPublicPath2(entry: string) {
  var _URL = new URL(entry, location.href);
  const origin = _URL.origin;
  const pathname = _URL.pathname;
  var paths = pathname.split("/");
  paths.pop();
  return "".concat(origin).concat(paths.join("/"), "/");
}
