import "./App.scss";

import { useEffect, useState } from "react";
import Pc from "./views/auth";
import OutOf from "./views/outOf";
import { freelogAuthApi } from "freelog-runtime-api";
const props = window.$wujie?.props;
const {
  registerUI,
  endEvent,
  updateLock,
  updateEvent,
  clearEvent,
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
    await freelogAuthApi.loginOut().then((res: any) => {
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
    //     await frequest(freelogAuthApi.loginOut, "", "").then((res: any) => {
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
  );
}

export default App;
