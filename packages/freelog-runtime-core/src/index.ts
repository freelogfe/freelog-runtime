import { baseInfo } from "freelog-runtime-api";
import { jumpShareWechat } from "./structure/share";

export { freelogApp } from "./structure/freelogApp";
export { freelogAuth } from "./structure/freelogAuth";
export { freelogFetch } from "./structure/freelogFetch";
export { initWindowListener } from "./bridge/eventOn";
export { buildLoginUrl, createLoginWindow } from "./structure/loginWindow";
export type { LoginStatus } from "./structure/loginWindow";
export { FreelogLibrary } from "./freelogLibrary";


export const baseURL = baseInfo.baseURL;
export { isWeChatOrQQ, getNodeName, jumpShareWechat } from "./structure/share";
jumpShareWechat();

export {
  getCurrentUser,
  putUserData,
  getUserData,
  deleteUserData,
  getInfoByNameOrDomain,
  init,
  urls,
} from "freelog-runtime-api";
