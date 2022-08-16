import docCookies from "doc-cookies";
import { userInfo } from "../platform/structure/utils";
export const loginCallback: any = [];

// 登录和切换用户需要触发
export async function onLogin(callback: any) {
  if (typeof callback === "function") {
    loginCallback.push(callback);
  } else {
    console.error("onLogin error: ", callback, " is not a function!");
  }
}

export let userChangeCallback: any = [];
// 交给主题或插件去刷新用户，或者可以做成由节点选择是否在运行时里面控制
export function onUserChange(callback: Function) {
  if (typeof callback === "function") {
    userChangeCallback.push(callback);
  } else {
    console.error("onLogin error: ", callback, " is not a function!");
  }
}
const rawWindow = window;
export const initWindowListener = () => {
  rawWindow.document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      if (docCookies.getItem("uid") != userInfo?.userId) {
        userChangeCallback.forEach((func: any) => {
          func && func();
        });
      }
    } 
  });
};
