export const DEV_FALSE = 0;
export const DEV_THEME = 1; // 插件开发模式
export const DEV_TYPE_REPLACE = 2; // 插件替换模式

export function dev(): any {
  const url = new URL(window.location.href);
  // const dev = url.searchParams.get("dev");
  // const replace = url.searchParams.get("replace");
  // const devconsole = url.searchParams.get("devconsole"); // 1 ,2,3
  const params: any = {};
  url.searchParams.forEach((item, key) => {
    params[key] = item;
  });
  if (!params.dev) {
    return { type: DEV_FALSE };
  }
  if (params.dev.toLowerCase() === "replace") {
    return {
      type: DEV_TYPE_REPLACE,
      params,
      config: { vconsole: !!params.devconsole },
    };
  }
  return {
    type: DEV_THEME,
    params,
    config: { vconsole: !!params.devconsole },
  };
}
