// import logo from './logo.svg';
import "./App.scss";

import { useEffect, useState } from "react";
import Pc from "./views/auth";
import frequest from "@/services/handler";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import user from "@/services/api/modules/user";
import { eventMap } from '../../../src/bridge/index';
const {
  reisterUI,
  endEvent,
  updateLock,
  updateEvent,
  clearEvent,
  lowerUI,
  upperUI,
} = window.freelogAuth;
const { SUCCESS, USER_CANCEL } = window.freelogAuth.resultType;

function App() {
  const [events, setEvents] = useState([]);
  const [inited, setInited] = useState(false);
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
    console.log(eventMap,arr)
    setEvents(arr);
    if (!arr.length) {
      lowerUI();
    } else {
      upperUI();
      setInited(true);
    }
  }
  function UI() {
    updateEvents();
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
      // TODO 通知所有 用户取消了
      lowerUI();
      return;
    }
    endEvent(eventId, type, data);
  }

  function longinOut() {
    upperUI();
    Modal.confirm({
      title: "确认退出登录？",
      icon: <ExclamationCircleOutlined />,
      content: "退出后页面会被刷新",
      okText: "确认",
      cancelText: "取消",
      style: {
        top: "30%",
      },
      onOk: async () => {
        await frequest(user.loginOut, "", "").then((res: any) => {
          if (res.data.errCode === 0) {
            window.freelogAuth.reload();
          }
        });
      },
      onCancel: () => {
        lowerUI();
      },
    });
  }
  reisterUI(UI, updateUI, login, longinOut);
  return (
    <div id="freelog-pc-auth" className="w-100x h-100x over-h">
      {inited || isLogin ? (
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
