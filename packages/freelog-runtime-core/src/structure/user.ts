import * as docCookies from "doc-cookies";
import { freelogApp } from "./freelogApp";
import { widgetsConfig, widgetUserData } from "./widget";
import { initWindowListener } from "../bridge/eventOn";
import { goLogin, goLoginOut } from "../bridge/index";
import { baseInfo} from "../base/baseInfo"
import {
  getCurrentUser as _getCurrentUser,
  putUserData as _putUserData,
  getUserData as _getUserData,
} from "../base";
const rawLocation = window.location;
export let userInfo: any = null;
export async function getUserInfo() {
  initWindowListener();
  if (userInfo) return userInfo;
  const res = await _getCurrentUser();
  userInfo = res.data.errCode === 0 ? res.data.data : null;
  setUserInfo(userInfo);
  return userInfo;
}
export function getCurrentUser(name?: string) {
  return userInfo;
}
export async function setUserInfo(info: any) {
  window.userId = info ? info.userId + "" : "";
  userInfo = info;
}
export  function isUserChange(name: string) {
  let uid = docCookies.getItem("uid");
  const userInfo = getCurrentUser();
  uid = uid ? uid : "";
  const userId = userInfo?.userId ? userInfo?.userId + "" : "";
  // 用户变化, 从无到有，从有到另有
  if (uid !== userId) {
    return true;
    // rawLocation.reload();
  }
  // 用户变化, 从有到无，有页面登出后，还处于登录状态的页面处理方式
  if (userInfo?.userId && !uid) {
    return true;
    // rawLocation.reload();
  }
  return false;
}

export async function setUserData(name: string, key: string, data: any) {
  key = window.isTest ? key + "-test" : key;
  let userData = widgetUserData.get(name) || {};
  userData[key] = data;
  const nodeId = baseInfo.nodeId;
  // 用户如果两台设备更新数据，可以做一个保存请求的数据对比最新的数据，如果不同，提示给插件（或者传递参数强制更新）,这个后端来做？
  const res = await _putUserData([nodeId], {
    appendOrReplaceObject: {
      [name]: userData,
    },
  });
  return res;
}
export async function deleteUserData(name: string, key: string) {
  key = window.isTest ? key + "-test" : key;
  let userData = widgetUserData.get(name) || {};
  delete userData[key];
  const nodeId = baseInfo.nodeId;
  const res = await _putUserData([nodeId], {
    appendOrReplaceObject: {
      [name]: userData,
    },
  });
  return res;
}
export async function getUserData(name: string, key: string) {
  key = window.isTest ? key + "-test" : key;
  let userData = widgetUserData.get(name);
  if (userData) {
    return userData[key];
  }
  let config = widgetsConfig.get(name);
  let widgetId = btoa(encodeURI(config.articleName));

  if (config.isDev) {
    widgetId = config.DevResourceName ? config.DevResourceName : widgetId;
  }
  const nodeId = baseInfo.nodeId;
  const res = await _getUserData([nodeId]);
  userData = res.data[widgetId] || {};
  widgetUserData.set(name, userData);
  return userData[key];
}

export function callLogin(name: string, resolve: Function) {
  if (!userInfo) {
    goLogin(resolve);
  }
}
export function callLoginOut(name: string) {
  if (userInfo) {
    goLoginOut();
  }
}
