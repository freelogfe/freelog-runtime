import { resultType } from "../bridge/eventType";
import { freelogApp as freelogAppLib } from "../freelogApp";
import { mountWidget } from "./widget";
import microApp from "@micro-zoe/micro-app";
import { isTest } from "../base/baseInfo";
import {
  getSelfConfig,
  getSubDep,
  getSelfArticleId,
  getSelfExhibitId,
  getSelfWidgetRenderName,
  getStaticPath,
  setViewport,
  reload,
  setUserDataKeyForDev,
  getCurrentUrl,
} from "./widgetUtils";
import {
  setUserData,
  getUserData,
  getCurrentUser,
  callLogin,
  callLoginOut,
} from "./user";
import { getShareUrl, mapShareUrl } from "./share";
import { callAuth, addAuth } from "../bridge/index";
import { onLogin, onUserChange } from "../bridge/eventOn";
import { isUserChange } from "./user";
import { dev } from "./dev";
import { getActiveWidget, getAllWidget } from "./jdPatch";
const devData = dev();
export const freelogApp: any = {
  ...freelogAppLib,
  nodeInfo: "",
  status: {
    authUIMounted: false,
    themeMounted: false,
  },
  mountWidget,
  devData,
  getStaticPath,
  getSubDep,
  getSelfArticleId,
  getSelfExhibitId,
  getSelfWidgetRenderName,
  callAuth,
  addAuth,
  onLogin,
  onUserChange,
  callLogin,
  callLoginOut,
  getCurrentUser,
  setViewport,
  setUserData,
  getUserData,
  getSelfConfig,
  isUserChange,
  reload,
  resultType,
  setUserDataKeyForDev,
  isTest,
  getActiveWidget,
  getAllWidget,
  getShareUrl,
  mapShareUrl,
  getCurrentUrl,
  router: microApp.router,
};
