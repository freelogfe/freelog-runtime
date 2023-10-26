import { baseInfo } from "./base/baseInfo"
export { freelogApp } from "./freelogApp";
export { freelogAuthApi } from "./freelogAuth";
export const baseURL = baseInfo.baseURL;
export const isTest = baseInfo.isTest;

export {
  getCurrentUser,
  putUserData,
  getUserData,
  getInfoByNameOrDomain,
  init,
} from "./base";
