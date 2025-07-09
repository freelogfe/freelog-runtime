import { baseInfo } from "./base/baseInfo";
export { isWeChat, getDomain } from "./structure/share";
import { jumpShareWechat } from "./structure/share";

export { freelogApp } from "./structure/freelogApp";
export { freelogAuth } from "./structure/freelogAuth";
export { freelogFetch } from "./structure/freelogFetch";
export { initWindowListener } from "./bridge/eventOn";
export { FreelogLibrary } from "./freelogLibrary";

export const baseURL = baseInfo.baseURL;
export const isTest = baseInfo.isTest;
jumpShareWechat();
export {
  getCurrentUser,
  putUserData,
  getUserData,
  getInfoByNameOrDomain,
  baseInit,
  init,
} from "./base";
