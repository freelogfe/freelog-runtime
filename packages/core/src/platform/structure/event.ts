 
export const loginCallback:any = []
// 登录和切换用户需要触发
export async function onLogin(
  callback: any 
) {
  if(typeof callback === 'function'){
    loginCallback.push(callback)
  } else{
    console.error('onLogin error: ' , callback, ' is not a function!')
  }
}