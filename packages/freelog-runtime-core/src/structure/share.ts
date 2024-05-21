import { widgetsConfig } from "./widget";
import { freelogApp, devData } from "./freelogApp";
import { DEV_FALSE, dev } from "./dev";
export const SHARE_DETAIL = "detail";
export const SHARE_CONTENT = "content";
export const FREELOG_ROUTE_MAPS = "FREELOG_ROUTE_MAPS";
export function getShareUrl(
  name: string,
  exhibitId: string,
  type: string
) {
  let search = "";
  const devData = dev();
  const params = { ...devData.params };
  if (devData.type !== DEV_FALSE) {
    search = window.location.search
    widgetsConfig.forEach((element) => {
      search = search.replace(
        "&" + element.name + "=" + encodeURIComponent(params[element.name]),
        ""
      );
    });
  }
  if (search) {
    search = "/" + search;
  }
  return `${rawLocation.origin}/${exhibitId}/${type}${search}`;
}
const rawLocation = location;
// 只有在vue路由之前使用才有效, 但这种十分不合理，不应该在运行时来做
export function mapShareUrl(name: string, routeMap: any) {
  // @ts-ignore
  const theme = widgetsConfig.get(name);
  // if (!theme.isTheme) {
  //   console.error("mapShareUrl ", "只能主题使用");
  // }
  theme[FREELOG_ROUTE_MAPS] = routeMap || {};
  const href = rawLocation?.href;
  const data = isShareUrl(href);
  if (data && href) {
    const func = routeMap ? routeMap[data.type] : null;
    let route = "";
    if (func) {
      route = func(data.exhibitId);
      const search = window.location.search
        ? window.location.search + `&${theme.name + "=" + route}`
        : `?${theme.name + "=" + route}`;
      window.history.replaceState({}, "", `${window.location.origin}${search}`);
      setTimeout(() => {
        freelogApp.router.replace({
          name: theme.name,
          path: route,
          replace: true,
        });
      }, 0);
    }
  }
}
const urlTest = /^\/?.{24}\/(\w{1,})\/?$/;
export function isShareUrl(url: string) {
  const urlObj = new URL(url);
  let urltrim = url.replace(urlObj.search, "").replace(urlObj.origin, "");
  if (urlTest.test(urltrim)) {
    urltrim = urltrim.indexOf("/") === 0 ? urltrim.replace("/", "") : urltrim;
    const exhibitId = urltrim.split("/")[0];
    const type = urltrim.split("/")[1];
    return {
      exhibitId,
      type,
    };
  }
  return false;
}
