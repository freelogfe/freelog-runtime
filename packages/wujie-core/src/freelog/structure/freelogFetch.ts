const origin = window.location.origin;
export function freelogFetch(
  widgetConfig: any,
  url: string,
  options?: RequestInit
) {
  options = options || {};
  if (url.indexOf("subFilePath=") == url.length - 12) {
    // TODO 这里需要处理，可能后缀不是html
    url += "index.html";
  }
  // console.log(widgetConfig, url, 8888)
  if(widgetConfig.name === "freelog-ui" && !url.includes(widgetConfig.entry) && !url.includes("localhost")){
    const urlObj = new URL(url);
    // url = widgetConfig.entry + url
    url = widgetConfig.entry+ urlObj.pathname + urlObj.search;
    console.log(url, 90909, widgetConfig)
  }else
   if(!url.includes(widgetConfig.entry) && url.includes("freelog.com")){
    const urlObj = new URL(url);
    url = widgetConfig.entry + urlObj.pathname;
  }

  if (url.indexOf("freelog.com") > -1) {
    return fetch(url, { ...options, credentials: "include" });
  } else {
    return fetch(url, { ...options });
  }
}
