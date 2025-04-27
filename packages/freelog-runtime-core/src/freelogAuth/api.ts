import frequest from "./services/handler";

import user from "./services/api/modules/user";

// user 开始
export async function login(query: any) {
  return frequest(user.login, "", query);
}
export async function loginVerify(query: any) {
  return frequest(user.loginVerify, "", query);
}
export async function loginOut(query: any) {
  return frequest(user.loginOut, "", query);
}
export async function getCurrent() {
  return frequest(user.getCurrent, "", "");
}
export async function getAccount(urlData: Array<any>, query: any) {
  return frequest(user.getAccount, urlData, query);
}
export async function postRegister(query: any) {
  return frequest(user.postRegister, "", query);
}
export async function getAuthCode(query: any) {
  return frequest(user.getAuthCode, "", query);
}
export async function verifyAuthCode(query: any) {
  return frequest(user.verifyAuthCode, "", query);
}
export async function putResetPassword(urlData: Array<any>, query: any) {
  return frequest(user.putResetPassword, urlData, query);
}
export async function putResetPayPassword(query: any) {
  return frequest(user.putResetPayPassword, "", query);
}
// user 结束
