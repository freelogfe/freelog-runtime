import docCookies from "doc-cookies";

 
 

 
let inited = false;
export function initUserCheck() {
  inited = true;
}
const rawLocation = window.location

export function isUserChange(){
  let uid = docCookies.getItem("uid");
  uid = uid ? uid : "";
  if (inited && uid !== window.userId) {
    rawLocation.reload();
    return true;
  }
  // 有页面登出后，还处于登录状态的页面处理方式
  if (inited && window.userId && !uid) {
    rawLocation.reload();
    return true;
  }
  return false
}
