import { widgetsConfig } from "./widget"
export function freelogFetch(
  url: string,
  options: any,
  appName: string,
): any {
  const widgetConfig = widgetsConfig.get(appName);
  options = options || {};
  if (url.indexOf("subFilePath=") == url.length - 12) {
    // TODO 这里需要处理，可能后缀不是html
    url += "index.html";
  }
  // console.log(widgetConfig, url, 8888)
  if (
    widgetConfig.name === "freelog-ui" &&
    !url.includes(widgetConfig.entry) &&
    !url.includes("localhost")
  ) {
    const urlObj = new URL(url);
    // url = widgetConfig.entry + url
    url = widgetConfig.entry + urlObj.pathname + urlObj.search;
  } else if (!url.includes(widgetConfig.entry) && url.includes("freelog.com")) {
    const urlObj = new URL(url);
    url = widgetConfig.entry + urlObj.pathname;
  }

  if (url.indexOf("freelog.com") > -1) {
    return fetch(url, { ...options, credentials: "include" });
  } else {
    return fetch(url, { ...options });
  }
}
