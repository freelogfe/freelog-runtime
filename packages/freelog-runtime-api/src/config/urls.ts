import { baseInfo } from "./env";

const ENV = baseInfo.ENV;
const HOST = baseInfo.HOST;
const isProd = ENV === "prod";

const i18nConfigMap: Record<string, string> = {
  prod: "https://freelog-i18n.oss-cn-shenzhen.aliyuncs.com/configs/i18n.json",
  test: "https://freelog-i18n.oss-cn-shenzhen.aliyuncs.com/configs-test/i18n.json",
  dev: "https://freelog-i18n.oss-cn-shenzhen.aliyuncs.com/configs-test/i18n.json",
};

export const urls = {
  HOST,
  ENV,

  userLogin: `https://user.${HOST}/logon`,
  userRetrieve: `https://user.${HOST}/retrieve`,
  userContract: (exhibitId: string, nodeName: string, status: string) =>
    `https://user.${HOST}/logged/contract?exhibitId=${exhibitId}&nodeName=${nodeName}&status=${status}`,

  apiBase: baseInfo.directURL,
  apiRuntime: baseInfo.baseURL,

  authProcessor: `https://authorization-processor.${HOST}/`,

  fileHost: `https://file.${HOST}`,

  i18nConfig: i18nConfigMap[ENV],

  wechatQrConnect: (redirectUri: string) =>
    `https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`,
  wechatCallbackBase: `https://api.${HOST}/${isProd ? "" : ENV + "/"}v2/thirdParty/weChat/codeHandle`,

  defaultCover: `https://static.${HOST}/static/default_cover.png`,
  shareBase: `https://share.${HOST}/`,

  helpCenter:
    "https://freelog2.freelog.cn/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62cce8f2456ff0002e328eb2",
};
