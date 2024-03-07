import { freelogApp  } from "./freelogApp" 
// 需要name的名单，或者不需要的名单
// const whiteList = []
const obj = {}
export const bindName = (name:string)=>{
  return new Proxy(obj, {
    // @ts-ignore
    get: function (target, propKey) {
         // @ts-ignore
       if(typeof freelogApp[propKey] == "function"){
          return  function(){
            // eslint-disable-next-line prefer-rest-params
            return freelogApp[propKey](name,...arguments)
          }
       }else{
        return freelogApp[propKey]
       } 
    }
  });
}