// 工具utils：获取容器，生成容器，销毁容器，生成id

import { baseUrl } from "../../services/base";
import { getInfoById } from "./api";
import { widgetsConfig, widgetUserData, sandBoxs } from "./widget";
import frequest from "../../services/handler";
import user from "../../services/api/modules/user";
import node from "../../services/api/modules/node";
import { FREELOG_DEV } from './widget'
import { addAuth } from "../../bridge/index";

// todo 此文件的方法需要整理分离出freeelogApp下的和内部使用的
export function getContainer(
  container: string | HTMLElement
): HTMLElement | null | undefined {
  // @ts-ignore
  return typeof container === "string"
    ? document.querySelector("#" + container)
    : container;
}

export function createContainer(
  container: string | HTMLElement,
  id: string
): HTMLElement {
  const father =
    typeof container === "string"
      ? document.querySelector("#" + container)
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
  return document.querySelector("#" + id) ? createId(subId, ++count) : id;
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
    document.getElementsByTagName("head").item(0).appendChild(script);
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
    document.getElementsByTagName("head").item(0).appendChild(link);
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
export async function getSelfId() {
  // @ts-ignore
  return widgetsConfig.get(this.name)?.presentableId;
}
// TODO if error
export async function getSubDep(presentableId: any) {
  // @ts-ignore
  let that = sandBoxs.get(this.name);
  if (!that) {
    that = { name: "freelog-" + presentableId, presentableId };
  }
  // @ts-ignore
  let info = await getInfoById.bind(that)(presentableId);
  if (info.data && info.data.errCode === 3) {// 只有主题才需要权限验证
    await new Promise((resolve, reject) => {
      addAuth.bind(that)(presentableId, resolve, reject, { immediate: true });
    });
    info = await getInfoById.bind(that)(presentableId);
    if (info.data.errCode) {
      await new Promise((resolve, reject) => {
        addAuth.bind(that)(presentableId, resolve, reject, { immediate: true });
      });
    }

    info = await getInfoById.bind(that)(presentableId);
  }
  const [subDeps, entityNid, config] = [
    info.headers["freelog-sub-dependencies"],
    info.headers["freelog-entity-nid"],
    info.headers["freelog-resource-property"],
  ];
  return {
    subDeps: subDeps ? JSON.parse(decodeURIComponent(subDeps)) : [],
    headers: info.headers,
    properties: config ? JSON.parse(decodeURIComponent(config)) : {},
    entityNid,
    data: info.data.data,
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
export function getStaticPath(path: string, type?: string) {
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
  let url = baseURL + `auths/presentables/${that.presentableId}/fileStream?`;
  let url2 = `parentNid=${that.parentNid}&subResourceIdOrName=${that.subResourceIdOrName}`;
  if (that.parentNid) {
    return url + url2 + "&subResourceFile=";
  } else {
    return url + "subResourceFile=";
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
      content += key + "=" + viewPortValue[key] + ',';
    }
  });
  metaEl.setAttribute(
    "content",
    content
  );
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

export async function setUserData(key:string, data: any) {
  // TODO 必须验证格式正确
  // @ts-ignore
  const name = this.name
  let userData = widgetUserData.get(name) || {};
  let config = widgetsConfig.get(name);
  userData[key] = data
  let widgetId = btoa(encodeURI(config.resourceName))
  if(name === FREELOG_DEV){
    widgetId = sandBoxs.get(name).proxy.FREELOG_RESOURCENAME
  }
  const nodeId = window.freelogApp.nodeInfo.nodeId
  // TODO 用户如果两台设备更新数据，可以做一个保存请求的数据对比最新的数据，如果不同，提示给插件（或者传递参数强制更新）
  const res = await frequest(node.putUserData, [nodeId], {
    appendOrReplaceObject: {
      [widgetId]: userData
    }
  });
  return res;
}

export async function getUserData(key: string) {
  // @ts-ignore
  const name = this.name
  let userData = widgetUserData.get(name);
  if(userData){
    return userData[key]
  }
  let config = widgetsConfig.get(name);
  let widgetId = btoa(encodeURI(config.resourceName))
  if(name === FREELOG_DEV){
    widgetId = sandBoxs.get(name).proxy.FREELOG_RESOURCENAME
  }
  const nodeId = window.freelogApp.nodeInfo.nodeId
  const res = await frequest(node.getUserData, [nodeId], "");
  userData = res.data[widgetId] || {}
  widgetUserData.set(name, userData)
  return userData[key];
}