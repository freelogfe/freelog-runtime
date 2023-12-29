export const DEV_FALSE = 0;
export const DEV_WIDGET = 1; // 插件开发模式
export const DEV_TYPE_REPLACE = 2; // 插件替换模式
import { URL_WIDGET_PREFIX } from "./const";

export function dev(): any {
  const searchs = window.location.search
    ? window.location.search.split("?")
    : [];
  if (!searchs[1]) {
    return { type: DEV_FALSE };
  }
  const paramsArray = window.location.search.split("?")[1].split(URL_WIDGET_PREFIX)[0].split("&");
  const params: any = {};
  paramsArray.forEach((item) => {
    params[item.split("=")[0]] = item.split("=")[1];
  });
  params.dev = params.dev || params.devconsole;
  if (!params.dev) {
    return { type: DEV_FALSE };
  }
  if (params.dev.toLowerCase() === "replace") {
    return {
      type: DEV_TYPE_REPLACE,
      params,
      config: { vconsole: !!params.devconsole },
    };
  } else {
    // params.dev = params.dev.split("$_")[0];
    // console.log(params.dev)
  }
  return {
    type: DEV_WIDGET,
    params,
    config: { vconsole: !!params.devconsole },
  };
}
