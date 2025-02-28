/* eslint-disable @typescript-eslint/ban-ts-comment */
import App from "./App";
import ReactDOM from "react-dom/client";
import microApp from "@micro-zoe/micro-app";
import { freelogFetch } from "freelog-runtime-core";
import { I18nextProvider } from "react-i18next";
import i18next from 'i18next';

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
  plugins: {
    global: [
      {
        loader(code: string, url: string) {
          const reg = /\/exhibits\/([^/]+)\/articles\/([^/]+)\/packages\/.+\.js$/
          const regResult = reg.exec(url) // [str, exhibitId, nid]
          if (regResult) {
            const nid = regResult[2]
            const _fn_reg = /(\.getLibraryEntryUrls\()([^)]*)(\))/g
            code = code.replaceAll(_fn_reg, (all: string, $1: string, $2: string, $3: string) => {
              if ($2.split(',').length === 1) {
                return `${$1}${$2},"${nid}"${$3}`
              }
              return all
            })
          }
          return code
        },
      }
    ]
  },
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
root.render(
  <I18nextProvider i18n={i18next}>
    <App />
  </I18nextProvider>
);
