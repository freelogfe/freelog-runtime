// 工具utils：获取容器，生成容器，销毁容器，生成id

import { baseURL, isTest } from "./base";
import { freelogApp } from "./freelogApp";

import { widgetsConfig, widgetUserData, sandBoxs, FREELOG_DEV } from "./widget";
import { initUserCheck } from "../security";
import { addAuth, goLogin, goLoginOut } from "../bridge/index";
import {
  getCurrentUser as _getCurrentUser,
  putUserData as _putUserData,
  getUserData as _getUserData,
} from "freelog-runtime-api";
export function freelogFetch(url: string, options?: any) {
  options = options || {};
  if (url.indexOf("freelog.com") > -1) {
    return fetch(url, { ...options, credentials: "include" });
  } else {
    return fetch(url, { ...options });
  }
}
// TODO  此文件的方法需要整理分离出freeelogApp下的和内部使用的
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

// TODO 确定返回类型
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
// TODO 调试用的widgetId，未来应该在测试节点去显示，目前用的是articledId
export function getSelfWidgetId() {
  // @ts-ignore
  return widgetsConfig.get(this.name)?.articleId;
}
export function getSelfArticleId() {
  // @ts-ignore
  return widgetsConfig.get(this.name)?.articleId;
}
export function getSelfExhibitId() {
  // @ts-ignore
  return widgetsConfig.get(this.name)?.exhibitId;
}
export function getSelfConfig() {
  // @ts-ignore  由于config只有一层，所以用...就够了
  return { ...widgetsConfig.get(this.name).config };
}
// TODO if error  这里不需要参数，除了运行时自行调用，需要抽离出来不与插件调用混在一起
// TODO 紧急，增加方法加载子依赖传递作品id，通过作品id查询到孙依赖插件
export async function getSubDep(exhibitId?: any) {
  let isTheme = false;
  // @ts-ignore
  const that = this || {};
  let widgetSandBox = sandBoxs.get(that.name);
  if (!widgetSandBox) {
    isTheme = true;
    widgetSandBox = {
      name: exhibitId,
      exhibitId,
      isTheme,
    };
  } else {
    exhibitId = exhibitId || widgetsConfig.get(that.name).exhibitId;
  }
  // @ts-ignore
  let response = await freelogApp.getExhibitInfoByAuth.bind(widgetSandBox)(
    exhibitId
  );
  if (response.authErrorType && isTheme) {
    await new Promise<void>(async (resolve, reject) => {
      if (response.authCode === 502) {
        await new Promise<void>(async (resolve, reject) => {
          addAuth.bind(widgetSandBox)(exhibitId, {
            immediate: true,
          });
          freelogApp.onLogin(async () => {
            resolve();
          });
        });
        response = await freelogApp.getExhibitInfoByAuth.bind(widgetSandBox)(
          exhibitId
        );
      }
      if (response.authErrorType) {
        await addAuth.bind(widgetSandBox)(exhibitId, {
          immediate: true,
        });
      }
      resolve();
    });
    response = await freelogApp.getExhibitInfoByAuth.bind(widgetSandBox)(
      exhibitId
    );
    if (response.authErrorType) {
      await new Promise<void>(async (resolve, reject) => {
        await addAuth.bind(widgetSandBox)(exhibitId, {
          immediate: true,
        });
        resolve();
      });
    }
    response = await freelogApp.getExhibitInfoByAuth.bind(widgetSandBox)(
      exhibitId
    );
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
  if (userInfo) return userInfo;
  const res = await _getCurrentUser();
  userInfo = res.data.errCode === 0 ? res.data.data : null;
  setUserInfo(userInfo);
  initUserCheck();
  return userInfo;
}
export function getCurrentUser() {
  return userInfo;
}
export async function setUserInfo(info: any) {
  window.userId = info ? info.userId + "" : "";
  userInfo = info;
}
export function getStaticPath(path: string) {
  if (!/^\//.test(path)) {
    path = "/" + path;
  }
  // @ts-ignore
  return widgetsConfig.get(this.name).entry + path;
}
const rawLocation = window.location;

export function reload() {
  // @ts-ignore
  if (widgetsConfig.get(this.name).isTheme) {
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
var rawDocument = window.document;
var metaEl: any = rawDocument.querySelectorAll('meta[name="viewport"]')[0];
export function getViewport() {
  return metaEl.getAttribute("content");
}
export function setViewport(keys: any) {
  // @ts-ignore
  const that = this;
  // 如果是主题
  if (!widgetsConfig.get(that.name)?.isTheme) {
    return;
  }
  Object.keys(keys).forEach((key: any) => {
    if (viewPortValue.hasOwnProperty(key) && !immutableKeys.includes(key)) {
      // TODO 开发体验最好做下验证值是否合法
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

export async function setUserData(key: string, data: any) {
  key = window.isTest ? key + "-test" : key;
  // TODO 必须验证格式正确
  // @ts-ignore
  const name = this.name;
  let userData = widgetUserData.get(name) || {};
  let config = widgetsConfig.get(name);
  userData[key] = data;
  let widgetId = btoa(encodeURI(config.articleName));
  if (name === FREELOG_DEV) {
    widgetId = sandBoxs.get(name).proxy.FREELOG_RESOURCENAME;
  }
  const nodeId = freelogApp.nodeInfo.nodeId;
  // TODO 用户如果两台设备更新数据，可以做一个保存请求的数据对比最新的数据，如果不同，提示给插件（或者传递参数强制更新）
  const res = await _putUserData([nodeId], {
    appendOrReplaceObject: {
      [widgetId]: userData,
    },
  });
  return res;
}

export async function getUserData(key: string) {
  key = window.isTest ? key + "-test" : key;
  // @ts-ignore
  const name = this.name;
  let userData = widgetUserData.get(name);
  if (userData) {
    return userData[key];
  }
  let config = widgetsConfig.get(name);
  let widgetId = btoa(encodeURI(config.articleName));
  if (name === FREELOG_DEV) {
    widgetId = sandBoxs.get(name).proxy.FREELOG_RESOURCENAME;
  }
  const nodeId = freelogApp.nodeInfo.nodeId;
  const res = await _getUserData([nodeId]);
  userData = res.data[widgetId] || {};
  widgetUserData.set(name, userData);
  return userData[key];
}

export function callLogin(resolve: Function) {
  if (!userInfo) {
    goLogin(resolve);
  }
}
export function callLoginOut() {
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
    document.querySelector.bind(document)('link[rel*="icon"]') ||
    document.createElement("link");
  link.type = "image/x-icon";
  link.rel = "shortcut icon";
  link.href = Url; // 'http://www.stackoverflow.com/favicon.ico'
  document.getElementsByTagName.bind(document)("head")[0].appendChild(link);
}

export function isMobile() {
  var browser = {
    versions: (function () {
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
