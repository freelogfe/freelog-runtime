import { widgetsConfig, flatternWidgets } from "./widget";
import { freelogApp } from "./freelogApp";
import { DEV_FALSE, dev } from "./dev";
import { baseInfo } from "../base/baseInfo";
import { getWechatShare } from "../base";
export const SHARE_DETAIL = "detail";
export const SHARE_CONTENT = "content";
export const FREELOG_ROUTE_MAPS = "FREELOG_ROUTE_MAPS";
const rawLocation = location;
const rawWindow = window;

export function isWeChatOrQQ() {
  var ua = navigator.userAgent.toLowerCase();

  // 判断是否为微信浏览器
  var isWeChat = /micromessenger/.test(ua);

  // 判断是否为QQ浏览器
  var isQQ = /qq/.test(ua) && !/micromessenger/.test(ua); // 确保不是微信环境中的QQ链接

  return isWeChat || isQQ;
}
const firstUrl = rawWindow.location.href;
export function jumpShareWechat() {
  const nodename = getNodeName();
  const rawURL = new URL(rawWindow.location.href);
  const isShare = rawWindow.location.host.split(".")[0] === "share";
  if (isWeChatOrQQ()) {
    if (!isShare) {
      const url = `https://share.${baseInfo.HOST}/`;
      const search = rawWindow.location.search
        ? `${rawWindow.location.search}&nodename=${nodename}`
        : `?nodename=${nodename}`;
      rawWindow.location.href = url + search + "&time=" + new Date().getTime();
    } else {
      loadWeChatJSSDK();
    }
  } else {
    if (isShare) {
      rawURL.searchParams.delete("nodename");
      rawURL.searchParams.delete("time");
      const url = `https://${nodename}.${baseInfo.HOST}/`;
      rawWindow.location.href = url + rawURL.search;
    }
  }
}

export function getNodeName(): string {
  const nodename = rawWindow.location.host.split(".")[0];
  const url = new URL(rawWindow.location.href);
  if (nodename === "share") {
    return url.searchParams.get("nodename") as string;
  }
  return nodename;
}
let wx = rawWindow.wx;
function getOS() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Android")) {
    return "Android";
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    return "iOS";
  } else {
    return "Unknown";
  }
}
function loadWeChatJSSDK() {
  // 检查是否已经加载了微信JS-SDK
  if (rawWindow.wx) {
    wx = rawWindow.wx;
  } else {
    var script = document.createElement("script");
    script.src = "https://res2.wx.qq.com/open/js/jweixin-1.6.0.js"; // 微信JS-SDK地址
    script.onload = function () {
      wx = rawWindow.wx;
      if (getOS() === "iOS") {
        // iOS环境下，需要先调用一次，否则微信分享可能不生效，虽然后面调用updateWechatShare会失败，但不影响分享。
        updateWechatShare(
          "",
          {
            title: "节点分享", // 分享标题
            desc: "", // 分享描述
            imgUrl: "", // 分享图标
          },
          {
            title: "节点分享", // 分享标题
            imgUrl: "", // 分享图标
          }
        );
      }
    };
    script.onerror = function () {
      wx = null;
    };
    document.body.appendChild(script);
  }
}
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
export function getWechatShareURL(name: string, url: string | null) {
  const nodename = getNodeName();
  const shareUrl = `https://share.${baseInfo.HOST}/`;
  let searchDefault = rawWindow.location.search;
  if (url && isValidUrl(url)) {
    searchDefault = new URL(url).search;
  }
  const search = searchDefault
    ? `${searchDefault}&nodename=${nodename}`
    : `?nodename=${nodename}`;
  return shareUrl + search;
}
// 使用loadWeChatJSSDK函数，并在回调中进行wx.config等操作
export function updateWechatShare(
  name: string,
  appMessageShareData: {
    title: string; // 分享标题
    desc: string; // 分享描述
    imgUrl: string; // 分享图标
    success?: () => void;
  },
  timelineShareData: {
    title: string; // 分享标题
    imgUrl: string; // 分享图标
    success?: () => void;
  },
  rawURL: string = firstUrl
) {
  return new Promise((resolve, reject) => {
    if (!isWeChatOrQQ()) {
      reject("非微信QQ环境");
    }
    function wxInit(url: string = rawLocation.href) {
      // alert(url);
      // alert(getOS());
      // if (getOS() === "iOS") {
      //   url = rawURL;
      // }
      getWechatShare(url).then((res: any) => {
        if (res.data.errCode == 0) {
          const data = res.data.data;
          wx.config({
            debug: false, // baseInfo.ENV === "prod" ? false : true, // 开启调试模式
            appId: "wx5179c4b6bbe0cc55",
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"],
          });
          wx.error(function (res: any) {
              setTimeout(() => {
                wxInit(rawURL);
              }, 50);
            reject(res);
          });
          wx.ready(function () {
            if (appMessageShareData) {
              const data = {
                ...appMessageShareData,
                link: url,
              };
              data.imgUrl =
                data.imgUrl ||
                `https://static.${baseInfo.HOST}/static/default_cover.png`;
              wx.updateAppMessageShareData(data);
            }
            if (timelineShareData) {
              const data = {
                ...timelineShareData,
                link: url,
              };
              data.imgUrl =
                data.imgUrl ||
                `https://static.${baseInfo.HOST}/static/default_cover.png`;
              wx.updateTimelineShareData(data);
            }
            resolve("微信QQ分享配置已执行，可检查success 回调");
          });
        } else {
          reject(res.data.msg);
        }
      });
    }
    if (!wx) {
      setTimeout(() => {
        if (!wx) {
          reject("微信sdk加载失败");
        } else {
          wxInit();
        }
      }, 1000);
      return;
    }
    wxInit();
  });
}

