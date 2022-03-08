export const DEV_FALSE = 0; 
export const DEV_WIDGET = 1; // 插件开发模式
export const DEV_TYPE_REPLACE = 2; // 插件替换模式
export function dev(): any {
  const searchs = window.location.search
    ? window.location.search.split("?")
    : [];
  if (!searchs[1]) {
    return { type: DEV_FALSE };
  }
  const paramsArray = window.location.search.split("?")[1].split("&");
  const params: any = {};
  paramsArray.forEach((item) => {
    params[item.split("=")[0]] = item.split("=")[1];
  });
  params.dev = params.dev || params.devconsole;
  if (!params.dev) {
    return { type: DEV_FALSE };
  }
  if (params.dev.toLowerCase() === "replace") {
    return { type: DEV_TYPE_REPLACE, params };
  } else {
    // TODO $_是路由前缀，这里有错误，需要引用常量
    params.dev = params.dev.split("$_")[0];
  }
  return {
    type: DEV_WIDGET,
    params,
    config: { vconsole: !!params.devconsole },
  };
}
