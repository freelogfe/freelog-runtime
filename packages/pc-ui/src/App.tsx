import "./App.scss";
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from "@ant-design/cssinjs";
import { App as AppAnt } from "antd";

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
        freelogApp.nodeInfo = nodeInfo;

        document.title = nodeInfo.nodeTitle
          ? nodeInfo.nodeTitle
          : nodeInfo.nodeName;
        if (isTest) {
          document.title = "[T]" + document.title;
        }
        init(nodeInfo.nodeId);
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
        const theme = await freelogApp.getSubDep(
          "",
          isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId
        );
        const container = document.getElementById("freelog-plugin-container");
        await freelogApp.mountWidget(null, {
          widget: theme,
          container,
        });
        loadingClose();
        // freelogApp.status.themeMounted = flag;
      }
    );
  }, []);
  useEffect(() => {
    updateLock(false);
  }, [events]);
  function loginFinished(type: any) {
    setIsLogin(false);
    if (type === SUCCESS) {
      setInited(false);
      clearEvent();
    } else if (type === USER_CANCEL && !inited) {
      lowerUI();
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
    console.log();
    setEvents(arr);
    if (!arr.length) {
      lowerUI();
    } else {
      upperUI();
      setInited(true);
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
          ) : inited || isLogin ? (
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
  });
  return info.data;
}

function getDomain(url: string) {
  if (url.split(".")[0] === "t") {
    return url.split(".")[1];
  }
  return url.split(".")[0];
}
