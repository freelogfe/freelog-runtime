import * as docCookies from "doc-cookies";
import { getUserInfoForAuth } from "../structure/user";
export const loginCallback: any = [];
export const loginErrorCallback: any = [];
// 登录和切换用户需要触发
export async function onLogin(name: string, resolve: any, reject: any) {
  if (typeof resolve === "function") {
    loginCallback.push(resolve);
  }
  if (typeof reject === "function") {
    loginErrorCallback.push(reject);
  }
}

export let userChangeCallback: any = [];
// 交给主题或插件去刷新用户，或者可以做成由节点选择是否在运行时里面控制
export function onUserChange(name: string, callback: any) {
  if (typeof callback === "function") {
    userChangeCallback.push(callback);
  } else {
    console.error("onLogin error: ", callback, " is not a function!");
  }
}
let windowListenerInitialized = false;
let checkPendingLogin: (() => void) | undefined;

export function watchLoginOnReturn(check: () => void) {
  initWindowListener();
  checkPendingLogin = check;
  return () => {
    if (checkPendingLogin === check) checkPendingLogin = undefined;
  };
}

function notifyUserChange() {
  if (document.visibilityState !== "visible") return;
  const cachedUserId = getUserInfoForAuth()?.userId;
  const uid = docCookies.getItem("uid") ?? "";
  if (uid === (cachedUserId ? String(cachedUserId) : "")) return;

  if (checkPendingLogin) {
    checkPendingLogin();
    return;
  }
  userChangeCallback.forEach((callback: () => void) => callback());
  userChangeCallback = [];
}

export function initWindowListener() {
  if (windowListenerInitialized) return;
  windowListenerInitialized = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    if (checkPendingLogin) checkPendingLogin();
    else notifyUserChange();
  });
  document.body.addEventListener("mouseenter", notifyUserChange);
  function checkLoginWhenVisible() {
    if (document.visibilityState === "visible") checkPendingLogin?.();
  }
  window.addEventListener("focus", checkLoginWhenVisible);
  window.addEventListener("pageshow", checkLoginWhenVisible);
}
