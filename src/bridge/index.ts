import { SUCCESS, FAILED, USER_CANCEL } from "./event";
export const presentableQueue = new Map<any, any>();
export const eventMap = new Map<any, any>();
export const failedMap = new Map<any, any>();
var UI:any = null
var updateUI:any = null
export function reisterUI(ui: any, update: any){
    UI = ui
    updateUI = update
}
export function setPresentableQueue(name: string, value:any){
  presentableQueue.set(name, value)
  console.log(presentableQueue)
}
let seq = 0;
export function addEvent(
  name: string,
  event: number,
  presentable: any,
  callBack: any,
  options?: any
) {
  seq++;
  const eventId = name + "#" + seq;
  eventMap.set(eventId, {eventId, event, presentable, callBack, options });
  UI && UI()
}
function removeEvent(eventId: string) {
  eventMap.delete(eventId);
  updateUI && updateUI()
}
export function endEvent(eventId: string, type: number, data: any) {
  if (eventMap.get(eventId)) {
    // TODO 重复代码
    switch (type) {
      case SUCCESS:
        eventMap.get(eventId).callBack(SUCCESS, data);
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
