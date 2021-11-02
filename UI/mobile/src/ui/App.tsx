// import logo from './logo.svg';
import "./App.scss";

import { useEffect, useState } from "react";
import Mobile from "./mobile/auth";
const {
  reisterUI,
  eventMap,
  failedMap,
  endEvent,
  updateLock,
  updateEvent,
  lowerUI,
  upperUI
} = window.freelogAuth;
const { SUCCESS, USER_CANCEL, FAILED } = window.freelogAuth.resultType;

function App() {
  const [events, setEvents] = useState([]);
  const [failedEvents, setFailedEvents] = useState([]);
  const [inited, setInited] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    updateLock(false);
  }, [events]);
  function loginFinished(type: any) {
    if (type === SUCCESS) {
      eventMap.clear();
      failedMap.clear();
      updateEvents();
    }
    setIsLogin(false)
    if (!inited) {
      lowerUI()
    }
  }
   
  // 遍历顺序是否永远一致
  function updateEvents(event?: any) {
    const eventMap = updateEvent(event);
    updateLock(true);
    const arr: any = [];
    eventMap.forEach((val:any) => {
      arr.push(val);
    });
    const arr2: any = [];
    failedMap.forEach((val:any) => {
      arr2.push(val);
    });
    setFailedEvents(arr2);
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
    debugger
    upperUI()
    setIsLogin(true);
  }

  function contractFinished(eventId: any, type: number, data?: any) {
    if (type === USER_CANCEL && !eventId) {
      endEvent(eventId, type, data);
      // TODO 通知所有 用户取消了
      lowerUI();
      return;
    }
    endEvent(eventId, type, data);
  }

  reisterUI(UI, updateUI, login);
  return (
    <div id="freelog-app" className="w-100x h-100x ">
      {inited || isLogin ? (
        
          <Mobile
            events={events}
            isAuths={inited}
            isLogin={isLogin}
            contractFinished={contractFinished}
            updateEvents={updateEvents}
            loginFinished={loginFinished}
          ></Mobile>
      ) : null}
    </div>
  );
}

export default App;
