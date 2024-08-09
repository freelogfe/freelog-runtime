import { widgetsConfig } from "./widget";
let host = "https://file.freelog.com";
if(window.location.host.includes(".testfreelog.com")){
  host = "https://file.testfreelog.com"
}
export function freelogFetch(url: string, options: any, appName: string): any {
  const widgetConfig = widgetsConfig.get(appName);
  options = options || {};
  if (url.includes(host) && !url.includes(widgetConfig.exhibitId || widgetConfig.topExhibitId)) {
    const urlObj = new URL(url);
    // TODO 这里需要处理，可能后缀不是html
    url = widgetConfig.entry + urlObj.pathname;
  } 
  if (url.indexOf("freelog.com") > -1) {
    return fetch(url, { ...options, credentials: "include" });
  } else {
   
    return fetch(url, { ...options });
  }
}
