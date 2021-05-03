import { SUCCESS, FAILED, USER_CANCEL } from "./event";
import { LOGIN, CONTRACT } from "./event";
/**
 * 架构设计目的： 
 *     1.有利于更快进行业务细分实现和技术实现 
 *     2.便于维护和管理
 *           UI可以插件化（模块化）
 *           例如交给无权限修改运行时的开发人员开发UI，所有UI插件队列由权限人员管理
 * 插件平台： 提供api给插件连接注册中心调取UI（是否弹出UI由注册中心判断决定）
 * 数据接口中心： 涉及授权的只要请求过，加入到注册中心的 已授权队列或未授权队列
 * 注册中心： UI事件种类： 1.登录   2.授权  3.其余ui（后续考虑）
 *           数据结构：已授权队列，未授权队列，处理失败队列（该队列保留处理时的数据），
 *                    插件唤起UI事件队列（必须处理完）
 *           处理方式：插件唤起Ui，如果在未授权队列里面有，才调用Ui部分
 * UI(s)： 所有UI注册到中心，用于注册中心唤起UI
 *         目前分类：登录UI， 授权UI
 *         展望：例如游戏over想要接着玩时 得看广告，那就有官方的广告UI
 * 目前不打算做的：Ui插件化
 * 目前还需要改的地方：已授权队列，UI部分，合约事件部分
 * 工作量安排：3日（以往工作经验1日，原因是对后端表关系与接口数据结构不是参与者）
 * 文档编写工作量安排：3日
 */
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
  addEvent.bind({name: 'test'})(name,()=>{console.log('success')},()=>{console.log('fail')})
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
    if (data.info.errorCode !== 30) {
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
