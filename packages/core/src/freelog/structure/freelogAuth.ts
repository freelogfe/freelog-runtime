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
// import { freelogAuthApi  } from "freelog-runtime-api";

import { loginCallback } from "../bridge/eventOn";
import { resultType, eventType } from "../bridge/eventType";
const rawWindow = window;

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
  setHref: (href: string) => {
    rawWindow.location.href = href;
  },
  getHref: () => rawWindow.location.href,

  // ...freelogAuthApi
};
