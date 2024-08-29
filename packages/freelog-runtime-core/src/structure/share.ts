import { widgetsConfig } from "./widget";
import { freelogApp, devData } from "./freelogApp";
import { DEV_FALSE, dev } from "./dev";
export const SHARE_DETAIL = "detail";
export const SHARE_CONTENT = "content";
export const FREELOG_ROUTE_MAPS = "FREELOG_ROUTE_MAPS";
export function getShareUrl(
  name: string,
  options: {
    exhibitId: string;
    itemId: string;
  },
  type: string
) {
  let exhibitId = "";
  let itemId = "";
  if (typeof options == "object") {
    exhibitId = options.exhibitId;
    itemId = options.itemId;
  } else {
    exhibitId = options as string;
  }
  let search = "";
  const devData = dev();
  const params = { ...devData.params };
  if (devData.type !== DEV_FALSE) {
    search = window.location.search;
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
  if (itemId) {
    return `${rawLocation.origin}/${exhibitId}/${itemId}/${type}${search}`;
  }
  return `${rawLocation.origin}/${exhibitId}/${type}${search}`;
}
const rawLocation = location;
// 只有在vue路由之前使用才有效, 但这种十分不合理，不应该在运行时来做
export async function mapShareUrl(name: string, routeMap: any) {
  return new Promise((resolve, reject) => {
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
        route = func(data.exhibitId, data.itemId);
        const search = window.location.search.includes("dev=http")
          ? window.location.search +
            `&${theme.name + "=" + freelogApp.router.encode(route)}`
          : `?${theme.name + "=" + freelogApp.router.encode(route)}`;
        window.history.replaceState(
          {},
          "",
          `${window.location.origin}${search}`
        );
        setTimeout(() => {
          freelogApp.router.replace({
            name: theme.name,
            path: route,
            replace: true,
          });
          setTimeout(() => {
            resolve(true);
          }, 222);
        }, 0);
      } else {
        resolve(true);
      }
    } else {
      resolve(true);
    }
  });
}
// const urlTest = /^\/?.{24}\/(\w{1,})\/?$/;
const urlTest = /^\/?.{24}(?:\/.{24})?\/(\w+)(?:\/|$)/;
export function isShareUrl(url: string) {
  const urlObj = new URL(url);
  let urltrim = url.replace(urlObj.search, "").replace(urlObj.origin, "");
  if (urlTest.test(urltrim)) {
    urltrim = urltrim.indexOf("/") === 0 ? urltrim.replace("/", "") : urltrim;
    const exhibitId = urltrim.split("/")[0];
    if (urltrim.split("/")[2]) {
      const itemId = urltrim.split("/")[1];
      const type = urltrim.split("/")[2];
      return {
        exhibitId,
        itemId,
        type,
      };
    } else {
      const type = urltrim.split("/")[1];
      return {
        exhibitId,
        type,
      };
    }
  }
  return false;
}
