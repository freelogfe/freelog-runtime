import * as docCookies from "doc-cookies";
import { getCurrentUser } from "../structure/user";
export const loginCallback: any = [];

// 登录和切换用户需要触发
export async function onLogin(name: string, callback: any) {
  if (typeof callback === "function") {
    loginCallback.push(callback);
  } else {
    console.error("onLogin error: ", callback, " is not a function!");
  }
}

export const userChangeCallback: any = [];
// 交给主题或插件去刷新用户，或者可以做成由节点选择是否在运行时里面控制
export function onUserChange(name: string, callback: any) {
  if (typeof callback === "function") {
    userChangeCallback.push(callback);
  } else {
    console.error("onLogin error: ", callback, " is not a function!");
  }
}
export const initWindowListener = () => {
  window.document.addEventListener("visibilitychange", function (e) {
    // if (document.visibilityState == "hidden") {
    //   alert("离开");
    // }
    if (document.visibilityState == "visible") {
      const userInfo = getCurrentUser();
      const userId = userInfo?.userId ? userInfo.userId + "" : "";
      const uid = docCookies.getItem("uid")
        ? docCookies.getItem("uid") + ""
        : "";
      if (uid != userId) {
        userChangeCallback.forEach((func: any) => {
          func && func();
        });
      }
    }
  });
};
