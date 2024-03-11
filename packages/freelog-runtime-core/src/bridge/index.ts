import { SUCCESS, FAILED, USER_CANCEL, DATA_ERROR } from "./eventType";
import { LOGIN, CONTRACT, LOGIN_OUT } from "./eventType";
import { onLogin } from "./eventOn";
import { freelogApp } from "../structure/freelogApp";
import { widgetsConfig } from "../structure/widget";
import { isMobile } from "../utils/utils";

export const exhibitQueue = new Map<any, any>();
export const eventMap = new Map<any, any>(); // 数组
export const failedMap = new Map<any, any>();
const rawWindow = window;
let UI: any = null;
let updateUI: any = null;
let locked = false;
let uiInited = false;
export function getUISatus() {
  return uiInited;
}
/**
 *
 * @param ui    签约事件型UI，登录UI，节点冻结UI，主题冻结UI，无主题UI，
 * @param update    更新签约事件型UI
 * @param login    提供给插件唤起登录UI
 * @param loginOut  提供给插件唤起登出UI
 *
 *
 */
export function registerUI(ui: any, update: any) {
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
export async function addAuth(name: string, exhibitId: any, options?: any) {
  const arr = eventMap.get(exhibitId)?.callBacks || [];
  const widgetData = widgetsConfig.get(name);
  return new Promise((resolve) => {
    Promise.all([
      freelogApp.getExhibitInfo(name, exhibitId, {
        isLoadPolicyInfo: 1,
        isLoadVersionProperty: 1,
        isLoadContract: 1,
        isLoadResourceDetailInfo: 1,
        isTranslate: 1,
      }),
      freelogApp.getExhibitAuthStatus(name, exhibitId),
      freelogApp.getExhibitAvailalbe(name, exhibitId),
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
      const id = exhibitId;
      eventMap.set(id, {
        isTheme: name ? false : widgetData.isTheme,
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

export function goLogin(resolve: any) {
  if (uiInited) {
    console.error("ui has been launched, can not callLogin");
    return "ui has been launched, can not callLogin";
  }
  resolve && onLogin("", resolve);
  UI && UI(LOGIN);
}
export function goLoginOut() {
  UI && UI(LOGIN_OUT);
}
const uiRoot = document.getElementById("ui-root");
const widgetContainer = document.getElementById("freelog-plugin-container");
const mobile = isMobile();
const metaEl: any = document.querySelectorAll('meta[name="viewport"]')[0];
let metaViewPortContent = "";
export function upperUI() {
  if (mobile) {
    metaViewPortContent = metaEl.getAttribute("content");
    // TODO 这个设置不该与运行时耦合
    metaEl.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    );
  }
  // @ts-ignore
  uiRoot.style.zIndex = 1;
  // uiRoot.style.opacity = 1;
  // @ts-ignore
  widgetContainer.style.zIndex = 0;
}
export function lowerUI() {
  uiInited = false;
  if (mobile) {
    metaEl.setAttribute("content", metaViewPortContent);
  }
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
