import { baseInfo } from "./baseInfo";
import frequest from "./services/handler";
import user from "./services/api/modules/user";
import node from "./services/api/modules/node";
export async function getCurrentUser() {
  return frequest(user.getCurrent, "", "");
}
// node.putUserData   node.getUserData
export async function putUserData(urlData: Array<string>, query: any) {
  return frequest(node.putUserData, urlData, query);
}
export async function getUserData(urlData: Array<string>) {
  return frequest(node.getUserData, urlData, "");
}
export async function getInfoByNameOrDomain(query: any) {
  return frequest(node.getInfoByNameOrDomain, "", query);
}

export async function getWechatShare(url: any) {
  return frequest(user.getWechatShare, "", { shareUrl: url });
}
export function init(fnodeId: string) {
  baseInfo.nodeId = fnodeId;
}
export function baseInit(baseURL: string) {
  baseInfo.baseURL = baseURL;
}
