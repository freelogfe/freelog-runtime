import { freelogApp } from "./freelogApp";
import { widgetsConfig } from "./widget";
import { addAuth } from "../bridge/index";

// 这里的key使用的是资源名称
export function setUserDataKeyForDev(name: string, resourceName: string) {
  widgetsConfig.get(name).DevResourceName = resourceName;
}
export function getSelfWidgetRenderName(name: string) {
  return widgetsConfig.get(name)?.widgetRenderName;
}

export function getSelfArticleId(name: string) {
  return widgetsConfig.get(name)?.articleId;
}
export function getSelfExhibitId(name: string) {
  return widgetsConfig.get(name)?.exhibitId;
}
export function getSelfConfig(name: string) {
  //  由于config只有一层，所以用...就够了
  return { ...widgetsConfig.get(name).config };
}
//  if error  这里不需要参数，除了运行时自行调用，需要抽离出来不与插件调用混在一起
//  紧急，增加方法加载子依赖传递作品id，通过作品id查询到孙依赖插件
export async function getSubDep(name: string, exhibitId?: any) {
  let isTheme = false;
  let widgetConfig = widgetsConfig.get(name);

  if (!widgetConfig) {
    isTheme = true;
  } else {
    exhibitId = exhibitId || widgetsConfig.get(name).exhibitId;
  }

  // @ts-ignore
  let response = await freelogApp.getExhibitInfoByAuth(name, exhibitId);
  debugger
  if (response.authErrorType && isTheme) {
    await new Promise<void>(async (resolve, reject) => {
      if (response.authCode === 502) {
        await new Promise<void>(async (resolve, reject) => {
          addAuth(name, exhibitId, {
            immediate: true,
          });
          freelogApp.onLogin(async () => {
            resolve();
          });
        });
        response = await freelogApp.getExhibitInfoByAuth(name, exhibitId);
      }
      if (response.authErrorType) {
        await addAuth(name, exhibitId, {
          immediate: true,
        });
      }
      resolve();
    });
    response = await freelogApp.getExhibitInfoByAuth(name, exhibitId);
    if (response.authErrorType) {
      await new Promise<void>(async (resolve, reject) => {
        await addAuth(name, exhibitId, {
          immediate: true,
        });
        resolve();
      });
    }
    response = await freelogApp.getExhibitInfoByAuth(name, exhibitId);
  }
  const exhibitName = decodeURI(response.headers["freelog-exhibit-name"]);
  const articleNid = decodeURI(response.headers["freelog-article-nid"]);
  const resourceType = decodeURI(
    response.headers["freelog-article-resource-type"]
  );
  let subDep = decodeURI(response.headers["freelog-article-sub-dependencies"]);
  subDep = subDep ? JSON.parse(decodeURIComponent(subDep)) : [];

  let exhibitProperty = decodeURI(response.headers["freelog-exhibit-property"]);
  exhibitProperty = exhibitProperty
    ? JSON.parse(decodeURIComponent(exhibitProperty))
    : {};
  return {
    exhibitName,
    exhibitId,
    articleNid,
    resourceType,
    subDep,
    versionInfo: { exhibitProperty },
    ...response.data.data,
  };
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
export function getViewport(name: string) {
  return metaEl.getAttribute("content");
}
export function setViewport(name: string, keys: any) {
  // @ts-ignore
  // 如果是主题
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
