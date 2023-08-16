import frequest from "../../services/handler";
import node from "../../services/api/modules/node";

import { getSubDep, getUserInfo, isMobile } from "./utils";
import { freelogApp } from "./global";
import { freelogAuth } from "./freelogAuth";
import { init } from "./api";
import { dev, DEV_FALSE } from "./dev";
import { pathATag, initLocation } from "./proxy";
import { mountUI } from "./widget";
// import VConsole from "vconsole";
import { callUI } from "../../bridge/index";
import {
  NODE_FREEZED,
  NODE_OFFLINE,
  THEME_NONE,
  NODE_PRIVATE,
  USER_FREEZED,
} from "../../bridge/eventType";
import { initWindowListener } from "../../bridge/eventOn";
// @ts-ignore
delete window.setImmediate;
const mobile = isMobile();
// @ts-ignore
const uiPath =
  process.env.NODE_ENV === "development"
    ? mobile
      ? "http://localhost:8881" // "http://ui.mobile.com"
      : "http://localhost:8880"
    : mobile
    ? "/mobile"
    : "/pc";
window.ENV = "freelog.com";
if (window.location.host.includes(".testfreelog.com")) {
  window.ENV = "testfreelog.com";
}
const rawDocument = document;
// !mobile &&
//   document.querySelector
//     .bind(document)('meta[name="viewport"]')
//     ?.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
window.freelogApp = freelogApp;
window.freelogAuth = freelogAuth;

