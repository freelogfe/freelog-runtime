export { baseInfo } from "./config/env";
import { baseInfo } from "./config/env";

export { urls } from "./config/urls";
import frequest from "./services/handler";
import user from "./services/api/modules/user";
import node from "./services/api/modules/node";
export async function getWechatShare(url: any) {
  node.getWechatShare.baseURL = baseInfo.directURL;
  return frequest(node.getWechatShare, "", { shareUrl: url });
}
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
export const freelogApp = {
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
