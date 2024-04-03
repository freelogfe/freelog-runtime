import * as docCookies from "doc-cookies";
import { getCurrentUser } from "./structure/utils";

const rawLocation = window.location;

export async function isUserChange(name: string) {
  let uid = docCookies.getItem("uid");
  const userInfo = getCurrentUser();
  uid = uid ? uid : "";
  const userId = userInfo?.userId || "";
  // 用户变化, 从无到有，从有到另有
  if (uid !== userId) {
    rawLocation.reload();
    // return true;
  }
  // 用户变化, 从有到无，有页面登出后，还处于登录状态的页面处理方式
  if (userInfo?.userId && !uid) {
    rawLocation.reload();
    // return true;
  }
  return false;
}
