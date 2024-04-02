import { WidgetApp, PlainObject, NodeInfo, FreelogUserInfo } from './interface';
// export const sum = (a: number, b: number) => {
//   if ('development' === process.env.NODE_ENV) {
//     console.log('boop');
//   }
//   return a + b;
// };
//  || window.$wujie?.props || window.freelogApp

export let freelogApp: FreelogApp = {} as FreelogApp;
export const initFreelogApp = () => {
  const app = window.microApp?.getData().freelogApp;
  freelogApp = app;
  freelogApp.clearData = window.microApp.clearData;
  freelogApp.getData = window.microApp.getData;
  freelogApp.addDataListener = window.microApp.addDataListener;
  freelogApp.removeDataListener = window.microApp.removeDataListener;
  freelogApp.clearDataListener = window.microApp.clearDataListener;
  freelogApp.dispatch = window.microApp.dispatch;
  freelogApp.getGlobalData = window.microApp.getGlobalData;
  freelogApp.addGlobalDataListener = window.microApp.addGlobalDataListener;
  freelogApp.removeGlobalDataListener =
    window.microApp.removeGlobalDataListener;
  freelogApp.clearGlobalDataListener = window.microApp.clearGlobalDataListener;
  freelogApp.setGlobalData = window.microApp.setGlobalData;
  return freelogApp;
};

export interface FreelogApp {
  registerApi: (obj: PlainObject) => any;
  getData: () => any;
  clearData: () => any;
  addDataListener: (dataListener: Function, autoTrigger?: boolean) => any;
  removeDataListener: (dataListener: Function) => any;
  clearDataListener: () => any;
  dispatch: (obj: any) => any;
  getGlobalData: () => any;
  addGlobalDataListener: (dataListener: Function, autoTrigger?: boolean) => any;
  removeGlobalDataListener: (dataListener: Function) => any;
  clearGlobalDataListener: () => any;
  setGlobalData: (data: PlainObject) => any;
  setUserDataKeyForDev: (resourceName: string) => undefined;
  nodeInfo: NodeInfo;
  status: {
    authUIMounted: boolean;
    themeMounted: boolean;
  };
  mountWidget: (options: {
    widget: any;
    container: HTMLElement | null;
    config?: PlainObject;
    renderWidgetOptions?: RenderWidgetOptions;
    topExhibitData?: any;
    seq?: number | null;
    widget_entry?: boolean | string;
  }) => Promise<WidgetApp>;
  getExhibitListById: (query: {
    exhibitIds: string;
    isLoadVersionProperty?: 0 | 1;
  }) => Promise<any>;
  getExhibitListByPaging: (query: {
    skip?: number;
    limit?: number;
    sort?: string;
    articleResourceTypes?: string;
    omitArticleResourceType?: string;
    onlineStatus?: number;
    tags?: string;
    projection?: string;
    keywords?: string;
    isLoadVersionProperty?: number;
    isLoadPolicyInfo?: number;
    isTranslate?: number;
    tagQueryType?: number;
  }) => Promise<any>;
  getExhibitInfo: (
    exhibitId: string,
    query?: {
      isLoadVersionProperty: 0 | 1;
    }
  ) => Promise<any>;
  getExhibitSignCount: (exhibitId: string) => Promise<any>;
  getExhibitAuthStatus: (exhibitId: string) => Promise<any>;
  getExhibitFileStream: (
    exhibitId: string,
    options?: {
      returnUrl?: boolean;
      config?: {
        onUploadProgress: any;
        onDownloadProgress: any;
        responseType: any;
      };
      subFilePath?: string;
    }
  ) => Promise<any>;
  getExhibitDepFileStream: (
    exhibitId: string,
    parentNid: string,
    subArticleIdOrName: string,
    returnUrl?: boolean,
    config?: {
      onUploadProgress: any;
      onDownloadProgress: any;
      responseType: any;
    }
  ) => Promise<any>;
  // getExhibitInfoByAuth,
  getExhibitDepTree: (
    exhibitId: string | number,
    options: {
      version?: string;
      nid?: string;
      maxDeep?: number;
      isContainRootNode?: boolean;
    }
  ) => Promise<any>;
  getExhibitDepInfo: (exhibitId: string, articleNids: string) => Promise<any>;
  getSignStatistics: (query: any) => Promise<any>;
  getExhibitAvailable: (exhibitIds: string) => Promise<any>;
  pushMessage4Task: (query?: PlainObject) => Promise<any>;
  devData: PlainObject;
  getStaticPath: (path: string) => string;
  getSubDep: () => Promise<any>;
  getSelfArticleId: () => string;
  getSelfExhibitId: () => string;
  getSelfWidgetId: () => string;
  callAuth: () => void;
  addAuth: (
    exhibitId: string,
    options?: { immediate: boolean }
  ) => Promise<any>;
  onLogin: (callback: Function) => void;
  onUserChange: (callback: Function) => void;
  callLogin: (callback?: Function) => void;
  callLoginOut: () => void;
  getCurrentUser: () => FreelogUserInfo;
  setViewport: (options: {
    width?: string; // immutable
    height?: string; // not supported in browser
    'initial-scale'?: number; // 0.0-10.0   available for theme
    'maximum-scale'?: number; // 0.0-10.0   available for theme
    'minimum-scale'?: number; // 0.0-10.0   available for theme
    'user-scalable'?: string; // available for theme
    'viewport-fit'?: string; // not supported in browser
  }) => void;
  setUserData: (key: string | number, data: any) => Promise<any>;
  getUserData: (key: string | number) => Promise<any>;
  getSelfConfig: () => PlainObject;
  isUserChange: () => boolean;
  reload: () => void;
  resultType: {
    SUCCESS: number;
    FAILED: number;
    USER_CANCEL: number;
    DATA_ERROR: number;
    TEST_NODE: number;
    OFFLINE: number;
  };
  getCurrentUrl: () => string;
  getShareUrl: (exhibitId: string) => string;
  mapShareUrl: (routeMap: {
    // 详情对应的路由，运行时获取返回值后会修改url
    detail?: (exhibitId: string) => string;
    // 内容对应的路由，运行时获取返回值后会修改url
    content?: (exhibitId: string) => string;
  }) => null;
}

