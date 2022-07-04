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
  loginCallback,
  reload,
} from "../../bridge/index";
 
import { SUCCESS, FAILED, USER_CANCEL } from "../../bridge/event";
 

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
  resultType: {
    SUCCESS,
    FAILED,
    USER_CANCEL,
  },
  loginCallback,
  setUserInfo,
  getCurrentUser,
  getUserInfo,
  reload,
};
