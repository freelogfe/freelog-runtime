import { mountWidget } from "./widget";
import { resultType, eventType } from "../../bridge/eventType";
import {
  getSelfConfig,
  setUserData,
  getUserData,
  getSubDep,
  getSelfId,
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
  getSignStatistics,
  getExhibitAvailalbe,
} from "./api";
let devData = "";
export const freelogApp: any = {
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
  getSignStatistics,
  getExhibitAvailalbe,
  devData,
  getStaticPath,
  getSubDep,
  getSelfId,
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
