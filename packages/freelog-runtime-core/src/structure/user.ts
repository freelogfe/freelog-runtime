import * as docCookies from "doc-cookies";

import { initWindowListener } from "../bridge/eventOn";
import { goLogin, goLoginOut } from "../bridge/index";
import {
  getCurrentUser as _getCurrentUser,
  putUserData as _putUserData,
  getUserData as _getUserData,
  deleteUserData as _deleteUserData,
} from "freelog-runtime-api";
export let userInfo: any = null;
export let userInfoForAuth: any = null;

export async function getUserInfo() {
  initWindowListener();
  if (userInfoForAuth) return userInfoForAuth;
  const res = await _getCurrentUser();
  const info = res.data.errCode === 0 ? res.data.data : null;
  // setUserInfo(info);
  return info;
}
export function getUserInfoForAuth() {
  return userInfoForAuth;
}
export function getCurrentUser(name?: string) {
  return userInfo;
}
export async function setUserInfo(info: any, isOwner: boolean) {
  window.userId = info ? info.userId + "" : "";
  userInfo = userInfoForAuth = info;
  if (userInfo) {
    const { headImage, username } = info;
    userInfo = { headImage, username, isOwner };
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
  // 用户如果两台设备更新数据，可以做一个保存请求的数据对比最新的数据，如果不同，提示给插件（或者传递参数强制更新）,这个后端来做？
  return _putUserData({
    [dataKey]: data,
  });
}
export async function deleteUserData(name: string, key: string) {
  if (!key) {
    return;
  }
  const dataKey = name + "-" + key;
  return _deleteUserData({ key: dataKey });
}
export async function getUserData(name: string, key: string) {
  if (!key) {
    return;
  }
  const dataKey = name + "-" + key;
  return _getUserData({ key: dataKey });
}

export function callLogin(name: string, resolve: Function) {
  if (!userInfo) {
    goLogin(name, resolve);
  }
}
export function callLoginOut(name: string, resolve: Function) {
  if (userInfo) {
    goLoginOut(name, resolve);
  }
}
