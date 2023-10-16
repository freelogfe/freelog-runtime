import { locations, setLocation, state, locationsForBrower } from "./proxy";
import { activeWidgets } from "./widget";
export const widgetHistories = new Map<any, any>();
/**
 * history
 * 要用算法思想
 * 每个插件有自己的路由历史
 * 但浏览器前进后退是最后一个插件提交的路由，不应该传导给其余插件
 * 需要考虑的问题：
 *     1.主题初始化路由，避免主题路由被卸载
 *     2.插件自己的前进后退，要不要传递到url上面
 *         2.1如果不传递，使用abstract路由，运行时不再管理
 *         2.2如果传递，那就正常使用
 *     3.浏览器后退只后退最后一次push路由的插件
 *     4.当浏览器回退后 没有受到影响的插件再次push，下次浏览器再回退，之前受影响的插件还要有自己独立的历史，不被覆盖。
 *     5.主题路由切换 需要主题自己卸载插件
 *     6.卸载掉的插件需要从url上移除
 *     6.state问题
 * 
 * 综上，浏览器前进后退暂时只考虑最后一次提交了push的，state问题也不考虑，就当成一个数字来使用
 * 
 * 
 * 数据结构：
 *     插件：type histories  
 *          length  长度
 *          histories  历史数组
 *          position 当前位置
 *          state: 状态按理不应该存在
 *          
 *          
 */       
type histories = {
  length: number;
  histories: Array<string>;
  position: number;
  state: number;
};
export function setHistory(key: string, history: any, isReplace?: boolean) {
  let obj: histories = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0,
    state: state,
  };
  if (isReplace && obj.length > 0) {
    obj.histories.splice(obj.position, 1, history);
  } else {
    let cut = obj.position;
    obj.histories = obj.histories.slice(0, cut + 1);
    obj.histories.push(history);
    obj.length = obj.histories.length;
    obj.position = obj.histories.length - 1;
    obj.state = state;
  }
  widgetHistories.set(key, obj);
}
export function getHistory(key: string) {
  let obj: histories = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0,
    state: state,
  };
  return { ...obj };
}
// 浏览器回退的话
export function historyBack(key: string, fState?: number) {
  let obj: histories = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0,
    state: state,
  };
  if (fState) {
    if (obj.state - fState  == 1) {
      obj.state = obj.state - 1;
      obj.position = obj.position - 1;
      return obj.histories[obj.position];
    }
    return false
  }
  if (obj.length > 0 && obj.position > 0) {
    obj.position = obj.position - 1;
    return obj.histories[obj.position];
  } else {
    // if(isBrowser){
    //   locations.delete(key);
    //   widgetHistories.delete(key);
    //   setLocation(true);
    // }
    return false;
    // return obj.histories = [];
    // return false;
  }
}
export function historyForward(key: string, fState?: number) {
  let obj: histories = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0,
    state: state,
  };
  if (fState) {
    if (fState - obj.state  == 1 && obj.histories[obj.position + 1]) {
      obj.state = obj.state + 1;
      obj.position = obj.position + 1;
      return obj.histories[obj.position];
    }
    return false
  }
  if (obj.length > 0 && obj.position < obj.length - 1) {
    obj.position = obj.position + 1;
    return obj.histories[obj.position];
  } else {
    // if(isBrowser){
    //   locations.delete(key);
    //   widgetHistories.delete(key);
    //   setLocation(true);
    // }
    return false;
  }
}
export function historyGo(key: string, count: number) {
  let obj: histories = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0,
    state: state,
  };
  if (
    obj.length > 0 &&
    obj.position > 0 &&
    obj.position + count < obj.length - 1 &&
    obj.position + count >= 0
  ) {
    obj.position = obj.position + count;
    return obj.histories[obj.position];
  } else {
    return false;
  }
}
