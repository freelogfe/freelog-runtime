// import logo from './logo.svg';
// @ts-ignore
import { Button } from "antd-mobile";

import "./App.scss";
import "@/assets/mobile/index.scss";
// import "antd-mobile/es/global/global.css"
// import "antd-mobile/es/global/theme-default.css"
import { getInfoByNameOrDomain } from "freelog-runtime-api";
import { setPresentableQueue } from "./freelog/bridge";

import { useEffect, useState } from "react";
import Mobile from "./views/auth";
import { freelogAuthApi, init } from "freelog-runtime-api";
import { getSubDep, getUserInfo } from "./freelog/structure/utils";
import { freelogApp } from "./freelog/structure/freelogApp";
import { freelogAuth } from "./freelog/structure/freelogAuth";
import { isTest } from "./freelog/structure/base";

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
const { registerUI, clearEvent, endEvent, updateLock, updateEvent, reload } =
  freelogAuth;
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
  // const [failedEvents, setFailedEvents] = useState([]);
  const [inited, setInited] = useState(false);
  const [eventType, setEventType] = useState(0);
  const [isOut, setIsOut] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [outData, setOutData] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const nodeDomain = getDomain(window.location.host);
    // nodeDomain = getDomain("fl-reading.freelog.com");
    Promise.all([requestNodeInfo(nodeDomain), getUserInfo()]).then(
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
        init(nodeInfo.nodeId, setPresentableQueue);
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

        // @ts-ignore
        freelogApp.status.authUIMounted = true;
        setOutData(nodeInfo);
        // 节点冻结
        if (
          (nodeInfo.status & 5) === 5 ||
          (nodeInfo.status & 6) === 6 ||
          (nodeInfo.status & 12) === 12
        ) {
          setShowUI(true);
          setEventType(NODE_FREEZED);
          return;
        }
        // 节点下线
        if ((nodeInfo.status & 8) === 8) {
          setShowUI(true);
          setEventType(NODE_OFFLINE);
          return;
        }
        // 私密节点
        if (
          (nodeInfo.status & 2) === 2 &&
          nodeInfo.ownerUserId !== userInfo?.userId
        ) {
          setShowUI(true);
          setEventType(NODE_PRIVATE);
          return;
        }
        // 用户冻结
        if (userInfo && userInfo.status == 1) {
          setShowUI(true);
          setEventType(USER_FREEZED);
          return;
        }
        // 没有主题
        if (
          (!nodeInfo.nodeThemeId && !isTest) ||
          (!nodeInfo.nodeTestThemeId && isTest)
        ) {
          setShowUI(true);
          setEventType(THEME_NONE);
          return;
        }
        const theme = await getSubDep(
          "",
          isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId
        );
        const container = document.getElementById("freelog-plugin-container");
        await freelogApp.mountWidget(null, {
          widget: theme,
          widget_entry: true,
          container
        });
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
      setShowUI(false);
    } else if (type === USER_CANCEL && !inited) {
      setShowUI(false);
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
    setEvents(arr);
    if (!arr.length) {
      setShowUI(false);
    } else {
      setShowUI(true);
      setInited(true);
    }
  }
  function UI(type: any, data: any) {
    setEventType(type);
    switch (type) {
      case NODE_FREEZED:
        outOfContent(data);
        break;
      case NODE_OFFLINE:
        outOfContent(data);
        break;
      case NODE_PRIVATE:
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
    setShowUI(true);
  }
  function updateUI() {
    updateEvents();
  }
  function login() {
    setShowUI(true);
    setIsLogin(true);
  }

  function contractFinished(eventId: any, type: number, data?: any) {
    if (type === USER_CANCEL && !eventId) {
      setInited(false);
      endEvent(eventId, type, data);
      setShowUI(false);
      return;
    }
    endEvent(eventId, type, data);
  }
  async function longinOut() {
    setShowUI(true);
    await freelogAuthApi.loginOut("").then((res: any) => {
      if (res.data.errCode === 0) {
        reload();
      }
    });
    setShowUI(false);
    // Dialog.confirm({
    //   content: "确定退出登录？页面会被刷新",
    //   onConfirm: async () => {
    //     await frequest(user.loginOut, "", "").then((res: any) => {
    //       if (res.data.errCode === 0) {
    //         reload();
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
    <>
      {showUI ? (
        <div id="freelog-mobile-auth" className="w-100x h-100x over-h">
          {isOut ? (
            <OutOf eventType={eventType} outData={outData}></OutOf>
          ) : inited || isLogin ? (
            <div className="w-100x h-100x bg-white">
              <Button color="primary" className="d-none"></Button>
              <Mobile
                events={events}
                isAuths={inited}
                isLogin={isLogin}
                contractFinished={contractFinished}
                updateEvents={updateEvents}
                loginFinished={loginFinished}
              ></Mobile>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
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
