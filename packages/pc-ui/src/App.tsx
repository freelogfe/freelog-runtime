/* eslint-disable @typescript-eslint/ban-ts-comment */
import "./App.scss";
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from "@ant-design/cssinjs";
import { App as AppAnt } from "antd";
import microApp from "@micro-zoe/micro-app";
/**
 * 登录不考虑授权UI是否在，登录之后调插件的回调。
 *
 */
import { useEffect, useState } from "react";
import Login from "./views/login";

import NodeError from "./views/_statusComponents/nodeError";
import ThemeCancel from "./views/_statusComponents/themeCancel";
import OutOf from "./views/outOf";
import {
  freelogAuth,
  freelogApp,
  init,
  getInfoByNameOrDomain,
} from "freelog-runtime-core";
const isTest = window.isTest;

const {
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
  THEME_FREEZED,
  LOGIN,
  CONTRACT,
  LOGIN_OUT,
  USER_FREEZED,
  NODE_OFFLINE,
  NODE_PRIVATE,
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
  function loadingClose() {
    setTimeout(() => {
      const loadingContainer = document.getElementById("runtime-loading");
      loadingContainer ? (loadingContainer.style.display = "none") : "";
    }, 0);
  }
  useEffect(() => {
    const nodeDomain = getDomain(window.location.host);
    // nodeDomain = getDomain("fl-reading.freelog.com");
    Promise.all([requestNodeInfo(nodeDomain), freelogAuth.getUserInfo()]).then(
      async (values: any) => {
        const nodeData = values[0];
        if (!nodeData.data) {
          confirm("节点网址不正确，请检查网址！");
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
          // nodeSuspendInfo,
        } = nodeInfo;

        freelogApp.nodeInfo = {
          nodeName,
          tags,
          nodeLogo,
          nodeTitle,
          nodeShortDescription,
          // nodeSuspendInfo,
        };
        freelogAuth.nodeInfo = nodeData.data;
        document.title = nodeInfo.nodeTitle
          ? nodeInfo.nodeTitle
          : nodeInfo.nodeName;
        if (isTest) {
          document.title = "[T]" + document.title;
        }
        init(nodeInfo.nodeId);
        const entry =
          freelogAuth.devData.type == 3
            ? freelogAuth.devData.params["auth"]
            : "";
        await microApp.renderApp({
          "router-mode": "pure",
          name: "freelog-pc-common-auth",
          url: entry
            ? entry
            : window.location.host.includes("testfreelog.com")
            ? "https://authorization-processor.testfreelog.com/"
            : "https://authorization-processor.freelog.com/", // "https://runtime-test-pc.oss-cn-shenzhen.aliyuncs.com/ui", // "https://localhost:8006",//"https://localhost:8402/",
          container: document.getElementById(
            "freelog-pc-common-auth"
          ) as HTMLElement,
        });
        Object.freeze(freelogApp.nodeInfo);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        freelogApp.status.authUIMounted = true;
        setOutData(nodeInfo);
        // 节点冻结
        if (
          (nodeInfo.status & 5) === 5 ||
          (nodeInfo.status & 6) === 6 ||
          (nodeInfo.status & 12) === 12
        ) {
          UI(NODE_FREEZED, nodeInfo);
          return;
        }
        // 节点下线
        if ((nodeInfo.status & 8) === 8) {
          UI(NODE_OFFLINE, nodeInfo);
          return;
        }
        // 私密节点
        if (
          (nodeInfo.status & 2) === 2 &&
          nodeInfo.ownerUserId !== userInfo?.userId
        ) {
          UI(NODE_PRIVATE, nodeInfo);
          return;
        }
        // 用户冻结
        if (userInfo && userInfo.status == 1) {
          UI(USER_FREEZED, userInfo);
          return;
        }
        // 没有主题
        if (
          (!nodeInfo.nodeThemeId && !isTest) ||
          (!nodeInfo.nodeTestThemeId && isTest)
        ) {
          UI(THEME_NONE, nodeInfo);
          return;
        }
        nodeInfo.themeAuthInfo.isAvailable = !(
          (nodeInfo.themeAuthInfo.defaulterIdentityType & 1) == 1 ||
          (nodeInfo.themeAuthInfo.defaulterIdentityType & 2) == 2
        );
        setNodeInfo(nodeInfo);
        if (!nodeInfo.themeAuthInfo.isAuth) {
          if (!nodeInfo.themeAuthInfo.isAvailable) {
            upperUI();
          } else {
            freelogApp
              .addAuth(null, nodeInfo.themeInfo.exhibitId, {
                immediate: true,
              })
              .then((res: any) => {
                if (res.status != SUCCESS) {
                  upperUI();
                }
              });
          }
        } else {
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
              iframe:
                nodeInfo.themeInfo.versionInfo.exhibitProperty.bundleTool ===
                "vite"
                  ? true
                  : false,
            },
          });
        }
      }
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
      setUserInfo(data);
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
      callLoginCallback.spice(0, callLoginCallback.length);
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
      case NODE_FREEZED:
        outOfContent(data);
        break;
      case THEME_NONE:
        outOfContent(data);
        break;
      case USER_FREEZED:
        outOfContent(data);
        break;
      case THEME_FREEZED:
        outOfContent(data);
        break;
      case NODE_OFFLINE:
        outOfContent(data);
        break;
      case NODE_PRIVATE:
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
                currentExhibit={themeAuthInfo}
                setThemeCancel={openAuthForTheme}
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

function getDomain(url: string) {
  if (url.split(".")[0] === "t") {
    return url.split(".")[1];
  }
  return url.split(".")[0];
}
