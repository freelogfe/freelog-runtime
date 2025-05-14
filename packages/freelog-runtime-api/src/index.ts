window.ENV = "freelog.com";
if (window.location.host.includes(".testfreelog.com")) {
  window.ENV = "testfreelog.com";
}
export const isTest = window.location.host.split(".")[1] === "t";
let _directURL = window.location.protocol + "//api.freelog.com/v2/";
let _midURL = window.location.protocol + "//runtime-api.freelog.com/v2/";
if (window.location.href.indexOf("testfreelog") > -1) {
  _directURL = window.location.protocol + "//api.testfreelog.com/v2/";
  _midURL = window.location.protocol + "//runtime-api.testfreelog.com/v2/";
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
// node.putUserData   node.getUserData
export async function putUserData(urlData: Array<string>, query: any) {
  user.getCurrent.putUserData = baseInfo.directURL;
  return frequest(node.putUserData, urlData, query);
}
export async function getUserData(urlData: Array<string>) {
  user.getCurrent.getUserData = baseInfo.directURL;
  return frequest(node.getUserData, urlData, "");
}
export async function getInfoByNameOrDomain(query: any) {
  user.getCurrent.getInfoByNameOrDomain = baseInfo.directURL;
  return frequest(node.getInfoByNameOrDomain, "", query);
}

export function init(fnodeId: string) {
  baseInfo.nodeId = fnodeId;
}

import {
  getExhibitListById,
  getExhibitListByPaging,
  getExhibitInfo,
  getExhibitSignCount,
  getExhibitAuthStatus,
  getExhibitAvailable,
  getExhibitFileStream,
  getExhibitDepFileStream,
  getExhibitDepInfo,
  getSignStatistics,
  pushMessage4Task,
  getCollectionSubList,
  getCollectionsSubList,
  getCollectionSubInfo,
  getCollectionSubAuth,
  getCollectionSubFileStream,
  getCollectionSubDepFileStream,
  getCollectionSubDepList,
  getExhibitRecommend,
} from "./api";
export const freelogApp: any = {
  getExhibitListById,
  getExhibitListByPaging,
  getExhibitInfo,
  getExhibitSignCount,
  getExhibitAuthStatus,
  getExhibitAvailable,
  getExhibitFileStream,
  getExhibitDepFileStream,
  getExhibitDepInfo,
  getSignStatistics,
  pushMessage4Task,
  getCollectionSubList,
  getCollectionsSubList,
  getCollectionSubInfo,
  getCollectionSubAuth,
  getCollectionSubFileStream,
  getCollectionSubDepFileStream,
  getCollectionSubDepList,
  getExhibitRecommend,
};
