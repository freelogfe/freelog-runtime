import frequest from "./services/handler";
import user from "./services/api/modules/user";
import node from "./services/api/modules/node";
const isTest =  window.location.host.split('.')[1] === 't';
let baseURL = window.location.protocol + '//qi.freelog.com/v2/'
if (window.location.href.indexOf('testfreelog') > -1) {
    baseURL = window.location.protocol + '//qi.testfreelog.com/v2/'
}
export async function getCurrentUser() {
  return frequest(user.getCurrent, "", "");
}
// node.putUserData   node.getUserData
export async function putUserData(urlData: Array<string>, query: any) {
  return frequest(node.putUserData, urlData, query);
}
export async function getUserData(query: any) {
  return frequest(node.getUserData, "", query);
}
export async function getInfoByNameOrDomain(query: any) {
  return frequest(node.getInfoByNameOrDomain, "", query);
}

export const baseInfo = {
  isTest: isTest,
  nodeId: "",
  baseURL: baseURL,
  setPresentableQueue: null,
};
export function init(
  fnodeId: string,
  setPresentableQueue: any
) {
  baseInfo.nodeId = fnodeId;
  baseInfo.setPresentableQueue = setPresentableQueue;
}
