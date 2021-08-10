// @ts-ignore
import React from "react";
import ReactDOM from "react-dom";
import App from "./ui/App";
import reportWebVitals from "./reportWebVitals";
import { run } from "./platform";
import { isMobile } from "./utils/utils";
import zhCN from "antd/lib/locale/zh_CN";
import { ConfigProvider } from "antd";
if (isMobile()) {
  //@ts-ignore
  window.isMobile = true;
  // @ts-ignore
  document.querySelector("meta[name=viewport]").content =
    "width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no";
}
window.isTest = false;
if (
  window.location.href
    .replace("http://", "")
    .replace("https://", "")
    .indexOf("t.") === 0
) {
  window.isTest = true;
}
document.domain = "testfreelog.com"
ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  document.getElementById("ui-root")
);

// TODO 必须ui准备好了才能让里面的addAuth生效
setTimeout(()=>{run();},0)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
