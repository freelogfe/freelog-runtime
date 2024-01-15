import { getSubDep, getUserInfo, isMobile } from "./utils";
import { freelogApp } from "./freelogApp";
import { freelogAuth } from "./freelogAuth";
import { init, getInfoByNameOrDomain } from "freelog-runtime-api";
import { setPresentableQueue } from "../bridge";
import { dev, DEV_FALSE } from "./dev";
import { mountUI } from "./widget";
// import VConsole from "vconsole";
import { callUI } from "../bridge/index";
import {
  NODE_FREEZED,
  NODE_OFFLINE,
  THEME_NONE,
  NODE_PRIVATE,
  USER_FREEZED,
} from "../bridge/eventType";
import { baseURL, isTest } from "./base";
import { initWindowListener } from "../bridge/eventOn";
import { bus, setupApp, preloadApp, startApp, destroyApp } from "wujie";

let themeId = "";
export function getThemeId() {
  return themeId;
}
// @ts-ignore
delete window.setImmediate;
const mobile = isMobile();
// @ts-ignore
const uiPath =
  process.env.NODE_ENV === "development"
    ? mobile
      ? "https://localhost:8881" // "http://ui.mobile.com"
      : "https://localhost:8880"
    : mobile
    ? "/mobile"
    : "/pc";
// @ts-ignore
window.ENV = "freelog.com";
if (window.location.host.includes(".testfreelog.com")) {
  // @ts-ignore
  window.ENV = "testfreelog.com";
}
freelogApp.isTest = isTest;
// !mobile &&
//   document.querySelector
//     .bind(document)('meta[name="viewport"]')
//     ?.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
// @ts-ignore
window.freelogApp = freelogApp;
// @ts-ignore
window.freelogAuth = freelogAuth;

export function initNode() {
  return new Promise<void>(async (resolve) => {
    let nodeDomain = getDomain(window.location.host);
    // nodeDomain = getDomain("fl-reading.freelog.com");
    Promise.all([requestNodeInfo(nodeDomain), getUserInfo()]).then(
      async (values: any) => {
        let nodeData = values[0];
        if (!nodeData.data) {
          confirm("节点网址不正确，请检查网址！");
          return;
        }
        const userInfo = values[1];
        const nodeInfo = nodeData.data;
        freelogApp.nodeInfo = nodeInfo;

        document.title = nodeInfo.nodeTitle
          ? nodeInfo.nodeTitle
          : nodeInfo.nodeName;
        if (isTest) {
          document.title = "[T]" + document.title;
        }
        if (!userInfo && isTest) {
          confirm("测试节点必须登录！");
          return;
        }
        if (userInfo && userInfo.userId !== nodeInfo.ownerUserId && isTest) {
          confirm("测试节点只允许节点拥有者访问！");
          return;
        }
        init(nodeInfo.nodeId, setPresentableQueue);
        const devData = dev();
        // window.vconsole = new VConsole()
        // if (devData.type !== DEV_FALSE && devData.config.vconsole) {
        //   window.vconsole = new VConsole();
        // }
        if (devData.type !== DEV_FALSE && mobile) {
          var script = document.createElement("script");
          script.src = "/vconsole.min.js";
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
        const container = document.getElementById("freelog-plugin-container");
        const loadingContainer = document.getElementById("runtime-loading");
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
            (!nodeInfo.nodeThemeId && !isTest) ||
            (!nodeInfo.nodeTestThemeId && isTest)
          ) {
            themeResolve(false);
            return;
          }
          // const availableData = await getExhibitAvailalbe(
          //   isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId
          // );
          // 主题冻结
          // if (availableData && availableData.authCode === 403) {
          //   resolve && resolve();
          //   return;
          // }
          const theme = await getSubDep(
            "",
            isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId
          );
          // @ts-ignore
          loadingContainer.style.display = "none";
          themeId = theme.articleInfo.articleId;
          await freelogApp.mountWidget(null, {
            widget: theme,
            container: container,
            widget_entry: true,
            wujieConfig: {
              loadError: ()=>{
                themeResolve(false)
              },
              beforeLoad: (data:any)=>{
                // console.log(data)
              },
            }
          });
          themeResolve(true);
        });
        mountTheme.then((flag) => {
          freelogApp.status.themeMounted = flag;
        });
        mountUI("freelog-ui", document.getElementById("ui-root"), uiPath).then(
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
              (!nodeInfo.nodeThemeId && !isTest) ||
              (!nodeInfo.nodeTestThemeId && isTest)
            ) {
              resolve && resolve();
              setTimeout(() => callUI(THEME_NONE, nodeInfo), 10);
              return;
            }
            // const availableData = await getExhibitAvailalbe(
            //   isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId
            // );
            // // 主题冻结
            // if (availableData && availableData.authCode === 403) {
            //   resolve && resolve();
            //   return;
            // }
            // const theme = await getSubDep(
            //   isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId
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
  let info = await getInfoByNameOrDomain.bind({ name: "node" })({
    nodeDomain,
    isLoadOwnerUserInfo: 1,
  });
  return info.data;
}
