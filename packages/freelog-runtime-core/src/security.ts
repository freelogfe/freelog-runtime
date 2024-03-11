import * as docCookies from "doc-cookies";
let inited = false;
export function initUserCheck() {
  inited = true;
}
const rawLocation = window.location
const rawWindow = window

export function isUserChange(name:string){
  let uid = docCookies.getItem("uid");
  uid = uid ? uid : "";
  if (inited && uid !== rawWindow.userId) {
    rawLocation.reload();
    return true;
  }
  // 有页面登出后，还处于登录状态的页面处理方式
  if (inited && rawWindow.userId && !uid) {
    rawLocation.reload();
    return true;
  }
  return false
}
