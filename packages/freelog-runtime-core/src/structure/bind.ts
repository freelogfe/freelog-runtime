import { freelogApp } from "./freelogApp";
// 需要name的名单，或者不需要的名单
// const whiteList = []
const obj = {};
export const bindName = (name: string, registerApi: any) => {
  return new Proxy(obj, {
    // @ts-ignore
    get: function(target, propKey) {
      if (propKey === "registerApi") {
        return registerApi;
      }
      // @ts-ignore
      if (typeof freelogApp[propKey] == "function") {
        return (...rest: any) => {
          // eslint-disable-next-line prefer-rest-params
          return freelogApp[propKey](name, ...rest);
        };
      } else {
        return freelogApp[propKey];
      }
    },
  });
};
