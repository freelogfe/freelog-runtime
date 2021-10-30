// @ts-ignore
import React from "react";
import ReactDOM from "react-dom";
import App from "./ui/App";
import './public-path';
import reportWebVitals from "./reportWebVitals";
import zhCN from "antd/lib/locale/zh_CN";
import { ConfigProvider } from "antd";
 
window.isTest = false;
if (
  window.location.href
    .replace("http://", "")
    .replace("https://", "")
    .indexOf("t.") === 0
) {
  window.isTest = true;
}
ReactDOM.render(
  <App />,
   document.querySelector('#root')
);

export async function bootstrap() {
  console.log('[react17] react app bootstraped');
}
//     </React.StrictMode>,

export async function mount(props:any = {}) {
  const { container } = props;
  ReactDOM.render(
      <App />,
      container ? container.querySelector('#root') : document.querySelector('#root')
  );
}

export async function unmount(props:any) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(
    container ? container.querySelector('#root') : document.getElementById('root'),
  );
}

if (!window.__POWERED_BY_FREELOG__) {
  bootstrap().then(mount);
}
// TODO 必须ui准备好了才能让里面的addAuth生效
// setTimeout(()=>{run();},0)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
