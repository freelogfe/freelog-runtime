import { resultType } from "../bridge/eventType";
import { freelogApp as freelogAppLib, baseInfo } from "freelog-runtime-api";
import { mountExhibitWidget, mountArticleWidget } from "./widget";
import microApp from "@micro-zoe/micro-app";

import {
  getSelfProperty,
  getSelfPropertyForTheme,
  getSelfDepForTheme,
  getSelfDep,
  getSelfWidgetRenderName,
  getStaticPath,
  setViewport,
  reload,
  getCurrentUrl,
  getTopExhibitId,
  getSelfNid,
  assembleUrl,
  closeAuth
} from "./widgetUtils";
import {
  setUserData,
  getUserData,
  getCurrentUser,
  deleteUserData,
  callLogin,
  callLoginOut,
} from "./user";
import {
  getShareUrl,
  mapShareUrl,
  updateWechatShare,
  getWechatShareURL,
  isWeChatOrQQ,
} from "./share";
import { callAuth, addAuth } from "../bridge/index";
import { onLogin, onUserChange } from "../bridge/eventOn";
import { isUserChange } from "./user";
import { dev } from "./dev";
import { getActiveWidget, getAllWidget } from "./jdPatch";
export const devData = dev();
export const freelogApp: any = {
  ...freelogAppLib,
  nodeInfo: "",
  status: {
    authUIMounted: false,
    themeMounted: false,
  },
  mountExhibitWidget,
  mountArticleWidget,
  // devData,
  getStaticPath,
  getSelfWidgetRenderName,
  callAuth,
  addAuth,
  onLogin,
  onUserChange,
  callLogin,
  callLoginOut,
  getCurrentUser,
  setViewport,
  deleteUserData,
  setUserData,
  getUserData,
  getSelfProperty,
  getSelfDep,
  getSelfPropertyForTheme,
  getSelfDepForTheme,
  getTopExhibitId,
  getSelfNid,
  isUserChange,
  reload,
  resultType,
  getActiveWidget,
  getAllWidget,
  getShareUrl,
  mapShareUrl,
  updateWechatShare,
  getWechatShareURL,
  assembleUrl,
  isWeChatOrQQ,
  getCurrentUrl,
  closeAuth,
  router: microApp.router,
  noAuthCode: [301, 302, 303, 304, 305, 306, 307],
  authCode: [200, 201, 202, 203],
  errorAuthCode: [401, 402, 403, 501, 502, 503, 504, 505, 900, 901],
};
