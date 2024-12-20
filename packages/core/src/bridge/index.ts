import {
  SUCCESS,
  FAILED,
  USER_CANCEL,
  DATA_ERROR,
  TEST_NODE,
  OFFLINE,
} from "./eventType";
import {
  NODE_FREEZED,
  THEME_NONE,
  THEME_FREEZED,
  LOGIN,
  CONTRACT,
  LOGIN_OUT,
} from "./eventType";
import { onLogin } from "./eventOn";
import {
  getExhibitInfo,
  getExhibitAuthStatus,
  getExhibitAvailalbe,
} from "../platform/structure/api";
export const exhibitQueue = new Map<any, any>();
export const eventMap = new Map<any, any>(); // 数组
export const failedMap = new Map<any, any>();
const rawDocument = document;
const rawWindow = window;
let UI: any = null;
let updateUI: any = null;
let locked = false;
let uiInited = false;

/**
 *
 * @param ui    签约事件型UI，登录UI，节点冻结UI，主题冻结UI，无主题UI，
 * @param update    更新签约事件型UI
 * @param login    提供给插件唤起登录UI
 * @param loginOut  提供给插件唤起登出UI
 *
 *
 */
export function reisterUI(ui: any, update: any) {
  UI = ui;
  updateUI = update;
}
export function callUI(type: any, data: any) {
  UI && UI(type, data);
}
export function updateLock(status: boolean) {
  locked = !!status;
}
export function setPresentableQueue(name: string, value: any) {
  exhibitQueue.set(name, value);
}
// TODO 公共非展品事件UI， 后面考虑
export async function addAuth(exhibitId: any, options?: any) {
  // @ts-ignore
  const that = this;
  const name = that.name;
  const arr = eventMap.get(exhibitId)?.callBacks || [];
  return new Promise((resolve, rej) => {
    Promise.all([
      getExhibitInfo(exhibitId, {
        isLoadPolicyInfo: 1,
        isLoadVersionProperty: 1,
        isLoadContract: 1,
        isLoadResourceDetailInfo: 1,
        isTranslate: 1,
      }),
      getExhibitAuthStatus(exhibitId),
      getExhibitAvailalbe(exhibitId),
    ]).then((response) => {
      if (response[1].data.errCode) {
        resolve({ status: DATA_ERROR, data: response[1].data });
        return;
      }

      // if (response[0].data.data.onlineStatus === 0) {
      //   resolve({ status: OFFLINE, data: response[0].data });
      //   return;
      // }
      const data = response[0].data.data;
      data.contracts = data.contracts || [];
      data.defaulterIdentityType = response[1].data.data[0].authCode;
      data.isAvailable = response[2].data.data[0].isAuth;
      data.availableData = response[2].data.data[0];
      arr.push({
        resolve,
        options,
        widgetName: name,
      });
      let id = exhibitId;
      eventMap.set(id, {
        isTheme: that.isTheme,
        eventId: id, // 后期evnetId是要与prsesentableId区分开来的
        ...data,
        callBacks: arr,
      });
      if (options && options.immediate) {
        if (!uiInited) {
          UI && UI(CONTRACT);
        } else {
          if (locked) {
            setTimeout(() => {
              updateUI && updateUI();
            }, 0);
          } else {
            updateUI && updateUI();
          }
        }
      }
      uiInited = true;
    });
  });
}
export function callAuth() {
  if (window.isTest) return;
  if (!uiInited) {
    UI && UI(CONTRACT);
  } else {
    if (locked) {
      setTimeout(() => {
        updateUI && updateUI();
      }, 0);
    } else {
      updateUI && updateUI();
    }
  }
}
export function clearEvent() {
  eventMap.clear();
  lowerUI();
  uiInited = false;
}
export function updateEvent(event: any) {
  if (!event) return eventMap;
  eventMap.set(event.eventId, event);
  return eventMap;
}
function removeEvent(eventId?: string) {
  if (eventId) {
    eventMap.delete(eventId);
  } else {
    eventMap.clear();
    uiInited = false;
  }
  if (locked) {
    setTimeout(() => {
      updateUI && updateUI();
    }, 0);
  } else {
    updateUI && updateUI();
  }
}
export function endEvent(eventId: string, type: number, data: any) {
  // if (eventMap.get(eventId)) {
  // TODO 重复代码
  switch (type) {
    case SUCCESS:
      eventMap.get(eventId).callBacks.forEach((item: any) => {
        item.resolve({ status: SUCCESS, data });
      });
      exhibitQueue.delete(eventId);
      removeEvent(eventId);
      break;
    case FAILED:
      eventMap.get(eventId).callBacks.forEach((item: any) => {
        item.resolve({ status: FAILED, data });
      });
      exhibitQueue.delete(eventId);
      removeEvent(eventId);
      break;
    case USER_CANCEL:
      uiInited = false;
      eventMap.forEach((event: any) => {
        event.callBacks.forEach((item: any) => {
          item.resolve({ status: USER_CANCEL, data });
        });
      });
      exhibitQueue.clear();
      removeEvent();
      break;
  }
  // }
}

export function goLogin(resolve: Function) {
  if (uiInited) {
    console.error("ui has been launched, can not callLogin");
    return "ui has been launched, can not callLogin";
  }
  resolve && onLogin(resolve);
  UI && UI(LOGIN);
}
export function goLoginOut() {
  UI && UI(LOGIN_OUT);
}
const uiRoot = rawDocument.getElementById("ui-root");
const widgetContainer = rawDocument.getElementById("freelog-plugin-container");
export function upperUI() {
  // @ts-ignore
  uiRoot.style.zIndex = 1;
  // uiRoot.style.opacity = 1;
  // @ts-ignore
  widgetContainer.style.zIndex = 0;
}
export function lowerUI() {
  uiInited = false;
  // @ts-ignore
  uiRoot.style.zIndex = 0;
  // // @ts-ignore
  // uiRoot.style.opacity = 0;
  // @ts-ignore
  widgetContainer.style.zIndex = 1;
}

export function reload() {
  rawWindow.location.reload();
}