interface RenderWidgetOptions {
  name: string; // 应用名称，必传
  url: string; // 应用地址，必传
  container: string | Element; // 应用容器或选择器，必传
  iframe?: boolean; // 是否切换为iframe沙箱，可选
  inline?: boolean; // 开启内联模式运行js，可选
  // 'disable-scopecss'?: boolean, // 关闭样式隔离，可选
  // 'disable-sandbox'?: boolean, // 关闭沙箱，可选
  'disable-memory-router'?: boolean; // 关闭虚拟路由系统，可选
  'default-page'?: string; // 指定默认渲染的页面，可选
  'keep-router-state'?: boolean; // 保留路由状态，可选
  'disable-patch-request'?: boolean; // 关闭子应用请求的自动补全功能，可选
  'keep-alive'?: boolean; // 开启keep-alive模式，可选
  destroy?: boolean; // 卸载时强制删除缓存资源，可选
  fiber?: boolean; // 开启fiber模式，可选
  baseroute?: string; // 设置子应用的基础路由，可选
  ssr?: boolean; // 开启ssr模式，可选
  // shadowDOM?: boolean, // 开启shadowDOM，可选
  data?: Object; // 传递给子应用的数据，可选
  onDataChange?: Function; // 获取子应用发送数据的监听函数，可选
  // 注册子应用的生命周期
  lifeCycles?: {
    created(e: CustomEvent): void; // 加载资源前触发
    beforemount(e: CustomEvent): void; // 加载资源完成后，开始渲染之前触发
    mounted(e: CustomEvent): void; // 子应用渲染结束后触发
    unmount(e: CustomEvent): void; // 子应用卸载时触发
    error(e: CustomEvent): void; // 子应用渲染出错时触发
    beforeshow(e: CustomEvent): void; // 子应用推入前台之前触发（keep-alive模式特有）
    aftershow(e: CustomEvent): void; // 子应用推入前台之后触发（keep-alive模式特有）
    afterhidden(e: CustomEvent): void; // 子应用推入后台时触发（keep-alive模式特有）
  };
}
