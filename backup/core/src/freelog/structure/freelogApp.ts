import { mountWidget } from "./widget";
import { resultType, eventType } from "../bridge/eventType";
import { freelogApp as freelogAppLib } from "freelog-runtime-api";
import {
  getSelfConfig,
  setUserData,
  getUserData,
  getSubDep,
  getSelfArticleId,
  getSelfExhibitId,
  getSelfWidgetId,
  getStaticPath,
  getCurrentUser,
  setViewport,
  callLogin,
  callLoginOut,
  reload,
} from "./utils";
import { getShareUrl, SHARE_DETAIL, SHARE_CONTENT, mapShareUrl } from "./share";
import { callAuth, addAuth } from "../bridge/index";
import { onLogin, onUserChange } from "../bridge/eventOn";
import { isUserChange } from "../security";
import { initGlobalState } from "freelog-runtime-core";

let devData = "";
export const freelogApp: any = {
  ...freelogAppLib,
  initGlobalState,
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
  getSelfWidgetId,
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
  getShareUrl,
  mapShareUrl,
  shareRoute: {
    SHARE_CONTENT,
    SHARE_DETAIL,
  },
};