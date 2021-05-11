import { addAuth } from "../../bridge/index";
// 异步回调
export function asyncCallUI(
  presentableId: any,
  resolve: any,
  reject: any,
  options?: any
) {
  // @ts-ignore
  addAuth.bind(this)(presentableId, resolve, reject, options);
}
// 同步回调  callBack 与callUI函数后面的代码执行顺序 是有问题的，后面代码可能先执行，所以这里的同步回调，把后面代码写入callBack才是正确的
// 已解决
export async function callUI(
  presentableId: any,
  resolve: any,
  reject: any,
  options?: any
) {
  await new Promise((res, rej) => {
    const _res = () => {
      // @ts-ignore
      resolve && resolve(...arguments);
      // @ts-ignore
      res && res(...arguments);
    };
    const _rej = () => {
      // @ts-ignore
      reject && reject(...arguments);
      // @ts-ignore
      rej && rej(...arguments);
    };
    // @ts-ignore
    addAuth.bind(this)(presentableId, _res, _rej, options);
  });
}
