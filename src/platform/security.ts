import docCookies from "doc-cookies";

/**
 * 目标：防止插件通过非运行时的途径调用接口
 */

export function hookAJAX() {
  // @ts-ignore
  XMLHttpRequest.prototype.nativeOpen = XMLHttpRequest.prototype.open;
  // @ts-ignore
  var customizeOpen = function (method, url, async, user, password) {
    // do something
  };
  // @ts-ignore
  XMLHttpRequest.prototype.open = customizeOpen;
}

/**
 *全局拦截Image的图片请求添加token
 */
 export function hookImg() {
  const property = Object.getOwnPropertyDescriptor(Image.prototype, "src");
  // @ts-ignore
  const nativeSet = property.set;
  // @ts-ignore
  function customiseSrcSet(url) {
    // @ts-ignore
    nativeSet.call(this, url);
  }
  Object.defineProperty(Image.prototype, "src", {
    set: customiseSrcSet,
  });
}

/**
 * 拦截全局open的url添加token
 *
 */
 export function hookOpen() {
  const nativeOpen = window.open;
  // @ts-ignore
  window.open = function (url) {
    // do something
    nativeOpen.call(this, url);
  };
}

export function hookFetch() {
  var fet = Object.getOwnPropertyDescriptor(window, "fetch");
  Object.defineProperty(window, "fetch", {
    // @ts-ignore
    value: function (a, b, c) {
      // do something
      // @ts-ignore
      return fet.value.apply(this, args);
    },
  });
}
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
