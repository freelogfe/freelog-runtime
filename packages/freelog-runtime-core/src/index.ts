import { baseInfo } from "freelog-runtime-api";
export { freelogApp } from "./structure/freelogApp";
export { freelogAuth } from "./structure/freelogAuth";
export { freelogFetch } from "./structure/freelogFetch";
export { initWindowListener } from "./bridge/eventOn";
export { FreelogLibrary } from "./freelogLibrary";


export const baseURL = baseInfo.baseURL;
export const isTest = baseInfo.isTest;

export {
  getCurrentUser,
  putUserData,
  getUserData,
  getInfoByNameOrDomain,
  init,
} from "freelog-runtime-api";
