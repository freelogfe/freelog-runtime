window.ENV = "freelog.com";
if (window.location.host.includes(".testfreelog.com")) {
  window.ENV = "testfreelog.com";
}
export const isTest = window.location.host.split(".")[1] === "t";
let _directURL = window.location.protocol + "//api.freelog.com/v2/";
let _midURL = window.location.protocol + "//api.testfreelog.com/v2/runtimes/";
if (window.location.href.indexOf("testfreelog") > -1) {
  _directURL = window.location.protocol + "//api.testfreelog.com/v2/";
  _midURL = window.location.protocol + "//api.testfreelog.com/v2/runtimes/";
}
if (process.env.NODE_ENV === "development") {
  _midURL = "//api3.testfreelog.com/"; // "//localhost:5201/";
}
window.isTest = isTest;
// @ts-ignore
export const baseInfo: any = {
  isTest: isTest,
  nodeId: "",
  baseURL: _midURL,
  directURL: _directURL,
};

import frequest from "./services/handler";
import user from "./services/api/modules/user";
import node from "./services/api/modules/node";

export async function getCurrentUser() {
  user.getCurrent.baseURL = baseInfo.directURL;
  return frequest(user.getCurrent, "", "");
}
export async function putUserData(data: any) {
  return frequest(node.putUserData, [baseInfo.nodeId], data);
}
export async function getUserData(data: any) {
  return frequest(node.getUserData, [baseInfo.nodeId], data);
}
export async function deleteUserData(data: any) {
  return frequest(node.deleteUserData, [baseInfo.nodeId], data);
}
export async function getInfoByNameOrDomain(query: any) {
  return frequest(node.getInfoByNameOrDomain, "", query);
}

export function init(fnodeId: string) {
  baseInfo.nodeId = fnodeId;
}

import {
  getExhibitById,
  getExhibitListById,
  getExhibiListAuthById,
  getExhibitListByPage,
  getExhibitListAuthByPage,
  getExhibitSignCount,
  getExhibitAuthStatus,
  getExhibitAvailable,
  getExhibitFileStream,
  getExhibitDepFileStream,
  getExhibitDepInfo,
  getExhibitRecommend,
} from "./api/exhibit";
import { getSignStatistics, pushMessage4Task } from "./api/base";
import {
  getCollectionSubListByPage,
  getCollectionSubListAuthByPage,
  getCollectionsSubListByPage,
  getCollectionSubById,
  getCollectionSubListById,
  getCollectionSubListAuthById,
  getCollectionSubAuthStatus,
  getCollectionSubFileStream,
  getCollectionSubDepList,
  getCollectionSubDepFileStream,
} from "./api/collection";
export const freelogApp: any = {
  getExhibitById,
  getExhibitListById,
  getExhibiListAuthById,
  getExhibitListByPage,
  getExhibitListAuthByPage,
  getExhibitSignCount,
  getExhibitAuthStatus,
  getExhibitAvailable,
  getExhibitFileStream,
  getExhibitDepFileStream,
  getExhibitDepInfo,
  getExhibitRecommend,
  getCollectionSubListByPage,
  getCollectionSubListAuthByPage,
  getCollectionsSubListByPage,
  getCollectionSubById,
  getCollectionSubListById,
  getCollectionSubListAuthById,
  getCollectionSubAuthStatus,
  getCollectionSubFileStream,
  getCollectionSubDepFileStream,
  getCollectionSubDepList,
  getSignStatistics,
  pushMessage4Task,
};
