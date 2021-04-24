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
export function addEvent(presentableId: any, callBack: any, options?: any) {
  let event 
  // @ts-ignore
  if (this.name !== "node") {
    // @ts-ignore
    let data = presentableQueue.get(presentableId);
    if(!data){
      //  TODO 返回信息
      callBack({ errorCode: 2, msg: presentableId + ' is inncorrect or not required for callUI' })
      return
    }
    // TODO 根据errorCode 决定事件
    if(data.info.errorCode === 30){
      event = LOGIN
    }
    eventMap.set(presentableId, { event, presentableId, presentableInfo: data.info, callBack, options });
    UI && UI();
    return 
  }
  // @ts-ignore
  eventMap.set(this.name, { event: this.event, presentableId, callBack, options });
  UI && UI();
}
function removeEvent(eventId: string) {
  eventMap.delete(eventId);
  updateUI && updateUI();
}
export function endEvent(eventId: string, type: number, data: any) {
  if (eventMap.get(eventId)) {
    // TODO 重复代码
    switch (type) {
      case SUCCESS:
        eventMap.get(eventId).callBack(SUCCESS, data);
        presentableQueue.delete(eventId)
        removeEvent(eventId);
        break;
      case FAILED:
        eventMap.get(eventId).callBack(FAILED, data);
        removeEvent(eventId);
        break;
      case USER_CANCEL:
        eventMap.get(eventId).callBack(USER_CANCEL, data);
        removeEvent(eventId);
        break;
    }
  }
}
