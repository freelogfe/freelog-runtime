import { widgetsConfig, widgetUserData, sandBoxs, FREELOG_DEV } from "./widget";
import { locations } from "./proxy";
export const SHARE_DETAIL = "detail";
export const SHARE_CONTENT = "content";
export const FREELOG_ROUTE_MAPS = "FREELOG_ROUTE_MAPS";
const rawLocation = window.location;
export function getShareUrl(exhibitId: string, type: "detail" | "content") {
  return `${rawLocation.origin}/${exhibitId}/${type}`;
}
export function mapShareUrl(routeMap: any) {
  // @ts-ignore
  const theme = widgetsConfig.get(this.name);
  // @ts-ignore
  const themeLocation = locations.get(this.name);
  console.log(routeMap, themeLocation);
  if (!theme.isTheme) {
    console.error("mapShareUrl ", "只能主题使用");
  }
  theme[FREELOG_ROUTE_MAPS] = routeMap || {};
  const href = themeLocation?.href;
  const data = isShareUrl(href);
  if (data && href) {
    const func = routeMap ? routeMap[data.type] : null;
    let route = "";
    if (func instanceof Function) {
      route = func(data.exhibitId);
    }
    themeLocation.href = route;
    themeLocation.pathname = route;
    console.log(func, routeMap, data, themeLocation);
  }
}
const urlTest = /^\/?.{24}\/(detail|content)$/;
export function isShareUrl(url: string) {
  if (urlTest.test(url)) {
    url = url.indexOf("/") === 0 ? url.replace("/", "") : url;
    const exhibitId = url.split("/")[0];
    const type = url.split("/")[1];
    return {
      exhibitId,
      type,
    };
  }
  return false;
}
