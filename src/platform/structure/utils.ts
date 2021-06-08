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
export async function getSelfId(global: any) {
  // @ts-ignore
  return widgetsConfig.get(global.widgetName)?.presentableId;
}
// TODO if error
export async function getSubDep(presentableId: any, global: any) {
  // @ts-ignore
  presentableId = presentableId || getSelfId(global);
  let info = await getInfoById.bind(
    global
      ? sandBoxs.get(global.widgetName)
      : { name: "freelog-" + presentableId, presentableId }
  )(presentableId);
  console.log(info)
  if (info.data.errCode) {
    await new Promise((resolve, reject) => {
      addAuth.bind({ name: "freelog-" + presentableId })(
        presentableId,
        resolve,
        reject,
        {immediate: true}
      );
      addAuth.bind({ name: "freelog-" + presentableId })(
        presentableId + 1,
        resolve,
        reject,
        {immediate: true}
      );
    });
    console.log(123123, info)
    info = await getInfoById.bind(
      global
        ? sandBoxs.get(global.widgetName)
        : { name: "freelog-" + presentableId }
    )(presentableId);
    if (info.data.errCode) {
      await new Promise((resolve, reject) => {
        addAuth.bind({ name: "freelog-" + presentableId })(
          presentableId,
          resolve,
          reject,
          {immediate: true}
        );
      });
    }
    info = await getInfoById.bind(
      global
        ? sandBoxs.get(global.widgetName)
        : { name: "freelog-" + presentableId }
    )(presentableId);
  }
  const [subDeps, entityNid] = [
    info.headers["freelog-sub-dependencies"],
    info.headers["freelog-entity-nid"],
  ];
  console.log(subDeps)
  return {
    subDeps: subDeps ? JSON.parse(decodeURIComponent(subDeps)) : [],
    entityNid,
    data: info.data.data,
  };
}
let userInfo:any = null
export async function getUserInfo(){
  if(userInfo) return userInfo
  const res = await frequest(user.getCurrent, "", "")
  userInfo = res.data.errCode === 0 ? res.data.data : null
  return userInfo
}
export async function setUserInfo(info:any){
  userInfo = info 
}