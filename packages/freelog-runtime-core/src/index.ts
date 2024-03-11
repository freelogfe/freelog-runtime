import { baseInfo } from "./base/baseInfo"
export { freelogApp } from "./structure/freelogApp";
export { freelogAuth } from "./structure/freelogAuth";
export const baseURL = baseInfo.baseURL;
export const isTest = baseInfo.isTest;

export {
  getCurrentUser,
  putUserData,
  getUserData,
  getInfoByNameOrDomain,
  baseInit,
  init,
} from "./base";
