import { mountWidget } from "./widget";
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
import { callAuth, addAuth, onLogin } from "../../bridge/index";
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
  getSignStatistics
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
  devData,
  getStaticPath,
  getSubDep,
  getSelfId,
  callAuth,
  addAuth,
  onLogin,
  callLogin,
  callLoginOut,
  getCurrentUser,
  setViewport,
  setUserData,
  getUserData,
  getSelfConfig,
  isUserChange,
  reload,
};