export function initNode() {
  // TODO 这个位置问题需要可考虑，最好放到UI插件之后
  initWindowListener();
  pathATag();
  return new Promise<void>(async (resolve) => {
    let nodeDomain = getDomain(window.location.host);
    Promise.all([requestNodeInfo(nodeDomain), getUserInfo()]).then(
      async (values) => {
        let nodeData = values[0];
        if (!nodeData.data) {
          confirm("节点网址不正确，请检查网址！");
          return;
        }
        const userInfo = values[1];
        const nodeInfo = nodeData.data;
        freelogApp.nodeInfo = nodeInfo;
        // if (
        //   (!nodeInfo.nodeThemeId && !window.isTest) ||
        //   (!nodeInfo.nodeTestThemeId && window.isTest)
        // ) {
        //   const nothemeTip =
        //     document.getElementById.bind(document)("freelog-no-theme");
        //   // @ts-ignore
        //   nothemeTip?.style.display = "flex";
        //   // @ts-ignore
        //   nothemeTip?.style.paddingTop = mobile ? "26vh" : "32vh";
        //   resolve();
        //   return;
        // }
        document.title = nodeInfo.nodeName;
        if (window.isTest) {
          document.title = "[T]" + nodeInfo.nodeName;
        }
        if (!userInfo && window.isTest) {
          confirm("测试节点必须登录！");
          return;
        }
        if (
          userInfo &&
          userInfo.userId !== nodeInfo.ownerUserId &&
          window.isTest
        ) {
          confirm("测试节点只允许节点拥有者访问！");
          return;
        }
        // TODO 打开就无法微信分享，不打开就无法阻止插件修改
        // Object.defineProperty(document, "title", {
        //   set(msg) {},
        //   get() {
        //     return document.title;
        //   },
        // });
        init();
        const devData = dev();
        // TODO 提供一个开发者模式，能在全局创建一个VConsole
        // window.vconsole = new VConsole()
        // if (devData.type !== DEV_FALSE && devData.config.vconsole) {
        //   window.vconsole = new VConsole();
        // }
        if (devData.type !== DEV_FALSE && mobile) {
          var script = document.createElement("script");
          script.src = "https://unpkg.com/vconsole@latest/dist/vconsole.min.js";
          document.head.appendChild(script);
          script.onload = () => {
            // @ts-ignore
            window.vconsole = new window.VConsole();
          };
        }
        Object.freeze(devData);
        freelogApp.devData = devData;
        Object.freeze(freelogApp);
        Object.freeze(freelogApp.nodeInfo);
        initLocation();
        const container = document.getElementById.bind(rawDocument)(
          "freelog-plugin-container"
        );
        const loadingContainer =
          document.getElementById.bind(rawDocument)("runtime-loading");
        const mountTheme = new Promise(async (themeResolve) => {
          // 节点冻结
          if ((nodeInfo.status & 4) === 4) {
            themeResolve(false);
            return;
          }
          // 用户冻结
          if (userInfo && userInfo.status == 1) {
            themeResolve(false);
            return;
          }
          // 没有主题
          if (
            (!nodeInfo.nodeThemeId && !window.isTest) ||
            (!nodeInfo.nodeTestThemeId && window.isTest)
          ) {
            themeResolve(false);
            return;
          }
          // const availableData = await getExhibitAvailalbe(
          //   window.isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId
          // );
          // 主题冻结
          // if (availableData && availableData.authCode === 403) {
          //   resolve && resolve();
          //   return;
          // }
          const theme = await getSubDep(
            window.isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId
          );
          // @ts-ignore
          loadingContainer.style.display = "none";
          const themeApp = await freelogApp.mountWidget(
            theme,
            container,
            "",
            { shadowDom: false, scopedCss: true, ...theme.exhibitProperty },
            null,
            true
          );
          themeApp.mountPromise.then(() => {
            themeResolve(true);
          });
        });
        mountTheme.then((flag) => {
          freelogApp.status.themeMounted = flag;
        });
        mountUI(
          "freelog-ui",
          document.getElementById.bind(rawDocument)("ui-root"),
          uiPath,
          {
            shadowDom: false,
            scopedCss: true,
          }
        ).mountPromise.then(
          async () => {
            // @ts-ignore
            loadingContainer.style.display = "none";
            freelogApp.status.authUIMounted = true;
            // 节点冻结
            if (
              (nodeInfo.status & 5) === 5 ||
              (nodeInfo.status & 6) === 6 ||
              (nodeInfo.status & 12) === 12
            ) {
              resolve && resolve();
              setTimeout(() => callUI(NODE_FREEZED, nodeInfo), 10);
              return;
            }
            // 节点下线
            if ((nodeInfo.status & 8) === 8) {
              resolve && resolve();
              setTimeout(() => callUI(NODE_OFFLINE, nodeInfo), 10);
              return;
            }
            // 私密节点
            if (
              (nodeInfo.status & 2) === 2 &&
              nodeInfo.ownerUserId !== userInfo?.userId
            ) {
              resolve && resolve();
              setTimeout(() => callUI(NODE_PRIVATE, nodeInfo), 10);
              return;
            }
            // 用户冻结
            if (userInfo && userInfo.status == 1) {
              resolve && resolve();
              setTimeout(() => callUI(USER_FREEZED, userInfo), 10);
              return;
            }
            // 没有主题
            if (
              (!nodeInfo.nodeThemeId && !window.isTest) ||
              (!nodeInfo.nodeTestThemeId && window.isTest)
            ) {
              resolve && resolve();
              setTimeout(() => callUI(THEME_NONE, nodeInfo), 10);
              return;
            }
            // const availableData = await getExhibitAvailalbe(
            //   window.isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId
            // );
            // // 主题冻结
            // if (availableData && availableData.authCode === 403) {
            //   resolve && resolve();
            //   return;
            // }
            // const theme = await getSubDep(
            //   window.isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId
            // );
            // freelogApp.mountWidget(
            //   theme,
            //   container,
            //   "",
            //   { shadowDom: false, scopedCss: true, ...theme.exhibitProperty },
            //   null,
            //   true
            // );
            resolve && resolve();
          },
          (e: any) => {
            console.error(e);
          }
        );
      }
    );
  });
}

function getDomain(url: string) {
  if (url.split(".")[0] === "t") {
    return url.split(".")[1];
  }
  return url.split(".")[0];
}

async function requestNodeInfo(nodeDomain: string) {
  let info = await frequest.bind({ name: "node" })(
    node.getInfoByNameOrDomain,
    "",
    { nodeDomain, isLoadOwnerUserInfo: 1 }
  );
  return info.data;
}
