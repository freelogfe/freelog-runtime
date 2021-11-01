import { SUCCESS, FAILED, USER_CANCEL } from "./event";
import { LOGIN, CONTRACT } from "./event";
 

export const presentableQueue = new Map<any, any>();
export const eventMap = new Map<any, any>(); // 数组
export const failedMap = new Map<any, any>();
const rawDocument = document
let UI: any = null;
let updateUI: any = null;
let loginUI:any = null
export function reisterUI(ui: any, update: any, login:any) {
  UI = ui;
  updateUI = update;
  loginUI = login
}
let locked = false;
export function updateLock(status: boolean) {
  locked = !!status;
}
export function setPresentableQueue(name: string, value: any) {
  presentableQueue.set(name, value);
}
let uiInited = false;
// 公共非展品事件UI， 后面考虑
export function addAuth(
  presentableId: any,
  resolve: any,
  reject: any,
  options?: any
) {
  if (typeof resolve !== "function") {
    resolve = () => {};
  }
  if (typeof reject !== "function") {
    reject = () => {};
  }
  let event;
  // @ts-ignore
  const name = this.name;
  if (name !== "node") {
    // @ts-ignore
    let data = presentableQueue.get(presentableId);
    if (!data) {
      //  TODO 返回信息
      reject &&
        reject({
          errorCode: 2,
          msg: presentableId + " is inncorrect or not required for callUI",
        });
      return;
    }
    // TODO 根据 errCode 决定事件 外部函数判断，不写在里面
    if (data.errCode === 3 && data.authCode === 502 && false) {
      event = LOGIN;
    } else {
      event = CONTRACT;
    }
    const arr = eventMap.get(presentableId)?.callBacks || [];
    arr.push({
      resolve,
      reject,
      options,
    });
    let id = presentableId;
    if (event === LOGIN) id = event;
    eventMap.set(id, {
      event, // UI事件用最新的
      eventId: id, // 后期evnetId是要与prsesentableId区分开来的
      ...data,
      callBacks: arr,
    });
    if (options && options.immediate) {
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
    uiInited = true;
    return;
  }
  eventMap.set(name, {
    // @ts-ignore
    event: this.event,
    // @ts-ignore
    eventId: name, // 后期evnetId是要与prsesentableId区分开来的
    presentableId,
    callBacks: [
      {
        resolve,
        reject,
        options,
      },
    ],
  });
  UI && UI();
  uiInited = true;
}
export function callAuth() {
  if (!uiInited) {
    UI &&  UI();
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
export function updateEvent(event:any) {
  if(!event) return eventMap
  eventMap.set(event.eventId, event)
  return eventMap
}
function removeEvent(eventId?: string) {
  if(eventId){
    eventMap.delete(eventId);
  }else{
    eventMap.clear()
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
          item.resolve(data);
        });
        presentableQueue.delete(eventId);
        removeEvent(eventId);
        break;
      case FAILED:
        eventMap.get(eventId).callBacks.forEach((item: any) => {
          item.reject(FAILED, data);
        });
        presentableQueue.delete(eventId);
        removeEvent(eventId);
        break;
      case USER_CANCEL:
        eventMap.forEach((event:any)=>{
          event.callBacks.forEach((item: any) => {
            item.reject(USER_CANCEL, data);
          });
        }) 
        presentableQueue.clear();
        removeEvent();
        break;
    }
  // }
}

export function goLogin() {
  loginUI && loginUI()
}
const uiRoot = rawDocument.getElementById("ui-root")
const widgetContainer = rawDocument.getElementById("freelog-plugin-container")
export function upperUI() {
   // @ts-ignore
   uiRoot.style.zIndex = 1;
   // @ts-ignore
   uiRoot.style.opacity = 1;
   // @ts-ignore
   widgetContainer.style.zIndex = 0;
}
export function lowerUI() {
   // @ts-ignore
   uiRoot.style.zIndex = 0;
   // @ts-ignore
   uiRoot.style.opacity = 0;
   // @ts-ignore
   widgetContainer.style.zIndex = 1;
}

export const loginCallback:any = []
// 登录和切换用户需要触发
export async function onLogin(
  callback: any 
) {
  if(typeof callback === 'function'){
    loginCallback.push(callback)
  } else{
    console.error('onLogin error: ' , callback, ' is not a function!')
  }
}