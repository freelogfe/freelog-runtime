import { widgetsConfig } from "./widget";
import { urls } from "../config/urls";
import { baseInfo } from "../config/env";

const fileHost = urls.fileHost;

export function freelogFetch(url: string, options: any, appName: string): any {
  const widgetConfig = widgetsConfig.get(appName);
  options = options || {};
  if (url.endsWith("package/")) {
    url = widgetConfig.entry + "/index.html";
  } 
  else if (url.includes(fileHost) && !url.includes("/package")) {
    const urlObj = new URL(url);
    url = widgetConfig.entry + urlObj.pathname.replace(/\/exhibits\/.{24}package/g, "");
  }
  if (url.indexOf(baseInfo.HOST) > -1) {
    return fetch(url, { ...options, credentials: "include" });
  } else {
    return fetch(url, { ...options });
  }
}
