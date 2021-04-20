/**
 *
 * @param origin model
 * @param data wait to compare with model
 * @param diff  if only reserve difference set
 * delete the data's keys while they are (not) exist in origin
 */
export function compareObjects(origin: any, data: any, diff = false) {
  let otype = Object.prototype.toString.call(origin);
  let dtype = Object.prototype.toString.call(data);
  if (dtype === otype && otype === "[object Array]") {
    origin = { 0: origin };
    data = { 0: data };
  } else if (otype !== dtype || otype !== "[object Object]") {
    !["[object Array]", "[object object]"].includes(otype) &&
      console.error(origin + " is not object or array");
    !["[object Array]", "[object object]"].includes(dtype) &&
      console.error(data + " is not object or array");
    return;
  }
  Object.keys(data).forEach((dkey) => {
    // depend on whether diff
    let isDelete = !diff;
    Object.keys(origin).some((okey) => {
      if (dkey === okey) {
        isDelete = !isDelete;
        if (diff) {
          return true;
        }
        let otype = Object.prototype.toString.call(origin[okey]);
        let dtype = Object.prototype.toString.call(data[dkey]);
        // loop if they are object the same time
        if (otype === dtype && dtype === "[object Object]") {
          compareObjects(origin[okey], data[dkey], diff);
        } else if (
          otype === dtype &&
          dtype === "[object Array]" &&
          Object.prototype.toString.call(origin[dkey][0]) === "[object Object]"
        ) {
          // if they are array the same time and origin[dkey][0] is object,
          data[dkey].forEach((item: any) => {
            Object.prototype.toString.call(item) === "[object Array]" &&
              compareObjects(origin[okey][0], item, diff);
          });
        }
        return true;
      }
      return false;
    });
    isDelete && delete data[dkey];
  });
}

export function isMobile() {
  var browser = {
    versions: (function () {
      var u = navigator.userAgent
        // app = navigator.appVersion;
      return {
        //移动终端浏览器版本信息
        trident: u.indexOf("Trident") > -1, //IE内核
        presto: u.indexOf("Presto") > -1, //opera内核
        webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
        gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") === -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
        iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf("iPad") > -1, //是否iPad
        webApp: u.indexOf("Safari") === -1, //是否web应该程序，没有头部与底部
      };
    })(),
    // @ts-ignore
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),
  };
  //如果是移动端就进行这里
  if (
    browser.versions.mobile ||
    browser.versions.ios ||
    browser.versions.android ||
    browser.versions.iPhone ||
    browser.versions.iPad
  ) {
      return true
   } else {
    return false
  }
}
