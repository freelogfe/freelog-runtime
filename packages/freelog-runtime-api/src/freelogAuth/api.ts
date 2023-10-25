import frequest from "./services/handler";
import contract from "./services/api/modules/contract";
import event from "./services/api/modules/event";
import transaction from "./services/api/modules/transaction";
import user from "./services/api/modules/user";

// contract 开始
export async function getContractInfo(urlData: Array<any>,query: any) {
  return frequest(contract.getContractInfo, urlData, query);
}
export async function getContracts(query: any) {
  return frequest(contract.getContractInfo, "", query);
}
export async function signContract(query: any) {
  return frequest(contract.contract, "", query);
}
export async function batchSign(query: any) {
  return frequest(contract.contracts, "", query);
}
export async function getTransitionRecords(urlData: Array<any>,query: any) {
  return frequest(contract.getContractInfo, urlData, query);
}
// contract 结束

// event 开始
export async function pay(urlData: Array<any>,query: any) {
  return frequest(event.pay, urlData, query);
}
// event 结束

// transaction 开始
export async function getRecord(urlData: Array<any>,query?: any) {
  return frequest(transaction.getRecord, urlData, query);
}
// transaction 结束
 
// user 开始
export async function login(query: any) {
  return frequest(user.login, "",  query);
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
export async function getAccount(urlData: Array<any>,query: any) {
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
export async function putResetPassword(urlData: Array<any>,query: any) {
  return frequest(user.putResetPassword,urlData, query);
}
export async function putResetPayPassword(query: any) {
  return frequest(user.putResetPayPassword, "", query);
}
// user 结束