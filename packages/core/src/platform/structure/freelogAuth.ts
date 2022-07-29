import { getCurrentUser, getUserInfo, setUserInfo } from "./utils";
import {
  reisterUI,
  eventMap,
  failedMap,
  endEvent,
  clearEvent,
  updateLock,
  updateEvent,
  lowerUI,
  upperUI,
  reload,
} from "../../bridge/index";
import {
  loginCallback,
 } from "../../bridge/eventOn";
import { resultType, eventType } from "../../bridge/eventType";


export const freelogAuth = {
  reisterUI,
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
};
