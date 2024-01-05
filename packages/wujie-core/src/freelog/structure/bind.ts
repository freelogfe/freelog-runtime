import { freelogApp  } from "./freelogApp" 
// 需要name的名单，或者不需要的名单
const whiteList = []
const obj = {}
export const bindName = (name:string)=>{
  return new Proxy(obj, {
    get: function (target, propKey, receiver) {
         // @ts-ignore
       if(typeof freelogApp[propKey] == "function"){
          return  function(){
            console.log(8889999,freelogApp,propKey,name,arguments,...arguments)
            return freelogApp[propKey](name,...arguments)
          }
       } 
    }
  });
}