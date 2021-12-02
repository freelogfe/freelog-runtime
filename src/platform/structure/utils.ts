// 工具utils：获取容器，生成容器，销毁容器，生成id

import { baseUrl } from "../../services/base";
import { getExhibitInfoByAuth } from "./api";
import { widgetsConfig, widgetUserData, sandBoxs, FREELOG_DEV } from "./widget";
import frequest from "../../services/handler";
import user from "../../services/api/modules/user";
import node from "../../services/api/modules/node";
import { addAuth, goLogin, goLoginOut } from "../../bridge/index";

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
// let count = 0;
export function createId(subId: string, count?: number): any {
  let id = count ? "freelog-" + subId + "-" + count : "freelog-" + subId;
  // @ts-ignore
  return document.querySelector.bind(document)("#" + id)
    ? createId(subId, ++count)
    : id;
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
  const { nodeType } = window.freelogApp.nodeInfo;
  params = Object.assign({ nodeType }, params);
  var queryStringArr = [];
  for (let key in params) {
    if (params[key] != null) {
      queryStringArr.push(`${key}=${params[key]}`);
    }
  }
  return `${baseUrl}${path}?${queryStringArr.join("&")}`;
}
// TODO 这个根本不需要
export async function getSelfId() {
  // @ts-ignore
  return widgetsConfig.get(this.name)?.exhibitId;
}

export async function getSelfConfig() {
  // @ts-ignore  由于config只有一层，所以用...就够了
  return { ...widgetsConfig.get(this.name)?.config };
}
// TODO if error  这里不需要参数，除了运行时自行调用，需要抽离出来不与插件调用混在一起
// TODO 紧急，增加方法加载子依赖传递资源id，通过资源id查询到孙依赖插件
export async function getSubDep(exhibitId?: any) {
  let isTheme = false;
  // @ts-ignore
  const that = this || {};
  let widgetSandBox = sandBoxs.get(that.name);
  if (!widgetSandBox) {
    isTheme = true;
    widgetSandBox = {
      name: "freelog-" + exhibitId,
      exhibitId,
      isTheme,
    };
  } else {
    exhibitId = widgetsConfig.get(that.name).exhibitId;
  }
  // @ts-ignore
  let response = await getExhibitInfoByAuth.bind(widgetSandBox)(exhibitId);
  if (response.authErrorType === 1 && isTheme) {
    // 只有主题才需要权限验证
    await new Promise((resolve, reject) => {
      addAuth.bind(widgetSandBox)(exhibitId, resolve, reject, {
        immediate: true,
      });
    });
    response = await getExhibitInfoByAuth.bind(widgetSandBox)(exhibitId);
    if (response.authErrorType) {
      await new Promise((resolve, reject) => {
        addAuth.bind(widgetSandBox)(exhibitId, resolve, reject, {
          immediate: true,
        });
      });
    }

    response = await getExhibitInfoByAuth.bind(widgetSandBox)(exhibitId);
  }
  const exhibitName = decodeURI(response.headers["freelog-exhibit-name"]);
  const articleNid = decodeURI(response.headers["freelog-article-nid"]);
  const articleResourceType = decodeURI(
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
    articleResourceType,
    subDep,
    versionInfo: {exhibitProperty},
    ...response.data.data,
  };
}
let userInfo: any = null;
export async function getUserInfo() {
  if (userInfo) return userInfo;
  const res = await frequest(user.getCurrent, "", "");
  userInfo = res.data.errCode === 0 ? res.data.data : null;
  return userInfo;
}
export function getCurrentUser() {
  return userInfo;
}
export async function setUserInfo(info: any) {
  userInfo = info;
}
export function getStaticPath(path: string) {
  if (!/^\//.test(path)) {
    path = "/" + path;
  }
  // @ts-ignore
  return widgetsConfig.get(this.name).entry + path;
}
export function getEntry(that: any) {
  let baseURL = "http://qi.freelog.com/v2/";
  // TODO  判断不严谨，会有漏洞
  if (window.location.href.indexOf("testfreelog") > -1) {
    baseURL = "http://qi.testfreelog.com/v2/";
  }
  let url =
    baseURL +
    `auths/${window.isTest ? "testResources" : "exhibits"}/${
      that.exhibitId
    }/fileStream?`;
  let url2 = `parentNid=${that.parentNid}&${
    window.isTest ? "subEntityIdOrName" : "subArticleIdOrName"
  }=${that.subArticleIdOrName}`;
  if (that.parentNid) {
    return (
      url + url2 + (window.isTest ? "&subEntityFile=" : "&subResourceFile=")
    );
  } else {
    return url + (window.isTest ? "&subEntityFile=" : "&subResourceFile=");
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
  var doc = window.document;
  var metaEl: any = doc.querySelector('meta[name="viewport"]');
  let content = "";
  Object.keys(viewPortValue).forEach((key: any) => {
    if (viewPortValue.hasOwnProperty(key)) {
      // @ts-ignore
      content += key + "=" + viewPortValue[key] + ",";
    }
  });
  metaEl.setAttribute("content", content);
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
  const nodeId = window.freelogApp.nodeInfo.nodeId;
  // TODO 用户如果两台设备更新数据，可以做一个保存请求的数据对比最新的数据，如果不同，提示给插件（或者传递参数强制更新）
  const res = await frequest(node.putUserData, [nodeId], {
    appendOrReplaceObject: {
      [widgetId]: userData,
    },
  });
  return res;
}

export async function getUserData(key: string) {
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
  const nodeId = window.freelogApp.nodeInfo.nodeId;
  const res = await frequest(node.getUserData, [nodeId], "");
  userData = res.data[widgetId] || {};
  widgetUserData.set(name, userData);
  return userData[key];
}

export function callLogin() {
  if (!userInfo) {
    goLogin();
  }
}
export function callLoginOut() {
  if (userInfo) {
    goLoginOut();
  }
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
