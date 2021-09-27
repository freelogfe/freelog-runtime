export const widgetHistories = new Map<any, any>();
type histories = {
  length: number;
  histories: Array<string>;
  position: number;
};
export function setHistory(key: string, history: any, isReplace?: boolean) {
  let obj: histories = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0,
  };
  if (isReplace && obj.length > 0) {
    obj.histories.splice(obj.position, 1, history);
  } else {
    let cut = obj.position
    obj.histories = obj.histories.slice(0, cut + 1)
    obj.histories.push(history);
    obj.length = obj.histories.length;
    obj.position = obj.histories.length - 1
  }
  console.log(obj)
  widgetHistories.set(key, obj)
}
export function getHistory(key: string) {
  let obj: histories = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0,
  };
  return {...obj}
}
export function historyBack(key: string) {
  let obj: histories = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0,
  };
  if (obj.length > 0 && obj.position > 0) {
    obj.position = obj.position - 1;
    return obj.histories[obj.position];
  } else {
    return false;
  }
}
export function historyForward(key: string) {
  let obj: histories = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0,
  };
  if (obj.length > 0  && obj.position < obj.length - 1) {
    obj.position = obj.position + 1;
    return obj.histories[obj.position];
  } else {
    return false;
  }
}
export function historyGo(key: string, count: number) {
  let obj: histories = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0,
  };
  console.log(obj)
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
