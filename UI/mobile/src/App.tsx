// import logo from './logo.svg';
import "./App.scss";

import { useEffect, useState } from "react";
import Mobile from "./views/auth";
import { Dialog } from "antd-mobile"; // Toast, Button
import frequest from "@/services/handler";
import user from "@/services/api/modules/user";
const {
  reisterUI,
  clearEvent,
  endEvent,
  updateLock,
  updateEvent,
  lowerUI,
  upperUI,
  reload
} = window.freelogAuth;
const { SUCCESS, USER_CANCEL } = window.freelogAuth.resultType;

function App() {
  const [events, setEvents] = useState([]);
  // const [failedEvents, setFailedEvents] = useState([]);
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
    Dialog.confirm({
      content: "确定退出登录？页面会被刷新",
      onConfirm: async () => {
        await frequest(user.loginOut, "", "").then((res: any) => {
          if (res.data.errCode === 0) {
            reload();
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
    <div id="freelog-mobile-auth" className="w-100x h-100x over-h">
      {inited || isLogin ? (
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
