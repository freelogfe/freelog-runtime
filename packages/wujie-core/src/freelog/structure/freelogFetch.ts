export function freelogFetch(
  widgetConfig: any,
  url: string,
  options?: RequestInit
) {
  options = options || {};
  const urlObj = new URL(url);
  if (url.indexOf("subFilePath=") == url.length - 12) {
    // TODO 这里需要处理，可能后缀不是html
    url += "index.html";
  }
  if(!url.includes(widgetConfig.entry)){
    url = widgetConfig.entry + urlObj.pathname;
  }
  if (url.indexOf("freelog.com") > -1) {
    return fetch(url, { ...options, credentials: "include" });
  } else {
    return fetch(url, { ...options });
  }
}
