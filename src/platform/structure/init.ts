import frequest from "../../services/handler";
import node from "../../services/api/modules/node";

import { getSubDep, getUserInfo, isMobile } from "./utils";
import { freelogApp } from "./global";
import { freelogAuth } from "./freelogAuth";
import { init } from "./api";
import { dev, DEV_FALSE } from "./dev";
import { pathATag, initLocation } from "./proxy";
import { mountUI } from "./widget";
import VConsole from 'vconsole';

const mobile = isMobile()
// @ts-ignore
const uiPath = process.env.NODE_ENV === 'development'
  ? mobile
    ? "http://localhost:8881" // "http://ui.mobile.com" 
    : "http://localhost:8880"
  : mobile
  ? "/mobile"
  : "/pc";
let isTest = false;
if (
  window.location.href
    .replace("http://", "")
    .replace("https://", "")
    .indexOf("t.") === 0
) {
  isTest = true;
}
window.ENV = 'freelog.com'
if(window.location.host.includes('.testfreelog.com')){
  window.ENV = 'testfreelog.com'
}
!mobile && document.querySelector.bind(document)('meta[name="viewport"]')?.setAttribute('content', "width=device-width, initial-scale=1.0") 
window.isTest = isTest;
window.freelogApp = freelogApp;
window.freelogAuth = freelogAuth;
 
export function initNode() {
  pathATag()
  return new Promise<void>(async (resolve) => {
    let nodeDomain = getDomain(window.location.host);
    Promise.all([requestNodeInfo(nodeDomain), getUserInfo()]).then(
      async (values) => {
        let nodeData = values[0];
        if(!nodeData.data){
          confirm("节点网址不正确，请检查网址！")
          return
        }
        const userInfo = values[1];
        const nodeInfo = nodeData.data;
        freelogApp.nodeInfo = nodeInfo;
        if((!nodeInfo.nodeThemeId && !isTest) || (!nodeInfo.nodeTestThemeId && isTest)){
          const nothemeTip = document.getElementById.bind(document)("freelog-no-theme") 
          // @ts-ignore
          nothemeTip?.style.display = 'flex';
          // @ts-ignore
          nothemeTip?.style.paddingTop = mobile? '26vh' : '32vh';
          resolve()
          return
        }
        document.title = nodeInfo.nodeName;
        if(!userInfo && isTest){
          confirm("测试节点必须登录！")
          return
        }
        if(userInfo && userInfo.userId !== nodeInfo.ownerUserId && isTest){
          confirm("测试节点只允许节点拥有者访问！")
          return
        }
        Object.defineProperty(document, 'title', {
          set(msg) {
          },
          get() {
            return document.title;
          },
        });
        init();
        const devData = dev()
        if(devData.type !== DEV_FALSE && devData.config.vconsole){
          window.vconsole = new VConsole()
        }
        Object.freeze(devData);
        freelogApp.devData = devData;
        Object.freeze(freelogApp);
        Object.freeze(freelogApp.nodeInfo);
        initLocation();
        const container = document.getElementById.bind(document)("freelog-plugin-container");
        mountUI("freelog-ui", document.getElementById.bind(document)("ui-root"), uiPath, {
          shadowDom: false,
          scopedCss: true,
        }).mountPromise.then(async () => {
          const theme = await getSubDep(window.isTest? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId);
          freelogApp.mountWidget(
            theme,
            container,
            "",
            { shadowDom: false, scopedCss: true, ...theme.exhibitProperty },
            null,
            true
          );
          resolve && resolve()
        },(e: any)=>{
          console.log(e)
        });
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
    { nodeDomain }
  );
  return info.data;
}
