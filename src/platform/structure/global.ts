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
} from "./utils";
import { callAuth, addAuth, onLogin } from "../../bridge/index";
import {
  getExhibitListById,
  getExhibitListByPaging,
  getExhibitInfo,
  getExhibitSignCount,
  getExhibitAuthStatus,
  getExhibitFileStream,
  getExhibitDepFileStream,
  getExhibitInfoByAuth
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
};
