import { getCurrentUser, getUserInfo, setUserInfo } from "./utils";
import {
  registerUI,
  eventMap,
  failedMap,
  endEvent,
  clearEvent,
  updateLock,
  updateEvent,
  lowerUI,
  upperUI,
  reload,
} from "../bridge/index";
import { freelogAuth as freelogAuthLib } from "freelog-runtime-api";

import {
  loginCallback,
 } from "../bridge/eventOn";
import { resultType, eventType } from "../bridge/eventType";


export const freelogAuth = {
  registerUI,
  eventMap,
  failedMap,
  endEvent,
  updateLock,
  updateEvent,
  clearEvent,
  lowerUI,
  upperUI,
  resultType,
  loginCallback,
  setUserInfo,
  getCurrentUser,
  getUserInfo,
  reload,
  eventType,
  ...freelogAuthLib
};
