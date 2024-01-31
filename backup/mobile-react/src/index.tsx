import App from "./App";
// @ts-ignore
import reportWebVitals from "./reportWebVitals";

import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = () => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  };
  window.__WUJIE_UNMOUNT = () => {
    root.unmount();
  };
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
// setTimeout(()=>{run();},0)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
