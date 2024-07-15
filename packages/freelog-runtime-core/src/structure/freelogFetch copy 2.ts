import { widgetsConfig } from "./widget";
const isTest = window.location.host.includes("testfreelog.com") ? true : false;
export function freelogFetch(url: string, options: any, appName: string): any {
  const baseUrl = isTest ? "https://file.testfreelog.com" : "https://file.freelog.com";
  const widgetConfig = widgetsConfig.get(appName);
  options = options || {};
  if (url.endsWith("package/")) {
    // TODO 这里需要处理，可能后缀不是html
    url = widgetConfig.entry + "/index.html";
  } 
  else if (url.includes(baseUrl) &&  !url.includes("/package")) {
    const urlObj = new URL(url);
    url = widgetConfig.entry + urlObj.pathname.replace(/\/exhibits\/.{24}package/g, "");
  }
  if (url.indexOf("freelog.com") > -1) {
    return fetch(url, { ...options, credentials: "include" });
  } else {
    return fetch(url, { ...options });
  }
}
