import { mountWidget } from "./widget";
import { resultType, eventType } from "../../bridge/eventType";
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
import { callAuth, addAuth } from "../../bridge/index";
import { onLogin, onUserChange } from "../../bridge/eventOn";
import { isUserChange } from "../security";
import {initGlobalState} from '../runtime/index'

import {
  getExhibitListById,
  getExhibitListByPaging,
  getExhibitInfo,
  getExhibitSignCount,
  getExhibitAuthStatus,
  getExhibitFileStream,
  getExhibitDepFileStream,
  getExhibitInfoByAuth,
  getExhibitDepInfo,
  getExhibitDepTree,
  getSignStatistics,
  getExhibitAvailalbe,
} from "./api";
let devData = "";
export const freelogApp: any = {
  initGlobalState,
  nodeInfo: "",
  status: {
    authUIMounted: false,
    themeMounted: false,
  },
  mountWidget,
  getExhibitListById,
  getExhibitListByPaging,
  getExhibitInfo,
  getExhibitSignCount,
  getExhibitAuthStatus,
  getExhibitFileStream,
  getExhibitDepFileStream,
  getExhibitInfoByAuth,
  getExhibitDepInfo,
  getExhibitDepTree,
  getSignStatistics,
  getExhibitAvailalbe,
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
};
