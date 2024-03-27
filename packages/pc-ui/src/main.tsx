/* eslint-disable @typescript-eslint/ban-ts-comment */
import App from "./App";
import ReactDOM from "react-dom/client";
import microApp from "@micro-zoe/micro-app";
import { freelogFetch } from "freelog-runtime-core";

microApp.start({
  lifeCycles: {
    created() {
      // console.log("created 全局监听");
    },
    beforemount() {
      // console.log("beforemount 全局监听");
    },
    mounted() {
      // console.log("mounted 全局监听");
    },
    unmount() {
      // console.log("unmount 全局监听");
    },
    error() {
      // console.log("error 全局监听");
    },
  },
  plugins: {},
  /**
   * 自定义fetch
   * @param url 静态资源地址
   * @param options fetch请求配置项
   * @returns Promise<string>
   */
  // @ts-ignore
  fetch(url: string, options: any, appName: string) {
    return freelogFetch(url, options, appName).then((res: any) => {
      return res.text();
    });
    // return fetch(url, Object.assign(options, config)).then((res) => {
    //   return res.text()
    // })
  },
});
const root = ReactDOM.createRoot(
  document.getElementById("ui-root") as HTMLElement
);
root.render(<App />);
