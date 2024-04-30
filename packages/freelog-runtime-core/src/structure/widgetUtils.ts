import { widgetsConfig } from "./widget";
import { getExhibitDepInfo, getExhibitInfo } from "../freelogApp/api";
export function getSelfWidgetRenderName(name: string) {
  return widgetsConfig.get(name)?.name;
}

// TODO 这里可能已经不适应了，需要另想办法
export function getStaticPath(name: string, path: string) {
  if (!/^\//.test(path)) {
    path = "/" + path;
  }
  // @ts-ignore
  return widgetsConfig.get(name).entry + path;
}
const rawLocation = window.location;
/**
 *
 * @param name
 * @param isFromServer  是否从服务器获取，以防加载插件时没有传递property或不希望被加载时篡改
 * @returns
 */
export async function getSelfProperty(name: string, isFromServer: boolean) {
  const widgetConfig = widgetsConfig.get(name);
  if (!isFromServer) {
    return widgetConfig.property || {};
  }
  const { exhibitId, nid, topExhibitId } = widgetsConfig.get(name);
  if (exhibitId) {
    const res = await getExhibitInfo(name, exhibitId, {
      isLoadVersionProperty: 1,
    });
    const property = res.data.data.versionInfo.exhibitProperty;
    widgetConfig.property = property;
    return property;
  }
  const res: any = getExhibitDepInfo(name, topExhibitId, { articleNids: nid });
  const property = res.data.data[0].articleProperty;
  widgetConfig.property = property;
  return property;
}
export async function getSelfDependencyTree(
  name: string,
  isFromServer: boolean
) {
  const widgetConfig = widgetsConfig.get(name);
  if (!isFromServer) {
    return widgetConfig.dependencyTree || [];
  }
  const { exhibitId, nid, topExhibitId } = widgetsConfig.get(name);
  const res = await getExhibitInfo(name, exhibitId || topExhibitId, {
    isLoadVersionProperty: 1,
  });
  const dependencyTree = res.data.data.versionInfo.dependencyTree.filter(
    (item: any) => (nid ? item.parentNid === nid : true)
  );
  widgetConfig.dependencyTree = dependencyTree;
  return dependencyTree;
}
export function reload(name: string) {
  // @ts-ignore
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
const rawDocument = window.document;
const metaEl: any = rawDocument.querySelectorAll('meta[name="viewport"]')[0];
console.log(metaEl, 9999);
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

/**
 *
 *
 *
 */
// export async function createUserData(userNodeData: any) {
//   const nodeId = window.freelogApp.nodeInfo.nodeId
//   const res = await frequest(node.postUserData, "", {
//     nodeId,
//     userNodeData
//   });
//   return res;
// }

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
export function getCurrentUrl(name: string) {
  return rawLocation.href;
}
