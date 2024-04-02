import * as docCookies from "doc-cookies";
import { getCurrentUser } from "./structure/utils";

let inited = false;
export function initUserCheck() {
  inited = true;
}
const rawLocation = window.location;

export async function isUserChange(name: string) {
  let uid = docCookies.getItem("uid");
  const userInfo = getCurrentUser();
  uid = uid ? uid : "";
  if (inited && uid !== userInfo?.userId) {
    rawLocation.reload();
    return true;
  }
  // 有页面登出后，还处于登录状态的页面处理方式
  if (inited && userInfo?.userId && !uid) {
    rawLocation.reload();
    return true;
  }
  return false;
}
