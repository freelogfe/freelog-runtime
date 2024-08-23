import * as docCookies from "doc-cookies";
import { freelogAuth } from "./freelogAuth";
import { widgetsConfig, widgetUserData } from "./widget";
import { initWindowListener } from "../bridge/eventOn";
import { goLogin, goLoginOut } from "../bridge/index";
import { baseInfo } from "../base/baseInfo";
import {
  getCurrentUser as _getCurrentUser,
  putUserData as _putUserData,
  getUserData as _getUserData,
} from "../base";
export let userInfo: any = null;
export let userInfoForAuth: any = null;
export async function getUserInfo() {
  initWindowListener();
  if (userInfoForAuth) return userInfoForAuth;
  const res = await _getCurrentUser();
  const info = res.data.errCode === 0 ? res.data.data : null;
  setUserInfo(info);
  return info;
}
export function getUserInfoForAuth() {
  return userInfoForAuth;
}
export function getCurrentUser(name?: string) {
  return userInfo;
}
export async function setUserInfo(info: any) {
  window.userId = info ? info.userId + "" : "";
  userInfo = userInfoForAuth = info;
  if (userInfo) {
    const { headImage, username } = info;
    userInfo = { headImage, username };
  }
}
export function isUserChange(name: string) {
  let uid = docCookies.getItem("uid");
  uid = uid ? uid : "";
  const userId = userInfoForAuth?.userId ? userInfoForAuth?.userId + "" : "";
  // 用户变化, 从无到有，从有到另有
  if (uid !== userId) {
    return true;
    // rawLocation.reload();
  }
  // 用户变化, 从有到无，有页面登出后，还处于登录状态的页面处理方式
  if (userInfoForAuth?.userId && !uid) {
    return true;
    // rawLocation.reload();
  }
  return false;
}

export async function setUserData(name: string, key: string, data: any) {
  if (!key) {
    return;
  }
  const dataKey = name + "-" + key;
  const nodeId = baseInfo.nodeId;
  // 用户如果两台设备更新数据，可以做一个保存请求的数据对比最新的数据，如果不同，提示给插件（或者传递参数强制更新）,这个后端来做？
  const res = await _putUserData([nodeId], {
    appendOrReplaceObject: {
      [dataKey]: data,
    },
  });

  if (res.data && res.data.ret == 0 && res.data.errCode == 0) {
    res.data.data = data;
  }
  return res;
}
export async function deleteUserData(name: string, key: string) {
  if (!key) {
    return;
  }
  const dataKey = name + "-" + key;
  const nodeId = baseInfo.nodeId;
  const res = await _putUserData([nodeId], {
    removeFields: [dataKey],
    appendOrReplaceObject: {},
  });
  if (res.data && res.data.ret == 0 && res.data.errCode == 0) {
    res.data.data = null;
  }
  return res;
}
export async function getUserData(name: string, key: string) {
  if (!key) {
    return;
  }
  const dataKey = name + "-" + key;
  const nodeId = baseInfo.nodeId;
  const res = await _getUserData([nodeId]);
  res.data = {
    ret: 0,
    errCode: 0,
    msg: "success",
    data: res.data[dataKey],
  };
  return res;
}

export function callLogin(name: string, resolve: Function) {
  console.log("运行时callLogin调用打印,下面是回调函数：", resolve)

  if (!userInfo) {
    goLogin(name, resolve);
  }
}
export function callLoginOut(name: string, resolve: Function) {
  if (userInfo) {
    goLoginOut(name, resolve);
  }
}
