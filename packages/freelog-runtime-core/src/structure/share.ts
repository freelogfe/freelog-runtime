import { widgetsConfig, widgetUserData, FREELOG_DEV } from "./widget";
export const SHARE_DETAIL = "detail";
export const SHARE_CONTENT = "content";
export const FREELOG_ROUTE_MAPS = "FREELOG_ROUTE_MAPS";
export function getShareUrl(
  name: string,
  exhibitId: string,
  type: "detail" | "content"
) {
  return `${rawLocation.origin}/${exhibitId}/${type}`;
}
const rawLocation = location;
const rawHistory = history;
// 只有在vue路由之前使用才有效, 但这种十分不合理，不应该在运行时来做
export function mapShareUrl(name: string, routeMap: any) {
  // @ts-ignore
  const theme = widgetsConfig.get(name);
  if (!theme.isTheme) {
    console.error("mapShareUrl ", "只能主题使用");
  }
  theme[FREELOG_ROUTE_MAPS] = routeMap || {};
  const href = rawLocation?.href;
  const data = isShareUrl(href);
  if (data && href) {
    const func = routeMap ? routeMap[data.type] : null;
    let route = "";
    if (func instanceof Function) {
      route = func(data.exhibitId);
    }
    const last = rawLocation.search
      ? rawLocation.search + `&${theme.name}${route}`
      : `?${theme.name}${route}`;
    const url = rawLocation.origin + last;
    rawHistory.replaceState(rawHistory.state, "", url);
  }
}
const urlTest = /^\/?.{24}\/(detail|content)\/?$/;
export function isShareUrl(url: string) {
  const urlObj = new URL(url);
  let urltrim = url.replace(urlObj.search, "").replace(urlObj.origin, "");
  if (urlTest.test(urltrim)) {
    urltrim = urltrim.indexOf("/") === 0 ? urltrim.replace("/", "") : urltrim;
    const exhibitId = urltrim.split("/")[0];
    const type = urltrim.split("/")[1];
    debugger
    return {
      exhibitId,
      type,
    };
  }
  return false;
}
