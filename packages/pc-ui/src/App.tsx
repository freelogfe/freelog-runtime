/* eslint-disable @typescript-eslint/ban-ts-comment */
import "./App.scss";
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from "@ant-design/cssinjs";
import { App as AppAnt } from "antd";
import microApp from "@micro-zoe/micro-app";
import { FreelogLibrary, getNodeName } from "freelog-runtime-core";
/**
 * 登录不考虑授权UI是否在，登录之后调插件的回调。
 *
 */
import { useEffect, useRef, useState } from "react";
import Login from "./views/login";

import NodeError from "./views/_statusComponents/nodeError";
import ThemeCancel from "./views/_statusComponents/themeCancel";
import OutOf from "./views/outOf";
import FI18n from "@/I18nNext";
import {
  freelogAuth,
  freelogApp,
  init,
  getInfoByNameOrDomain,
  urls,
} from "freelog-runtime-core";

const {
  bindName,
  registerUI,
  endEvent,
  updateLock,
  updateEvent,
  clearEvent,
  lowerUI,
  upperUI,
  reload,
  callLoginCallback,
} = freelogAuth;
const { SUCCESS, USER_CANCEL } = freelogAuth.resultType;
const {
  NODE_FREEZED,
  THEME_NONE,
  NODE_NONE,
  THEME_ERROR,
  LOGIN,
  CONTRACT,
  LOGIN_OUT,
  USER_FREEZED,
  NODE_OFFLINE,
  NODE_PRIVATE,
  NODE_DELETED,
} = freelogAuth.eventType;

