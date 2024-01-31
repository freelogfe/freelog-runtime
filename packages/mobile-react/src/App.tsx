// import logo from './logo.svg';


import "./App.scss";
import "@/assets/mobile/index.scss";
// import "antd-mobile/es/global/global.css"
// import "antd-mobile/es/global/theme-default.css"
import { useEffect, useState } from "react";
import Mobile from "./views/auth";
import { freelogAuthApi } from "freelog-runtime-api";
import OutOf from "./views/outOf";

//@ts-ignore
const props = window.$wujie?.props;
const {
  registerUI,
  clearEvent,
  endEvent,
  updateLock,
  updateEvent,
  lowerUI,
  upperUI,
  reload,
} = props.freelogAuth;
const { SUCCESS, USER_CANCEL } = props.freelogAuth.resultType;
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
} = props.freelogAuth.eventType;

function App() {
  const [events, setEvents] = useState([]);
  // const [failedEvents, setFailedEvents] = useState([]);
  const [inited, setInited] = useState(false);
  const [eventType, setEventType] = useState("");
  const [isOut, setIsOut] = useState(false);
  const [outData, setOutData] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(false);
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
    setEvents(arr);
    if (!arr.length) {
      lowerUI();
    } else {
      upperUI();
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
    await freelogAuthApi.loginOut("").then((res: any) => {
      if (res.data.errCode === 0) {
        reload();
      }
    });
    lowerUI();
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
    <div id="freelog-mobile-auth" className="w-100x h-100x over-h">
      {isOut ? (
        <OutOf eventType={eventType} outData={outData}></OutOf>
      ) : inited || isLogin ? (
        <div className="w-100x h-100x bg-white">
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
  );
}

export default App;
