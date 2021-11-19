export function hookAJAX() {
  // @ts-ignore
  XMLHttpRequest.prototype.nativeOpen = XMLHttpRequest.prototype.open;
  // @ts-ignore
  var customizeOpen = function (method, url, async, user, password) {
    // do something
    //   this.nativeOpen(method, url, async, user, password);
  };
  // @ts-ignore
  XMLHttpRequest.prototype.open = customizeOpen;
}

/**
 *全局拦截Image的图片请求添加token
 *
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
