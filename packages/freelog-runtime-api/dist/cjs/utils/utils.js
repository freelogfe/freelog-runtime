var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/utils.ts
var utils_exports = {};
__export(utils_exports, {
  checkEmail: () => checkEmail,
  checkPassword: () => checkPassword,
  checkPayPassword: () => checkPayPassword,
  checkPhone: () => checkPhone,
  checkUsername: () => checkUsername,
  compareObjects: () => compareObjects,
  isMobile: () => isMobile
});
module.exports = __toCommonJS(utils_exports);
function compareObjects(origin, data, diff = false) {
  let otype = Object.prototype.toString.call(origin);
  let dtype = Object.prototype.toString.call(data);
  if (dtype === otype && otype === "[object Array]") {
    origin = { 0: origin };
    data = { 0: data };
  } else if (otype !== dtype || otype !== "[object Object]") {
    !["[object Array]", "[object object]"].includes(otype) && console.error(origin + " is not object or array");
    !["[object Array]", "[object object]"].includes(dtype) && console.error(data + " is not object or array");
    return;
  }
  Object.keys(data).forEach((dkey) => {
    let isDelete = !diff;
    Object.keys(origin).some((okey) => {
      if (dkey === okey) {
        isDelete = !isDelete;
        if (diff) {
          return true;
        }
        let otype2 = Object.prototype.toString.call(origin[okey]);
        let dtype2 = Object.prototype.toString.call(data[dkey]);
        if (otype2 === dtype2 && dtype2 === "[object Object]") {
          compareObjects(origin[okey], data[dkey], diff);
        } else if (otype2 === dtype2 && dtype2 === "[object Array]" && Object.prototype.toString.call(origin[dkey][0]) === "[object Object]") {
          data[dkey].forEach((item) => {
            Object.prototype.toString.call(item) === "[object Array]" && compareObjects(origin[okey][0], item, diff);
          });
        }
        return true;
      }
      return false;
    });
    isDelete && delete data[dkey];
  });
}
function isMobile() {
  var browser = {
    versions: function() {
      var u = navigator.userAgent;
      return {
        //移动终端浏览器版本信息
        trident: u.indexOf("Trident") > -1,
        //IE内核
        presto: u.indexOf("Presto") > -1,
        //opera内核
        webKit: u.indexOf("AppleWebKit") > -1,
        //苹果、谷歌内核
        gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") === -1,
        //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/),
        //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        //ios终端
        android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
        //android终端或者uc浏览器
        iPhone: u.indexOf("iPhone") > -1,
        //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf("iPad") > -1,
        //是否iPad
        webApp: u.indexOf("Safari") === -1
        //是否web应该程序，没有头部与底部
      };
    }(),
    // @ts-ignore
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  };
  if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.iPhone || browser.versions.iPad) {
    return true;
  } else {
    return false;
  }
}
function checkPhone(phone) {
  if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
    return false;
  }
  return true;
}
function checkEmail(email) {
  const reg = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/gi;
  if (!reg.test(email)) {
    return false;
  }
  return true;
}
function checkPassword(password) {
  const reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,24})$/;
  if (!reg.test(password)) {
    return false;
  }
  return true;
}
function checkPayPassword(password) {
  const reg = /^\d{6}$/;
  if (!reg.test(password)) {
    return false;
  }
  return true;
}
function checkUsername(username) {
  const reg = /^(?!-)[A-Za-z0-9-]{1,30}(?<!-)$/;
  if (!reg.test(username)) {
    return false;
  }
  return true;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkEmail,
  checkPassword,
  checkPayPassword,
  checkPhone,
  checkUsername,
  compareObjects,
  isMobile
});
