// import logo from './logo.svg';
import "./App.scss";
import React, { useEffect, useState } from "react";
import { LOGIN, CONTRACT } from "../bridge/event";
import Login from "./components/login";
import Contract from "./components/contract";
import { reisterUI, eventMap, failedMap, endEvent, updateLock } from "../bridge/index";
import {  setUserInfo } from "../platform/structure/utils";

function App() {
  const [events, setEvents] = useState([]);
  const [failedEvents, setFailedEvents] = useState([]);
  const [loginEvent, setLoginEvent] = useState(null);
  const [inited, setInited] = useState(false);
  useEffect(()=>{
    updateLock(false)
  },[events])
  useEffect(()=>{
    console.log(234554532424, inited)
  },[inited])
  // 遍历顺序是否永远一致
  function updateEvents() {
    updateLock(true)
    const arr: any = [];
    let login = null;
    eventMap.forEach((val, key) => {
      if (key === LOGIN) {
        login = val;
      } else {
        arr.push(val);
      }
    });
    if (!arr.length && !login) {
      // @ts-ignore
      const app = document.getElementById("runtime-root");
      // @ts-ignore
      app.style.zIndex = 0;
      // @ts-ignore
      app.style.opacity = 0;
      // @ts-ignore
      document.getElementById("freelog-plugin-container").style.zIndex = 1;
      // setInited(false);
    } else {
      document.body.appendChild = document.body.appendChild.bind(
        document.getElementById("runtime-root")
      );
      document.body.removeChild = document.body.removeChild.bind(
        document.getElementById("runtime-root")
      );
      // @ts-ignore
      const app = document.getElementById("runtime-root");
      // @ts-ignore
      app.style.zIndex = 1;
      // @ts-ignore
      app.style.opacity = 1;
      // @ts-ignore
      document.getElementById("freelog-plugin-container").style.zIndex = 0;
      setInited(true)
    }
    setLoginEvent(login);
    const arr2: any = [];
    failedMap.forEach((val) => {
      arr2.push(val);
    });
    setFailedEvents(arr2);
    setEvents(arr);
    return arr;
  }
  function UI() {
    updateEvents();
  }
  function updateUI() {
    updateEvents();
  }
  function eventFinished(type: number, data?: any) {
    setUserInfo(data)
    // @ts-ignore
    endEvent(loginEvent.eventId, type, data);
  }
  reisterUI(UI, updateUI);
  return (
    <div id="freelog-app" className="App flex-row w-100x h-100x over-h">
      <div className="flex-1 h-100x text-center">
        {inited ? (
          !!loginEvent ? (
            <Login eventFinished={eventFinished} events={events}></Login>
          ) : (
            <Contract events={events}></Contract>
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default App;
