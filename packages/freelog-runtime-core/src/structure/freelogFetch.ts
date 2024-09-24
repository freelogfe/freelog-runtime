import { widgetsConfig } from "./widget";
let host = "https://file.freelog.com";
if(window.location.host.includes(".testfreelog.com")){
  host = "https://file.testfreelog.com"
}
// @ts-ignore
window.freelogHost = host
export function freelogFetch(url: string, options: any, appName: string): any {
  const widgetConfig = widgetsConfig.get(appName);
  options = options || {};
  if (url.includes(host) && !url.includes(widgetConfig.exhibitId || widgetConfig.topExhibitId)) {
    const urlObj = new URL(url);
    url = widgetConfig.entry + urlObj.pathname;
  } 
  if (url.indexOf("freelog.com") > -1) {
    return fetch(url, { ...options, credentials: "include" });
  } else {
   
    return fetch(url, { ...options });
  }
}

const createURL = (function (): (path: string | URL, base?: string) => any {
  class Location extends URL {}
  return (path: string | URL, base?: string): any => {
    return (base ? new Location('' + path, base) : new Location('' + path)) as any
  }
})()

function getEffectivePath (url: string): string {
  const { origin, pathname } = createURL(url)
  if (/\.(\w+)$/.test(pathname)) {
    const pathArr = `${origin}${pathname}`.split('/')
    pathArr.pop()
    return pathArr.join('/') + '/'
  }

  return `${origin}${pathname}/`.replace(/\/\/$/, '/')
}