function App() {
  const [events, setEvents] = useState([]);
  const [eventType, setEventType] = useState("");
  const [isOut, setIsOut] = useState(false);
  const [outData, setOutData] = useState<any>(null);
  const [isLoginFromAuth, setIsLoginFromAuth] = useState(false);

  const [isLogin, setIsLogin] = useState(false);
  const [nodeInfoData, setNodeInfo] = useState<any>(null);
  const [themeAuthInfo, setThemeAuthInfo] = useState<any>(null);
  /** 与 microApp 下发 authProcessorShow 是否展示授权 UI 一致，仅 true 时 popstate 再同步为 false，避免重复 setData */
  const authProcessorShowByMainRef = useRef(false);
  function loadingClose() {
    setTimeout(() => {
      const loadingContainer = document.getElementById("runtime-loading");
      loadingContainer ? (loadingContainer.style.display = "none") : "";
    }, 0);
  }

  // 浏览器前进/后退时同步子应用「授权处理」为隐藏态（仅当前序已 setData 为 true 时执行，避免无展示仍反复 setData）
  useEffect(() => {
    const onPopState = () => {
      if (!authProcessorShowByMainRef.current) return;
      authProcessorShowByMainRef.current = false;
      microApp.setData("freelog-pc-common-auth", {
        authProcessorShow: false,
        mainAppType: "exhibitInRuntime", // exhibitInRuntime, 表示"授权处理在运行时"的场景
      });
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    document.title = FI18n.i18nNext.t("noderuntime_nodeloading_tabtitle");
    const nodeDomain = getNodeName();
    Promise.all([requestNodeInfo(nodeDomain), freelogAuth.getUserInfo()]).then(
      async (values: any) => {
        const nodeData = values[0];
        if (!nodeData.data) {
          UI(NODE_NONE, null);
          return;
        }
        const userInfo = values[1];
        const nodeInfo = nodeData.data;
        const {
          nodeName,
          tags,
          nodeLogo,
          nodeTitle,
          nodeShortDescription,
          ownerUserName,
          ownerUserId,
          // nodeSuspendInfo,
        } = nodeInfo;

        freelogApp.nodeInfo = {
          nodeName,
          tags,
          nodeLogo,
          nodeTitle,
          nodeShortDescription,
          ownerUserName,
          ownerUserId,
          // nodeSuspendInfo,
        };
        freelogAuth.nodeInfo = nodeData.data;
        const isOwner = ownerUserId === userInfo?.userId;
        setUserInfo(userInfo, isOwner);
        document.title = nodeInfo.nodeTitle
          ? nodeInfo.nodeTitle
          : nodeInfo.nodeName;

        init(nodeInfo.nodeId);
        const entry =
          freelogAuth.devData.type == 3
            ? freelogAuth.devData.params["auth"]
            : "";
        await microApp.renderApp({
          "router-mode": "pure",
          name: "freelog-pc-common-auth",
          data: { freelogApp: bindName("freelog-pc-common-auth") },
          url: entry || urls.authProcessor,
          container: document.getElementById(
            "freelog-pc-common-auth",
          ) as HTMLElement,
        });
        Object.freeze(freelogApp.nodeInfo);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        freelogApp.status.authUIMounted = true;
        setOutData(nodeInfo);
        // 1:公开 2:私密 4:冻结 8:暂停 -1:删除
        // 节点删除
        if (nodeInfo.status == -1) {
          UI(NODE_DELETED, nodeInfo);
          return;
        }
        // 节点冻结
        if (nodeInfo.status == 4) {
          UI(NODE_FREEZED, nodeInfo);
          return;
        }
        // 节点暂停
        if (nodeInfo.status == 8) {
          UI(NODE_OFFLINE, nodeInfo);
          return;
        }
        // 私密节点
        if (nodeInfo.status == 2 && nodeInfo.ownerUserId !== userInfo?.userId) {
          UI(NODE_PRIVATE, nodeInfo);
          return;
        }
        // 用户冻结
        if (userInfo && userInfo.status == 1) {
          UI(USER_FREEZED, userInfo);
          return;
        }
        // 没有主题
        if (!nodeInfo.nodeThemeId) {
          UI(THEME_NONE, nodeInfo);
          return;
        }
        nodeInfo.themeAuthInfo.isAvailable = !(
          (nodeInfo.themeAuthInfo.defaulterIdentityType & 1) == 1 ||
          (nodeInfo.themeAuthInfo.defaulterIdentityType & 2) == 2
        );
        setNodeInfo(nodeInfo);
        if (freelogApp.isWeChatOrQQ()) {
          freelogApp.updateWechatShare(
            null,
            {
              title: nodeInfo.nodeTitle, // 分享标题
              desc: nodeInfo.nodeShortDescription, // 分享描述
              imgUrl:
                nodeInfo.nodeLogo ||
                nodeInfo.themeInfo.versionInfo.exhibitProperty
                  .options_logoImage, // 分享图标
            },
            {
              title: nodeInfo.nodeTitle, // 分享标题
              imgUrl:
                nodeInfo.nodeLogo ||
                nodeInfo.themeInfo.versionInfo.exhibitProperty
                  .options_logoImage, // 分享图标
            },
          );
        }
        if (!nodeInfo.themeAuthInfo.isAuth) {
          if (!nodeInfo.themeAuthInfo.isAvailable) {
            // 主题异常
            UI(THEME_ERROR, nodeInfo);
            return;
          } else {
            freelogApp
              .addAuth(null, nodeInfo.themeInfo.exhibitId, {
                immediate: true,
              })
              .then((res: any) => {
                if (res.status != SUCCESS) {
                  upperUI();
                } else {
                  window.location.reload();
                }
              });
          }
        } else {
          // 初始化软件库实例
          const instance = new FreelogLibrary();

          (window as any).FreelogLibrary = instance;

          const container = document.getElementById("freelog-plugin-container");
          await freelogApp.mountExhibitWidget(null, {
            widget: nodeInfo.themeInfo,
            container,
            property: nodeInfo.themeInfo.versionInfo.exhibitProperty,
            dependencyTree: nodeInfo.themeInfo.versionInfo.dependencyTree,
            exhibitId: nodeInfo.themeInfo.exhibitId,
            renderWidgetOptions: {
              lifeCycles: {
                beforemount: () => {
                  loadingClose();
                },
                mounted: () => {
                  freelogApp.status.themeMounted = true;
                },
              },
              data: { themeInfo: nodeInfo.themeInfo },
              iframe:
                nodeInfo.themeInfo.versionInfo.exhibitProperty.bundleTool ===
                "vite"
                  ? true
                  : false,
            },
          });
        }
      },
    );
  }, []);
  const openAuthForTheme = () => {
    freelogApp
      .addAuth(null, nodeInfoData.themeInfo.exhibitId, {
        immediate: true,
      })
      .then((res: any) => {
        if (res.status != SUCCESS) {
          upperUI();
        } else {
          window.location.reload();
        }
      });
  };
  useEffect(() => {
    updateLock(false);
  }, [events]);
  let callBack: any[] = [];
  const { loginCallback, setUserInfo, loginErrorCallback } = freelogAuth;

  function loginFinished(type: any, data?: any) {
    setIsLogin(false);
    if (type === SUCCESS) {
      const isOwner = nodeInfoData.ownerUserId === data?.userId;
      setUserInfo(data, isOwner);
      if (loginCallback.length === 0 && callLoginCallback.length == 0) {
        reload();
      }
      loginCallback.forEach((func: any) => {
        func && func();
      });
      clearEvent();
    } else if (type === USER_CANCEL) {
      if (callBack.length) {
        callBack.forEach((item: any) => {
          item && item(USER_CANCEL);
        });
      }
      loginErrorCallback.forEach((func: any) => {
        func && func();
      });
      if (isLoginFromAuth) {
        lowerUI(true);
      } else {
        lowerUI();
      }
      callBack = [];
    }
    if (callLoginCallback.length) {
      callLoginCallback.forEach((item: any) => {
        item && item(type);
      });
      callLoginCallback.splice(0, callLoginCallback.length);
    }
  }

  // 遍历顺序是否永远一致
  function updateEvents(event?: any) {
    const eventMap = updateEvent(event);
    updateLock(true);
    const arr: any = [];
    eventMap.forEach((val: any) => {
      arr.push(val);
    });
    setEvents(arr);
    if (!arr.length) {
      authProcessorShowByMainRef.current = false;
      microApp.setData("freelog-pc-common-auth", {
        authProcessorShow: false,
        mainAppType: "exhibitInRuntime", // exhibitInRuntime, 表示"授权处理在运行时"的场景
      });
      lowerUI();
    } else {
      arr.forEach(async (item: any) => {
        if (item.isTheme) {
          setThemeAuthInfo(item);
        }
        const waiting = () => {
          return new Promise((resolve) => {
            upperUI(true);
            authProcessorShowByMainRef.current = true;
            microApp.setData("freelog-pc-common-auth", {
              authProcessorShow: true,
              mainAppType: "exhibitInRuntime", // exhibitInRuntime, 表示"授权处理在运行时"的场景
              mainAppFuncs: {
                contracted: (eventId: string, type: number, data: any) => {
                  endEvent(eventId, type, data);
                  resolve && resolve(null);
                },
                login: (func: any) => {
                  callBack.push(func);
                  setEventType(LOGIN);
                  setIsLoginFromAuth(true);
                  login();
                },
              },
              nodeId: freelogAuth.nodeInfo.nodeId,
              licensorId: item.eventId,
            });
          });
        };
        await waiting();
      });
    }
  }
  function UI(type: any, data: any) {
    setIsLoginFromAuth(false);
    loadingClose();
    setIsOut(false);
    setEventType(type);
    switch (type) {
      case NODE_DELETED:
        outOfContent(data);
        break;
      case NODE_FREEZED:
        outOfContent(data);
        break;
      case THEME_NONE:
        outOfContent(data);
        break;
      case USER_FREEZED:
        outOfContent(data);
        break;
      case THEME_ERROR:
        outOfContent(data);
        break;
      case NODE_OFFLINE:
        outOfContent(data);
        break;
      case NODE_PRIVATE:
        outOfContent(data);
        break;
      case NODE_NONE:
        outOfContent(data);
        break;
      case LOGIN:
        login();
        break;
      case CONTRACT:
        updateEvents();
        break;
      case LOGIN_OUT:
        longinOut();
        break;
      default:
        updateEvents();
    }
  }
  function outOfContent(data: any) {
    setOutData(data);
    setIsOut(true);
    upperUI();
  }
  function updateUI() {
    updateEvents();
  }
  function login() {
    upperUI();
    setIsLogin(true);
  }

  async function longinOut() {
    upperUI();
    await freelogAuth.loginOut().then((res: any) => {
      if (res.data.errCode === 0) {
        reload();
      }
    });
    lowerUI();
  }
  registerUI(UI, updateUI);

  return (
    <StyleProvider
      hashPriority="high"
      transformers={[legacyLogicalPropertiesTransformer]}
    >
      <AppAnt>
        <div id="freelog-pc-auth" className="w-100x h-100x over-h">
          {isOut ? (
            <OutOf eventType={eventType} outData={outData}></OutOf>
          ) : isLogin ? (
            <div className="runtime-pc bg-white" id="runtime-pc">
              <Login loginFinished={loginFinished}></Login>
            </div>
          ) : nodeInfoData &&
            themeAuthInfo &&
            !nodeInfoData.themeAuthInfo.isAuth ? (
            // @ts-ignore
            (nodeInfoData.themeAuthInfo.defaulterIdentityType & 1) == 1 ||
            // @ts-ignore
            (nodeInfoData.themeAuthInfo.defaulterIdentityType & 2) == 2 ? (
              <NodeError
              // currentExhibit={themeAuthInfo}
              // setThemeCancel={openAuthForTheme}
              />
            ) : (
              <ThemeCancel
                currentExhibit={themeAuthInfo}
                setThemeCancel={openAuthForTheme}
              />
            )
          ) : null}
        </div>
      </AppAnt>
    </StyleProvider>
  );
}

export default App;
async function requestNodeInfo(nodeDomain: string) {
  const info = await getInfoByNameOrDomain.bind({ name: "node" })({
    nodeDomain,
    isLoadOwnerUserInfo: 1,
    isLoadThemeAuthAndDependency: 1,
  });
  return info.data;
}

// function getDomain(url: string) {
//   if (url.split(".")[0] === "t") {
//     return url.split(".")[1];
//   }
//   return url.split(".")[0];
// }
