import { SUCCESS, FAILED, USER_CANCEL } from "./event";
import { LOGIN, CONTRACT, PAY } from "./event";

export const presentableQueue = new Map<any, any>();
export const eventMap = new Map<any, any>();
export const failedMap = new Map<any, any>();
var UI: any = null;
var updateUI: any = null;
export function reisterUI(ui: any, update: any) {
  UI = ui;
  updateUI = update;
}
export function setPresentableQueue(name: string, value: any) {
  presentableQueue.set(name, value);
  console.log(presentableQueue);
}
// 公共非展品事件UI， 后面考虑
export function addEvent(
  presentableId: any,
  resolve: any,
  reject: any,
  options?: any
) {
  if(typeof resolve !== 'function'){
    resolve = ()=>{}
  }
  if(typeof reject !== 'function'){
    reject = ()=>{}
  }
  let event;
  // @ts-ignore
  if (this.name !== "node") {
    // @ts-ignore
    let data = presentableQueue.get(presentableId);
    if (!data) {
      //  TODO 返回信息
      reject && reject({
        errorCode: 2,
        msg: presentableId + " is inncorrect or not required for callUI",
      });
      return;
    }
    // TODO 根据errorCode 决定事件 外部函数判断，不写在里面
    if (data.info.errorCode === 30) {
      event = LOGIN;
    }
    if (data.info.errorCode === 30) {
      event = PAY;
    }
    if (data.info.errorCode === 30) {
      event = CONTRACT;
    }
    eventMap.set(presentableId, {
      event,
      eventId: presentableId, // 后期evnetId是要与prsesentableId区分开来的
      presentableId,
      presentableInfo: data.info,
      resolve,
      reject,
      options,
    });
    UI && UI();
    return;
  }
  // @ts-ignore
  eventMap.set(this.name, {
    // @ts-ignore
    event: this.event,
    // @ts-ignore
    eventId: this.name, // 后期evnetId是要与prsesentableId区分开来的
    presentableId,
    resolve,
    reject,
    options,
  });
  UI && UI();
}
function removeEvent(eventId: string) {
  eventMap.delete(eventId);
  updateUI && updateUI();
}
export function endEvent(eventId: string, type: number, data: any) {
  console.log(eventMap.get(eventId))
  if (eventMap.get(eventId)) {
    // TODO 重复代码
    switch (type) {
      case SUCCESS:
        eventMap.get(eventId).resolve(SUCCESS, data);
        presentableQueue.delete(eventId);
        removeEvent(eventId);
        break;
      case FAILED:
        eventMap.get(eventId).reject(FAILED, data);
        removeEvent(eventId);
        break;
      case USER_CANCEL:
        eventMap.get(eventId).reject(USER_CANCEL, data);
        removeEvent(eventId);
        break;
    }
  }
}
