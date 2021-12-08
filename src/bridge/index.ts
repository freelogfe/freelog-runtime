import { SUCCESS, FAILED, USER_CANCEL, DATA_ERROR } from "./event";
import { getExhibitInfo } from "../platform/structure/api";
export const exhibitQueue = new Map<any, any>();
export const eventMap = new Map<any, any>(); // 数组
export const failedMap = new Map<any, any>();
const rawDocument = document;
let UI: any = null;
let updateUI: any = null;
let loginUI: any = null;
let loginOutUI: any = null;
export function reisterUI(ui: any, update: any, login: any, loginOut: any) {
  UI = ui;
  updateUI = update;
  loginUI = login;
  loginOutUI = loginOut;
}
let locked = false;
export function updateLock(status: boolean) {
  locked = !!status;
}
export function setPresentableQueue(name: string, value: any) {
  exhibitQueue.set(name, value);
}
let uiInited = false;
// 公共非展品事件UI， 后面考虑
export async function addAuth(
  exhibitId: any,
  options?: any
) {
  // @ts-ignore
  const that = this;
  const name = that.name;
  const response = await getExhibitInfo(exhibitId, {
    isLoadPolicyInfo: 1,
    isLoadVersionProperty: 1,
    isLoadContract: 1,
    isTranslate: 1
  });
  if(response.data.errCode){
    return Promise.resolve({status: DATA_ERROR, data: response.data})
  }
  const data = response.data.data;
  data.contracts = data.contracts || []
  const arr = eventMap.get(exhibitId)?.callBacks || [];
  return new Promise((resolve, rej) => {
    arr.push({
      resolve,
      options,
      widgetName: name
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
        console.log(uiInited)
        UI && UI();
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
  })
}
export function callAuth() {
  if (!uiInited) {
    UI && UI();
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
        item.resolve({status: SUCCESS, data} );
      });
      exhibitQueue.delete(eventId);
      removeEvent(eventId);
      break;
    case FAILED:
      eventMap.get(eventId).callBacks.forEach((item: any) => {
        item.resolve({status: FAILED, data});
      });
      exhibitQueue.delete(eventId);
      removeEvent(eventId);
      break;
    case USER_CANCEL:
      eventMap.forEach((event: any) => {
        event.callBacks.forEach((item: any) => {
          item.resolve({status: USER_CANCEL, data});
        });
      });
      exhibitQueue.clear();
      removeEvent();
      break;
  }
  // }
}

export function goLogin() {
  loginUI && loginUI();
}
export function goLoginOut() {
  loginOutUI && loginOutUI();
}
const uiRoot = rawDocument.getElementById("ui-root");
const widgetContainer = rawDocument.getElementById("freelog-plugin-container");
export function upperUI() {
  // @ts-ignore
  uiRoot.style.zIndex = 1;
  // // @ts-ignore
  // uiRoot.style.opacity = 1;
  // @ts-ignore
  widgetContainer.style.zIndex = 0;
}
export function lowerUI() {
  // @ts-ignore
  uiRoot.style.zIndex = 0;
  // // @ts-ignore
  // uiRoot.style.opacity = 0;
  // @ts-ignore
  widgetContainer.style.zIndex = 1;
}

export const loginCallback: any = [];
// 登录和切换用户需要触发
export async function onLogin(callback: any) {
  if (typeof callback === "function") {
    loginCallback.push(callback);
  } else {
    console.error("onLogin error: ", callback, " is not a function!");
  }
}
export function reload() {
  window.location.reload();
}
