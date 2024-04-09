import { getCurrentUser, getUserInfo, setUserInfo } from "./user";
import {
  registerUI,
  eventMap,
  failedMap,
  endEvent,
  clearEvent,
  updateLock,
  updateEvent,
  reload,
} from "../bridge/index";
import { freelogAuthApi } from "../freelogAuth";
import { loginCallback } from "../bridge/eventOn";
import { upperUI, lowerUI } from "../bridge";
import { resultType, eventType } from "../bridge/eventType";
const rawWindow = window;

export const freelogAuth = {
  upperUI,
  lowerUI,
  registerUI,
  eventMap,
  failedMap,
  endEvent,
  updateLock,
  updateEvent,
  clearEvent,
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
  ...freelogAuthApi,
};
