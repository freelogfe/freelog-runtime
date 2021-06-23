// 工具utils：获取容器，生成容器，销毁容器，生成id

import { baseUrl } from "../../services/base";
import { getInfoById } from "./api";
import { widgetsConfig, sandBoxs } from "./widget";
import frequest from "../../services/handler";
import user from "../../services/api/modules/user";

import { addAuth } from "../../bridge/index";
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
  console.log(this.name);
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
  console.log(that, presentableId, info);
  if (info.data.errCode) {
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
  const [subDeps, entityNid] = [
    info.headers["freelog-sub-dependencies"],
    info.headers["freelog-entity-nid"],
  ];
  console.log(subDeps);
  return {
    subDeps: subDeps ? JSON.parse(decodeURIComponent(subDeps)) : [],
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
export async function setUserInfo(info: any) {
  userInfo = info;
}
export function getStatic(path: string, type?: string) {
  // @ts-ignore
  const that = this
 
  
  let url = `http://qi.testfreelog.com/v2/auths/presentables/${that.presentableId}/fileStream?subResourceFile=`;
  // @ts-ignore
  let url2 = `${encodeURIComponent(path)}&parentNid=${that.parentNid}&subResourceIdOrName=${
    // @ts-ignore
    that.subResourceIdOrName
  }`;
  if(!that.parentNid){
    url2 = `${encodeURIComponent(path)}`
  }
  console.log(url + url2)
  return url + url2;
}
