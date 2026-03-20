import { widgetsConfig } from "./widget";
import { urls } from "../config/urls";
import { baseInfo } from "../config/env";

const fileHost = urls.fileHost;
const authProcessor = urls.authProcessor;

export function freelogFetch(url: string, options: any, appName: string): any {
  const widgetConfig = widgetsConfig.get(appName);
  options = options || {};
  if (url == fileHost || url == fileHost + "/") {
    url = widgetConfig.entry + "/index.html";
  } else if (url.includes(fileHost)) {
    const urlObj = new URL(url);
    url = widgetConfig.entry + urlObj.pathname;
  }
  if (url == authProcessor || url == authProcessor.replace(/\/$/, "")) {
    return fetch(url + "index.html", { ...options });
  } 
  else if (url.includes(authProcessor.replace(/\/$/, ""))) {
    const urlObj = new URL(url);
    url = authProcessor.replace(/\/$/, "") + urlObj.pathname;
    return fetch(url, { ...options, mode: "cors" });
  }
  if (url.indexOf(baseInfo.HOST) > -1) {
    return fetch(url, { ...options, credentials: "include" });
  } else {
    return fetch(url, { ...options });
  }
}
