import { baseInfo } from "./config/env";
export { urls } from "./config/urls";
export { isWeChatOrQQ, getNodeName } from "./structure/share";
import { jumpShareWechat } from "./structure/share";

export { freelogApp } from "./structure/freelogApp";
export { freelogAuth } from "./structure/freelogAuth";
export { freelogFetch } from "./structure/freelogFetch";
export { initWindowListener } from "./bridge/eventOn";
export { FreelogLibrary } from "./freelogLibrary";

export const baseURL = baseInfo.baseURL;
jumpShareWechat();
export {
  getCurrentUser,
  putUserData,
  getUserData,
  getInfoByNameOrDomain,
  baseInit,
  init,
} from "./base";
