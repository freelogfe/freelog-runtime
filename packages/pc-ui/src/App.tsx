/* eslint-disable @typescript-eslint/ban-ts-comment */
import "./App.scss";
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from "@ant-design/cssinjs";
import { App as AppAnt } from "antd";
import microApp from "@micro-zoe/micro-app";

import { useEffect, useState } from "react";
import Pc from "./views/auth";
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
  const [inited, setInited] = useState(false);
  const [eventType, setEventType] = useState("");
  const [isOut, setIsOut] = useState(false);
  const [outData, setOutData] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(false);
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
            : "https://authorization-processor.testfreelog.com/", // "https://runtime-test-pc.oss-cn-shenzhen.aliyuncs.com/ui", // "https://localhost:8006",//"https://localhost:8402/",
          container: document.getElementById(
            "freelog-pc-common-auth"
          ) as HTMLElement,
          renderWidgetOptions: {
            lifeCycles: {
              beforemount: () => {
                loadingClose();
              },
              mounted: () => {
                freelogApp.status.themeMounted = true;
              },
            },

            // iframe:
            //   nodeInfo.themeInfo.versionInfo.exhibitProperty.bundleTool ===
            //   "vite"
            //     ? true
            //     : false,
          },
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
          upperUI();
          loadingClose();
          setEventType(NODE_FREEZED);
          return;
        }
        // 节点下线
        if ((nodeInfo.status & 8) === 8) {
          upperUI();
          loadingClose();
          setEventType(NODE_OFFLINE);
          return;
        }
        // 私密节点
        if (
          (nodeInfo.status & 2) === 2 &&
          nodeInfo.ownerUserId !== userInfo?.userId
        ) {
          upperUI();
          loadingClose();
          setEventType(NODE_PRIVATE);
          return;
        }
        // 用户冻结
        if (userInfo && userInfo.status == 1) {
          upperUI();
          loadingClose();
          setEventType(USER_FREEZED);
          return;
        }
        // 没有主题
        if (
          (!nodeInfo.nodeThemeId && !isTest) ||
          (!nodeInfo.nodeTestThemeId && isTest)
        ) {
          upperUI();
          loadingClose();
          setEventType(THEME_NONE);
          return;
        }
        if (!nodeInfo.themeAuthInfo.isAuth) {
          freelogApp.addAuth(null, nodeInfo.themeInfo.exhibitId, {
            immediate: true,
          });
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
  useEffect(() => {
    updateLock(false);
  }, [events]);
  let callBack: any[] = [];
  function loginFinished(type: any) {
    setIsLogin(false);
    if (type === SUCCESS) {
      if (callBack.length) {
        window.location.reload();
      }
      setInited(false);
      clearEvent();
    } else if (type === USER_CANCEL && !inited) {
      lowerUI();
      if (callBack.length) {
        callBack.forEach((item: any) => {
          item(USER_CANCEL);
        });
      }
      callBack = [];
    }
  }

  // 遍历顺序是否永远一致
  function updateEvents(event?: any) {
    setInited(false);
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
      setInited(true);
      arr.forEach(async (item: any) => {
        const waiting = () => {
          return new Promise((resolve) => {
            upperUI(true)
            microApp.setData("freelog-pc-common-auth", {
              authProcessorShow: true,
              mainAppType: "exhibitInRuntime", // exhibitInRuntime, 表示"授权处理在运行时"的场景
              mainAppFuncs: {
                contracted: (eventId: string, type: number, data: any) => {
                  console.log(eventId, type, data, 999);
                  endEvent(eventId, type, data);
                  resolve && resolve(null);
                },
                login: (func: any) => {
                  callBack.push(func);
                  setEventType(LOGIN);
                  login();
                },
              },
              nodeId: freelogAuth.nodeInfo.nodeId,
              licensorId: item.eventId,
            });
          });
        };
        await waiting();
        console.log(32233);
      });
    }
  } 
  function UI(type: any, data: any) {
    loadingClose();
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
  
  function contractFinished(eventId: any, type: number, data?: any) {
    if (type === USER_CANCEL && !eventId) {
      setInited(false);
      endEvent(eventId, type, data);
      lowerUI();
      return;
    }
    endEvent(eventId, type, data);
  }

  async function longinOut() {
    upperUI();
    await freelogAuth.loginOut().then((res: any) => {
      if (res.data.errCode === 0) {
        reload();
      }
    });
    lowerUI();
    // Modal.confirm({
    //   title: "确认退出登录？",
    //   icon: <ExclamationCircleOutlined />,
    //   content: "退出后页面会被刷新",
    //   okText: "确认",
    //   cancelText: "取消",
    //   style: {
    //     top: "30%",
    //   },
    //   onOk: async () => {
    //     await frequest(freelogAuth.loginOut, "", "").then((res: any) => {
    //       if (res.data.errCode === 0) {
    //         window.freelogAuth.reload();
    //       }
    //     });
    //   },
    //   onCancel: () => {
    //     lowerUI();
    //   },
    // });
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
          ) : (inited || isLogin) && eventType !== CONTRACT ? (
            <Pc
              events={events}
              isAuths={inited}
              isLogin={isLogin}
              contractFinished={contractFinished}
              updateEvents={updateEvents}
              loginFinished={loginFinished}
            ></Pc>
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