export function getShareUrl(
  name: string,
  options: {
    exhibitId: string;
    itemId?: string;
    query: {
      [key: string]: string;
    };
  },
  type: string
) {
  let exhibitId = "";
  let itemId = "";
  if (typeof options == "object") {
    exhibitId = options.exhibitId;
    itemId = options.itemId || "";
  } else {
    exhibitId = options as string;
  }
  let search = "";
  const devData = dev();
  const params = { ...devData.params };
  if (devData.type !== DEV_FALSE) {
    search = rawWindow.location.search;
    widgetsConfig.forEach((element) => {
      search = search.replace(
        "&" + element.name + "=" + encodeURIComponent(params[element.name]),
        ""
      );
    });
  }
  if (search) {
    search = "/" + search;
  }
  if (typeof options.query == "object") {
    let search2 = "";
    Object.keys(options.query).forEach((key) => {
      search2 += "&" + key + "=" + encodeURIComponent(options.query[key]);
    });
    if (search) {
      search = search + search2;
    } else {
      search = search2.replace(/^&/, "");
      if (search) {
        search = "/?" + search;
      }
    }
  }

  if (itemId) {
    return `${rawLocation.origin}/${exhibitId}/${itemId}/${type}${search}`;
  }
  return `${rawLocation.origin}/${exhibitId}/${type}${search}`;
}

// 只有在vue路由之前使用才有效, 但这种十分不合理，不应该在运行时来做
export async function mapShareUrl(name: string, routeMap: any) {
  return new Promise((resolve, reject) => {
    const control = flatternWidgets.get(name);
    // @ts-ignore
    const theme = widgetsConfig.get(name);
    // if (!theme.isTheme) {
    //   console.error("mapShareUrl ", "只能主题使用");
    // }
    theme[FREELOG_ROUTE_MAPS] = routeMap || {};
    const href = rawLocation?.href;
    const data = isShareUrl(href);
    if (data && href) {
      const func = routeMap ? routeMap[data.type] : null;
      const urlObj = new URL(href);
      const query: any = {};
      const devKeys: any = {};
      for (const [key, value] of urlObj.searchParams.entries()) {
        if (key === "dev" || key === "replace" || key === theme.name) {
          if (key != theme.name) devKeys[key] = value;
        } else {
          query[key] = decodeURIComponent(value);
        }
      }
      let route = "";
      if (func) {
        route = func(data.exhibitId, data.itemId, query);
        let search = "?";
        Object.keys(devKeys).forEach((key) => {
          search = search + `${key}=${devKeys[key]}`;
        });
        search =
          search.length > 1
            ? search + `&${theme.name + "=" + freelogApp.router.encode(route)}`
            : search + `${theme.name + "=" + freelogApp.router.encode(route)}`;
        rawWindow.history.replaceState(
          {},
          "",
          `${rawWindow.location.origin}${search}`
        );
        rawWindow.location.reload();
        // console.log(control)
        // control?.reload();
        // resolve(true);
        // setTimeout(() => {
        //   freelogApp.router.replace({
        //     name: theme.name,
        //     path: route,
        //     replace: true,
        //   });
        //   setTimeout(() => {
        //     resolve(true);
        //   }, 222);
        // }, 0);
      } else {
        resolve(true);
      }
    } else {
      resolve(true);
    }
  });
}
// const urlTest = /^\/?.{24}\/(\w{1,})\/?$/;
const urlTest = /^\/?.{24}(?:\/.{24})?\/(\w+)(?:\/|$)/;
export function isShareUrl(url: string) {
  const urlObj = new URL(url);
  let urltrim = url.replace(urlObj.search, "").replace(urlObj.origin, "");
  if (urlTest.test(urltrim)) {
    urltrim = urltrim.indexOf("/") === 0 ? urltrim.replace("/", "") : urltrim;
    const exhibitId = urltrim.split("/")[0];
    if (urltrim.split("/")[2]) {
      const itemId = urltrim.split("/")[1];
      const type = urltrim.split("/")[2];
      return {
        exhibitId,
        itemId,
        type,
      };
    } else {
      const type = urltrim.split("/")[1];
      return {
        exhibitId,
        type,
      };
    }
  }
  return false;
}
