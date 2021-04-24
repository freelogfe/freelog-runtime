import { addEvent } from "../../bridge/index";
// 异步回调
export function asyncCallUI(presentableId: any, callBack: any, options?: any) {
  // @ts-ignore
  addEvent.bind(this)(presentableId, callBack, options);
}
// 同步回调  callBack 与callUI函数后面的代码执行顺序 是有问题的，后面代码可能先执行，所以这里的同步回调，把后面代码写入callBack才是正确的
export async function callUI(presentableId: any, callBack: any, options?: any) {
  await new Promise((resolve, reject) => {
    resolve = callBack;
    reject = callBack;
     // @ts-ignore
    addEvent.bind(this)(presentableId, callBack, options);
  });
}
