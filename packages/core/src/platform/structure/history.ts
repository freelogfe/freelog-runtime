import { locations, setLocation, state, locationsForBrower } from "./proxy";
import { activeWidgets }from "./widget"
export const widgetHistories = new Map<any, any>();
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
  }
  obj.state = state
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
  if(fState && fState - obj.state == 1){
    obj.position = obj.position - 1;
    obj.state = obj.state - 1
    return obj.histories[obj.position];
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
