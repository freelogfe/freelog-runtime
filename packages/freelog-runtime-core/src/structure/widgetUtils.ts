import { widgetsConfig } from "./widget";
import { freelogApp } from "freelog-runtime-api";
import microApp from "@micro-zoe/micro-app";

const { getExhibitDepInfo, getExhibitById } = freelogApp;
const rawDocument = window.document;
const rawLocation = window.location;
export function getCurrentUrl(name: string, path: string) {
  if (path) {
    const searchs = rawLocation.search.substring(1).split("&");
    const acc: any[] = [];
    searchs.forEach((item) => {
      let [key, value] = item.split("=");
      if (key == name) {
        value = microApp.router.encode(path);
      }
      acc.push(`${key}=${value}`);
    });
    return rawLocation.origin + "/?" + acc.join("&");
  }
  return rawLocation.href;
}
export function getSelfWidgetRenderName(name: string) {
  return widgetsConfig.get(name)?.name;
}
/**
 *
 * @param name
 * @param routeMap 路由映射表
 * @returns
 */
export function assembleUrl(
  name: string,
  routeMap: {
    [key: string]: string;
  }
) {
  const acc: any[] = [];
  Object.keys(routeMap).forEach((key: string) => {
    if (routeMap[key]) {
      const value = microApp.router.encode(routeMap[key]);
      acc.push(`${key}=${value}`);
    }
  });
  return rawLocation.origin + "/?" + acc.join("&");
}
// TODO 这里可能已经不适应了，需要另想办法
export function getStaticPath(name: string, path: string) {
  if (!/^\//.test(path)) {
    path = "/" + path;
  }
  // @ts-ignore
  return widgetsConfig.get(name).entry + path;
}
export function getTopExhibitId(name: string) {
  return (
    widgetsConfig.get(name).topExhibitId || widgetsConfig.get(name).exhibitId
  );
}
export function getSelfNid(name: string) {
  return widgetsConfig.get(name).nid;
}

export async function getSelfPropertyForTheme(name: string) {
  const widgetConfig = widgetsConfig.get(name);
  return widgetConfig.property || {};
}

export async function getSelfDepForTheme(name: string, isFromServer: boolean) {
  const widgetConfig = widgetsConfig.get(name);
  return widgetConfig.dependencyTree || [];
}

export async function getSelfProperty(name: string) {
  const widgetConfig = widgetsConfig.get(name);

  const { exhibitId, nid, topExhibitId } = widgetsConfig.get(name);
  if (exhibitId) {
    const res = await getExhibitById(name, exhibitId, {
      isLoadVersionProperty: 1,
    });
    if (!res.data || (res.data && res.data.errCode !== 0)) {
      return res;
    }
    const property = res.data.data.versionInfo.exhibitProperty;
    res.data.data = property;
    widgetConfig.property = property;
    return res;
  }
  const res: any = getExhibitDepInfo(name, topExhibitId, { articleNids: nid });
  if (!res.data || (res.data && res.data.errCode !== 0)) {
    return res;
  }
  const property = res.data.data[0].articleProperty;
  res.data.data = property;
  widgetConfig.property = property;
  return res;
}

export async function getSelfDep(name: string) {
  const widgetConfig = widgetsConfig.get(name);
  const { exhibitId, nid, topExhibitId } = widgetsConfig.get(name);
  const res = await getExhibitById(name, exhibitId || topExhibitId, {
    isLoadVersionProperty: 1,
  });
  console.log("getSelfDep", res);
  if (!res.data || (res.data && res.data.errCode !== 0)) {
    return res;
  }
  const dependencyTree = res.data.data.versionInfo.dependencyTree.filter(
    (item: any) => {
      if (nid) {
        return item.parentNid == nid;
      }
      return true;
    }
  );
  res.data.data = dependencyTree;
  widgetConfig.dependencyTree = dependencyTree;
  return res;
}
export function reload(name: string) {
  if (widgetsConfig.get(name).isTheme) {
    rawLocation.reload();
  }
}
const immutableKeys = ["width"];
const viewPortValue = {
  width: "device-width", // immutable
  height: "device-height", // not supported in browser
  "initial-scale": 1, // 0.0-10.0   available for theme
  "maximum-scale": 1, // 0.0-10.0   available for theme
  "minimum-scale": 1, // 0.0-10.0   available for theme
  "user-scalable": "no", // available for theme
  "viewport-fit": "auto", // not supported in browser
};
const metaEl: any = rawDocument.querySelectorAll('meta[name="viewport"]')[0];
export function getViewport(name: string) {
  return metaEl.getAttribute("content");
}
export function setViewport(name: string, keys: any) {
  // @ts-ignore
  // 如果不是主题
  if (!widgetsConfig.get(name)?.isTheme) {
    return;
  }
  Object.keys(keys).forEach((key: any) => {
    if (viewPortValue.hasOwnProperty(key) && !immutableKeys.includes(key)) {
      //  开发体验最好做下验证值是否合法
      // @ts-ignore
      viewPortValue[key] = keys[key];
    }
  });
  let content = "";
  Object.keys(viewPortValue).forEach((key: any) => {
    if (viewPortValue.hasOwnProperty(key)) {
      // @ts-ignore
      content += key + "=" + viewPortValue[key] + ",";
    }
  });
  metaEl.setAttribute("content", content.substring(0, content.length - 1));
}

export function setTabLogo(Url: string) {
  // fetch("/freelog.ico").then((res: Response) => {
  //   res.blob().then((blob: Blob) => {
  //     const objectURL = URL.createObjectURL(blob);
  //     var link: HTMLLinkElement =
  //       document.querySelector.bind(document)('link[rel*="icon"]') ||
  //       document.createElement("link");
  //     link.type = "image/x-icon";
  //     link.rel = "shortcut icon";
  //     link.href = objectURL; // 'http://www.stackoverflow.com/favicon.ico'
  //     document.getElementsByTagName.bind(document)("head")[0].appendChild(link);
  //   });
  // });
  var link: HTMLLinkElement =
    rawDocument.querySelector.bind(document)('link[rel*="icon"]') ||
    rawDocument.createElement("link");
  link.type = "image/x-icon";
  link.rel = "shortcut icon";
  link.href = Url; // 'http://www.stackoverflow.com/favicon.ico'
  rawDocument.getElementsByTagName
    .bind(rawDocument)("head")[0]
    .appendChild(link);
}
