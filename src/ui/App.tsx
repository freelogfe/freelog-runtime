// import logo from './logo.svg';
import "./App.scss";
import { useEffect, useState } from "react";
import { LOGIN, USER_CANCEL } from "../bridge/event";
import Login from "./components/login";
import Auth from "./components/auth";
import {
  reisterUI,
  eventMap,
  failedMap,
  endEvent,
  updateLock,
  updateEvent,
} from "../bridge/index";
import { setUserInfo } from "../platform/structure/utils";

function App() {
  const [events, setEvents] = useState([]);
  const [failedEvents, setFailedEvents] = useState([]);
  const [loginEvent, setLoginEvent] = useState(null);
  const [inited, setInited] = useState(false);
  useEffect(() => {
    updateLock(false);
  }, [events]);
  function backToNode() {
    // @ts-ignore
    const app = document.getElementById("runtime-root");
    // @ts-ignore
    app.style.zIndex = 0;
    // @ts-ignore
    app.style.opacity = 0;
    // @ts-ignore
    document.getElementById("freelog-plugin-container").style.zIndex = 1;
    setInited(false);
  }
  function showUI() {
    // document.body.appendChild = document.body.appendChild.bind(
    //   document.getElementById("runtime-root")
    // );
    // document.body.removeChild = document.body.removeChild.bind(
    //   document.getElementById("runtime-root")
    // );
    // @ts-ignore
    const app = document.getElementById("runtime-root");
    // @ts-ignore
    app.style.zIndex = 1;
    // @ts-ignore
    app.style.opacity = 1;
    // @ts-ignore
    document.getElementById("freelog-plugin-container").style.zIndex = 0;
  }
  // 遍历顺序是否永远一致
  function updateEvents(event?:any) {
    const eventMap = updateEvent(event)
    updateLock(true);
    const arr: any = [];
    let login = null;
    eventMap.forEach((val, key) => {
      if (key === LOGIN) {
        login = val;
      } else {
        arr.push(val);
      }
    });
    setLoginEvent(login);
    const arr2: any = [];
    failedMap.forEach((val) => {
      arr2.push(val);
    });
    setFailedEvents(arr2);
    setEvents(arr);
    if (!arr.length && !login) {
      backToNode();
    } else {
      showUI();
      setInited(true);
    }
  }
  function UI() {
    updateEvents();
  }
  function updateUI() {
    updateEvents();
  }
  function loginFinished(type: number, data?: any) {
    setUserInfo(data);
    // @ts-ignore
    endEvent(loginEvent.eventId, type, data);
  }
  function contractFinished(eventId: any, type: number, data?: any) {
    if (type === USER_CANCEL && !eventId) {
      // TODO 通知所有 用户取消了
      backToNode();
      return;
    }
    endEvent(eventId, type, data);
  }
  reisterUI(UI, updateUI);
  return (
    <div id="freelog-app" className="App flex-row w-100x h-100x over-h">
      <div className="flex-1 h-100x text-center">
        {inited ? (
          !!loginEvent ? (
            <Login eventFinished={loginFinished} events={events}></Login>
          ) : (
            <Auth events={events} contractFinished={contractFinished} updateEvents={updateEvents}></Auth>
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default App;
