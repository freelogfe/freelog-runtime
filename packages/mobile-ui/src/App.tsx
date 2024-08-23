// import logo from './logo.svg';
// @ts-ignore

import "./App.scss";
import "@/assets/mobile/index.scss";
// import "antd-mobile/es/global/global.css"
// import "antd-mobile/es/global/theme-default.css"
import microApp from "@micro-zoe/micro-app";

import { useEffect, useState } from "react";
import Forgot, { LOGIN_PASSWORD, PAY_PASSWORD } from "./views/user/forgot";
import Register from "./views/user/register";
import NodeError from "./views/_statusComponents/nodeError";
const { loginCallback, setUserInfo } = freelogAuth;

// import getBestTopology from "./topology/data";
import ThemeCancel from "./views/_statusComponents/themeCancel";
import {
  freelogAuth,
  freelogApp,
  init,
  getInfoByNameOrDomain,
} from "freelog-runtime-core";
import Login from "./views/user/login";

import OutOf from "./views/outOf";
/**
 * 1.请求节点与用户信息 requestNodeInfo 判断节点网址是否正确
 * 2.判断dev环境，判断是否移动端且需要加载vconsole
 * 3.判断节点与主题情况
 * 4.加载主题
 *     4.1判断主题授权情况，没有授权需要授权UI进行授权操作
 * 5.授权操作：
 *     主题插件加载展品时发现未授权 主动提交给授权UI进行授权操作
 *     可支持单个展品id或多个展品id，支持回调函数
 *     也就是提供：
 *         1.针对单个展品，采用promise函数，可选是否立即弹出授权UI，await后返回状态，，
 *         2.针对单个或多个展品，采用回调函数，可选是否立即弹出授权UI，可以选择多次回调或一次回调，当有一个展品获得授权后（以后看是否支持取消单个展品）
 *           立即回调函数，主题插件就可以即时刷新呈现数据，，当只要一次回调，暂时不考虑只进行一次回调。
 *     授权UI根据提交的展品再次请求是否授权，维持一个待授权的列表
 *     授权成功后
 * 6.登录操作
 */
const isTest = window.isTest;
const {
  registerUI,
  clearEvent,
  endEvent,
  updateLock,
  updateEvent,
  reload,
  lowerUI,
  upperUI,
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
// let themeId = "";

function App() {
  const [events, setEvents] = useState([]);
  const [eventType, setEventType] = useState("");
  const [isOut, setIsOut] = useState(false);
  const [isLoginFromAuth, setIsLoginFromAuth] = useState(false);
  const [outData, setOutData] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [nodeInfoData, setNodeInfo] = useState<any>(null);
  const [themeAuthInfo, setThemeAuthInfo] = useState<any>(null);
  // 1 登录  2 注册   3 忘记登录密码  4 忘记支付密码
  const [modalType, setModalType] = useState(0);

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
        // window.vconsole = new VConsole()
        // if (devData.type !== DEV_FALSE && devData.config.vconsole) {
        //   window.vconsole = new VConsole();
        // }
        // if (devData.type !== DEV_FALSE) {
        //   const script = document.createElement("script");
        //   script.src = "/vconsole.min.js";
        //   document.head.appendChild(script);
        //   script.onload = () => {
        //     // @ts-ignore
        //     window.vconsole = new window.VConsole();
        //   };
        // }
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
  const [callLoginCallback, setCallLoginCallback] = useState(null as any);

  // 0 成功  1 失败  2 用户取消
  function loginFinished(type: number, data?: any) {
    setIsLogin(false);
    setModalType(0);
    if (type === SUCCESS) {
      setUserInfo(data);
      if (loginCallback.length === 0) {
        reload();
      }
      loginCallback.forEach((func: any) => {
        func && func();
      });
      clearEvent();
    } else if (type === USER_CANCEL) {
      callLoginCallback && callLoginCallback(type);
      if (callBack.length) {
        callBack.forEach((item: any) => {
          item && item(USER_CANCEL);
        });
      }
      if (isLoginFromAuth) {
        lowerUI(true);
      } else {
        lowerUI();
      }
      callBack = [];
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
    console.log(eventMap, arr, event);
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
        setCallLoginCallback(data);
        login();
        break;
      case CONTRACT:
        updateEvents();
        break;
      case LOGIN_OUT:
        setCallLoginCallback(data);
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
    setModalType(1);
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
    <div id="freelog-mobile-auth" className="w-100x h-100x over-h">
      {isOut ? (
        <OutOf eventType={eventType} outData={outData}></OutOf>
      ) : isLogin ? (
        <div id="runtime-mobile" className="w-100x h-100x over-h">
          {modalType === 1 ? (
            <Login
              loginFinished={loginFinished}
              visible={modalType === 1}
              setModalType={setModalType}
            />
          ) : modalType === 2 ? (
            <Register visible={modalType === 2} setModalType={setModalType} />
          ) : modalType === 3 ? (
            <Forgot
              type={LOGIN_PASSWORD}
              visible={modalType === 3}
              setModalType={setModalType}
            />
          ) : modalType === 4 ? (
            <Forgot
              type={PAY_PASSWORD}
              visible={modalType === 4}
              setModalType={setModalType}
            />
          ) : null}
        </div>
      ) : nodeInfoData &&
        themeAuthInfo &&
        !nodeInfoData.themeAuthInfo.isAuth ? (
        !nodeInfoData.themeAuthInfo.isAvailable ? (
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
