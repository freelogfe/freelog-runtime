var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/freelogAuth/api.ts
var api_exports = {};
__export(api_exports, {
  batchSign: () => batchSign,
  getAccount: () => getAccount,
  getAuthCode: () => getAuthCode,
  getContractInfo: () => getContractInfo,
  getContracts: () => getContracts,
  getCurrent: () => getCurrent,
  getRecord: () => getRecord,
  getTransitionRecords: () => getTransitionRecords,
  login: () => login,
  loginOut: () => loginOut,
  loginVerify: () => loginVerify,
  pay: () => pay,
  postRegister: () => postRegister,
  putResetPassword: () => putResetPassword,
  putResetPayPassword: () => putResetPayPassword,
  signContract: () => signContract,
  verifyAuthCode: () => verifyAuthCode
});
module.exports = __toCommonJS(api_exports);
var import_handler = __toESM(require("./services/handler"));
var import_contract = __toESM(require("./services/api/modules/contract"));
var import_event = __toESM(require("./services/api/modules/event"));
var import_transaction = __toESM(require("./services/api/modules/transaction"));
var import_user = __toESM(require("./services/api/modules/user"));
async function getContractInfo(urlData, query) {
  return (0, import_handler.default)(import_contract.default.getContractInfo, urlData, query);
}
async function getContracts(query) {
  return (0, import_handler.default)(import_contract.default.getContracts, "", query);
}
async function signContract(query) {
  return (0, import_handler.default)(import_contract.default.contract, "", query);
}
async function batchSign(query) {
  return (0, import_handler.default)(import_contract.default.contracts, "", query);
}
async function getTransitionRecords(urlData, query) {
  return (0, import_handler.default)(import_contract.default.getTransitionRecords, urlData, query);
}
async function pay(urlData, query) {
  return (0, import_handler.default)(import_event.default.pay, urlData, query);
}
async function getRecord(urlData, query) {
  return (0, import_handler.default)(import_transaction.default.getRecord, urlData, query);
}
async function login(query) {
  return (0, import_handler.default)(import_user.default.login, "", query);
}
async function loginVerify(query) {
  return (0, import_handler.default)(import_user.default.loginVerify, "", query);
}
async function loginOut(query) {
  return (0, import_handler.default)(import_user.default.loginOut, "", query);
}
async function getCurrent() {
  return (0, import_handler.default)(import_user.default.getCurrent, "", "");
}
async function getAccount(urlData, query) {
  return (0, import_handler.default)(import_user.default.getAccount, urlData, query);
}
async function postRegister(query) {
  return (0, import_handler.default)(import_user.default.postRegister, "", query);
}
async function getAuthCode(query) {
  return (0, import_handler.default)(import_user.default.getAuthCode, "", query);
}
async function verifyAuthCode(query) {
  return (0, import_handler.default)(import_user.default.verifyAuthCode, "", query);
}
async function putResetPassword(urlData, query) {
  return (0, import_handler.default)(import_user.default.putResetPassword, urlData, query);
}
async function putResetPayPassword(query) {
  return (0, import_handler.default)(import_user.default.putResetPayPassword, "", query);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  batchSign,
  getAccount,
  getAuthCode,
  getContractInfo,
  getContracts,
  getCurrent,
  getRecord,
  getTransitionRecords,
  login,
  loginOut,
  loginVerify,
  pay,
  postRegister,
  putResetPassword,
  putResetPayPassword,
  signContract,
  verifyAuthCode
});
