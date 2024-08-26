import { getUserInfoForAuth, getUserInfo, setUserInfo } from "./user";
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
import {
  upperUI,
  lowerUI,
  callLoginOutCallback,
  callLoginCallback,
} from "../bridge";
import { resultType, eventType } from "../bridge/eventType";
import { dev } from "./dev";

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
  devData: dev(),
  setUserInfo,
  getUserInfoForAuth,
  getUserInfo,
  callLoginOutCallback,
  callLoginCallback,
  reload,
  eventType,
  setHref: (href: string) => {
    rawWindow.location.href = href;
  },
  getHref: () => rawWindow.location.href,
  ...freelogAuthApi,
};

