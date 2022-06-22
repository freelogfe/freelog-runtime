// @ts-ignore
import App from "./App";
import "./public-path";
import reportWebVitals from "./reportWebVitals";

import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
export async function bootstrap() {}

export async function mount(props: any = {}) {
  root.render(<App />);
}
export async function unmount(props: any) {
  root.unmount();
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
