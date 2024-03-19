import { resultType } from "../bridge/eventType";
import { freelogApp as freelogAppLib } from "freelog-runtime-api";
import { mountWidget } from "./widget";
import { bus } from "wujie";
import { destroyWidget, preloadWidget, startWdiget } from "./wujiePatch";

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
  setSelfResourceNameForDev,
} from "./utils";
import { callAuth, addAuth } from "../bridge/index";
import { onLogin, onUserChange } from "../bridge/eventOn";
import { isUserChange } from "../security";
// import { initGlobalState } from "freelog-runtime-core";

let devData = "";
export const freelogApp: any = {
  ...freelogAppLib,
  // initGlobalState,
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
  bus,
  destroyWidget,
  preloadWidget,
  startWdiget,
  setSelfResourceNameForDev,
};