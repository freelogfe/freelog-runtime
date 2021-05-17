export const statusTower = new Array<Array<any>>();
/**
 * 数据结构：图（有环但不循环）
 *           链表pre=[a,b,c]  next=[d,e,f,a, b, c]  即形成了环，停止深度搜索
 * 对象：
 *     节点：状态
 *     节点之间连线：通过某个事件转向节点，这个事件就是连线
 * 节点数据结构：
 *     {
 *       id: a,
 *       pre: [], // 路线中出现过的节点id
 *       events: [], // 事件集合
 *       next: [], // 可以通过事件达到的节点id
 *     }
 * 事件解析：
 *     解析出节点下的所有事件能够达到的节点 （后端数据已经提供）
 *
 * 语义化：
 *     事件释义模板：
 *         1.事件名语义
 *         2.参数语义
 *     对每条路线解析成语义化策略：
 *       原则：适配现实中常用策略
 *         1.简单策略：例如直接显示：签约后付款5元获得${授权后事件}授权
 *         2.复杂策略：告知签约后可执行步骤，每个
 *  
 * 
 * 什么事件
 * 怎么触发事件
 * 事件目的
 * 
 * 列举：
 *      付款后获得一个月授权
 *                
 *      付款事件
 *          付amount到account后 达到 一个状态（假如是授权态）
 *          到达一个状态后会怎么样
 *          假如 事件一个月后到期 
 *               或事件快到期 到达一个快到期状态
 *          快到期状态事件  续费1块就可以 达到另一个状态 授权
 *          
 *          付amount到account后 达到 授权状态
 *      
 */

const CycleEndEvent = {
  cycleCount: "",
  timeUnit: "",
};
const TransactionEvent = {
  amount: "",
  account: "",
};
const TimeEvent = {
  dateTime: "",
};
const RelativeTimeEvent = {
  elapsed: "",
  timeUnit: "",
};
export function getEventDes(eventName: string, args: any) {

  Object.keys(args).forEach((key: any) => {});
}
