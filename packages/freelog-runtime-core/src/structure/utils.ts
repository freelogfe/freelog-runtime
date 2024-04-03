import { baseURL } from "../base/baseInfo";
import { freelogApp } from "./freelogApp";

import { widgetsConfig, widgetUserData } from "./widget";
import { initWindowListener } from "../bridge/eventOn";
import { addAuth, goLogin, goLoginOut } from "../bridge/index";
import {
  getCurrentUser as _getCurrentUser,
  putUserData as _putUserData,
  getUserData as _getUserData,
} from "../base";
export function freelogFetch(url: string, options?: any) {
  options = options || {};
  if (url.indexOf("freelog.com") > -1) {
    return fetch(url, { ...options, credentials: "include" });
  } else {
    return fetch(url, { ...options });
  }
}
export function getContainer(
  container: string | HTMLElement
): HTMLElement | null | undefined {
  // @ts-ignore
  return typeof container === "string"
    ? document.querySelector.bind(document)("#" + container)
    : container;
}

export function createContainer(
  container: string | HTMLElement,
  id: string
): HTMLElement {
  const father =
    typeof container === "string"
      ? document.querySelector.bind(document)("#" + container)
      : container;
  // @ts-ignore
  if (father?.querySelector("#" + id)) return father?.querySelector("#" + id);
  let child = document.createElement("DIV");
  child.setAttribute("id", id);
  father?.appendChild(child);
  return child;
}

export function deleteContainer(
  father: string | HTMLElement,
  child: string | HTMLElement
): any {
  const fatherContainer =
    typeof father === "string" ? document.querySelector("#" + father) : father;
  const childContainer =
    typeof child === "string" ? document.querySelector("#" + child) : child;

  return childContainer ? fatherContainer?.removeChild(childContainer) : true;
}

export function createScript(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const script: HTMLScriptElement = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    // script.async = true
    script.defer = true;
    // @ts-ignore
    document.getElementsByTagName
      .bind(document)("head")
      .item(0)
      .appendChild(script);
  });
}

export function createCssLink(href: string, type?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const link: HTMLLinkElement = document.createElement("link");
    link.href = href;
    link.rel = "stylesheet";
    link.type = type || "text/css";
    link.onload = resolve;
    link.onerror = reject;
    // @ts-ignore
    document.getElementsByTagName
      .bind(document)("head")
      .item(0)
      .appendChild(link);
  });
}
//
export function resolveUrl(path: string, params?: any): string {
  // @ts-ignore
  const { nodeType } = freelogApp.nodeInfo;
  params = Object.assign({ nodeType }, params);
  var queryStringArr = [];
  for (let key in params) {
    if (params[key] != null) {
      queryStringArr.push(`${key}=${params[key]}`);
    }
  }
  return `${baseURL}${path}?${queryStringArr.join("&")}`;
}
// 这里的key使用的是资源名称
export function setUserDataKeyForDev(name: string, resourceName: string) {
  widgetsConfig.get(name).DevResourceName = resourceName;
}
export function getSelfWidgetId(name: string) {
  return widgetsConfig.get(name)?.articleId;
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
export let userInfo: any = null;
export async function getUserInfo() {
  initWindowListener();
  if (userInfo) return userInfo;
  const res = await _getCurrentUser();
  userInfo = res.data.errCode === 0 ? res.data.data : null;
  setUserInfo(userInfo);
  return userInfo;
}
export function getCurrentUser(name?: string) {
  return userInfo;
}
export async function setUserInfo(info: any) {
  window.userId = info ? info.userId + "" : "";
  userInfo = info;
}
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

export async function setUserData(name: string, key: string, data: any) {
  key = window.isTest ? key + "-test" : key;
  // @ts-ignore
  let userData = widgetUserData.get(name) || {};
  let config = widgetsConfig.get(name);
  userData[key] = data;
  let widgetId = btoa(encodeURI(config.articleName));
  /**
   * 本地开发时： 如果本地开发的与线上主题或插件不是同一个资源，可以通过在入口文件加载页面加上主题或插件本身的作品名称,
   * 例如： freelogApp.setSelfResourceNameForDev("Freelog/dev-docs");
   * 这样可以保证更换到线上是一致的
   */
  if (config.isDev) {
    widgetId = config.DevResourceName ? config.DevResourceName : widgetId;
  }
  const nodeId = freelogApp.nodeInfo.nodeId;
  // 用户如果两台设备更新数据，可以做一个保存请求的数据对比最新的数据，如果不同，提示给插件（或者传递参数强制更新）,这个后端来做？
  const res = await _putUserData([nodeId], {
    appendOrReplaceObject: {
      [widgetId]: userData,
    },
  });
  return res;
}

export async function getUserData(name: string, key: string) {
  key = window.isTest ? key + "-test" : key;
  let userData = widgetUserData.get(name);
  if (userData) {
    return userData[key];
  }
  let config = widgetsConfig.get(name);
  let widgetId = btoa(encodeURI(config.articleName));

  if (config.isDev) {
    widgetId = config.DevResourceName ? config.DevResourceName : widgetId;
  }
  const nodeId = freelogApp.nodeInfo.nodeId;
  const res = await _getUserData([nodeId]);
  userData = res.data[widgetId] || {};
  widgetUserData.set(name, userData);
  return userData[key];
}

export function callLogin(name: string, resolve: Function) {
  if (!userInfo) {
    goLogin(resolve);
  }
}
export function callLoginOut(name: string) {
  if (userInfo) {
    goLoginOut();
  }
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
export function getCurrentUrl(name: string) {
  // if (!widgetsConfig.get(name).isTheme) {
  //   console.error("仅主题可用");
  //   return "";
  // }
  return rawLocation.href;
}
export function isMobile() {
  var browser = {
    versions: (function() {
      var u = navigator.userAgent;
      // app = navigator.appVersion;
      return {
        //移动终端浏览器版本信息
        trident: u.indexOf("Trident") > -1, //IE内核
        presto: u.indexOf("Presto") > -1, //opera内核
        webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
        gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") === -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
        iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf("iPad") > -1, //是否iPad
        webApp: u.indexOf("Safari") === -1, //是否web应该程序，没有头部与底部
      };
    })(),
    // @ts-ignore
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),
  };
  //如果是移动端就进行这里
  if (
    browser.versions.mobile ||
    browser.versions.ios ||
    browser.versions.android ||
    browser.versions.iPhone ||
    browser.versions.iPad
  ) {
    return true;
  } else {
    return false;
  }
}
