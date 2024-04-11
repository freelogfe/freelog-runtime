import { WidgetApp, PlainObject, NodeInfo } from './widget';
import { AxiosResponse, ResponseType } from 'axios';
import { FreelogUserInfo, PageResult } from 'egg-freelog-base';
import { IApiDataFormat } from './base';
import { ExhibitInfo, PresentableDependencyTree } from './interface';

export let widgetApi: WidgetApi = {} as WidgetApi;
export let freelogApp: FreelogApp = {} as FreelogApp;
export const initFreelogApp = () => {
  const app = window.microApp?.getData().freelogApp;
  freelogApp = app;
  const clearData = window.microApp.clearData;
  const getData = window.microApp.getData;
  const addDataListener = window.microApp.addDataListener;
  const removeDataListener = window.microApp.removeDataListener;
  const clearDataListener = window.microApp.clearDataListener;
  const dispatch = window.microApp.dispatch;
  const getGlobalData = window.microApp.getGlobalData;
  const addGlobalDataListener = window.microApp.addGlobalDataListener;
  const removeGlobalDataListener = window.microApp.removeGlobalDataListener;
  const clearGlobalDataListener = window.microApp.clearGlobalDataListener;
  const setGlobalData = window.microApp.setGlobalData;
  widgetApi = {
    clearData,
    getData,
    addDataListener,
    removeDataListener,
    clearDataListener,
    dispatch,
    getGlobalData,
    addGlobalDataListener,
    removeGlobalDataListener,
    clearGlobalDataListener,
    setGlobalData,
  };
  return { freelogApp, widgetApi };
};

export interface WidgetApi {
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
}
export interface FreelogApp {
  registerApi: (obj: PlainObject) => void;
  setUserDataKeyForDev: (resourceName: string) => void;
  nodeInfo: NodeInfo;
  devData: PlainObject;
  getCurrentUser: () => FreelogUserInfo;
  mountWidget: (options: {
    widget: any;
    container: HTMLElement;
    config?: PlainObject;
    renderWidgetOptions?: RenderWidgetOptions;
    topExhibitData?: any;
    seq?: number;
    widget_entry?: string;
  }) => Promise<WidgetApp>;
  getExhibitListById: (query: {
    exhibitIds: string;
    isLoadVersionProperty?: 0 | 1;
  }) => Promise<AxiosResponse<IApiDataFormat<ExhibitInfo[]>>>;
  getExhibitListByPaging: (options?: {
    skip?: number; // 跳过的数量.默认为0.
    limit?: number; // 本次请求获取的数据条数.一般不允许超过100
    sort?: string; // 排序,格式为{排序字段}:{1|-1},1是正序,-1是倒序
    articleResourceTypes?: string; // 作品资源类型,多个用逗号分隔
    omitArticleResourceType?: string; // 忽略的作品资源类型,与resourceType参数互斥
    onlineStatus?: number; // 上线状态 (0:下线 1:上线 2:全部) 默认1
    tags?: string; // 用户创建presentable时设置的自定义标签,多个用","分割
    tagQueryType?: number; // tags的查询方式1:任意匹配一个标签 2:全部匹配所有标签 默认:1
    projection?: string; // 指定返回的字段,多个用逗号分隔
    keywords?: string; // 搜索关键字,目前支持模糊搜索节点资源名称和资源名称
    isLoadVersionProperty?: 0 | 1; // 是否响应展品版本属性
    isLoadPolicyInfo?: 0 | 1; // 是否加载策略信息.测试环境自动忽略此参数
    isTranslate?: 0 | 1; // 是否同步翻译.测试环境自动忽略此参数
  }) => Promise<AxiosResponse<IApiDataFormat<PageResult<ExhibitInfo>>>>;
  getExhibitInfo: (
    exhibitId: string,
    query?: {
      isLoadVersionProperty: 0 | 1;
    }
  ) => Promise<AxiosResponse<IApiDataFormat<ExhibitInfo>>>;
  getExhibitFileStream: (
    exhibitId: string,
    options?: {
      returnUrl?: boolean;
      config?: {
        onUploadProgress?: any;
        onDownloadProgress?: any;
        responseType?: ResponseType;
      };
      subFilePath?: string;
    }
  ) => Promise<any | string>;
  getExhibitDepFileStream: (
    exhibitId: string,
    parentNid: string,
    subArticleIdOrName: string,
    returnUrl?: boolean,
    config?: {
      onUploadProgress?: (progressEvent: any) => void;
      onDownloadProgress?: (progressEvent: any) => void;
      responseType?: ResponseType;
    }
  ) => Promise<any | string>;
  getExhibitSignCount: (
    exhibitIds: string
  ) => Promise<AxiosResponse<IApiDataFormat<SignItem[]>>>;
  getExhibitAuthStatus: (
    exhibitIds: string
  ) => Promise<AxiosResponse<IApiDataFormat<AuthResult[]>>>;
  getExhibitAvailable: (
    exhibitIds: string
  ) => Promise<AxiosResponse<IApiDataFormat<AuthResult[]>>>;
  getExhibitDepTree: (
    exhibitId: string | number,
    options: {
      version?: string;
      nid?: string;
      maxDeep?: number;
      isContainRootNode?: boolean;
    }
  ) => Promise<AxiosResponse<IApiDataFormat<PresentableDependencyTree[]>>>;
  getExhibitDepInfo: (
    exhibitId: string,
    articleNids: string
  ) => Promise<IApiDataFormat<DependArticleInfo[]>>;
  getSignStatistics: (query: {
    keywords: string;
  }) => Promise<IApiDataFormat<SignCount[]>>;
  getSubDep: () => Promise<{
    exhibitName: string;
    exhibitId: string;
    articleNid: string;
    resourceType: string;
    subDep: any[];
    versionInfo: PlainObject;
    data: AuthResult | ExhibitInfo;
  }>;
  setUserData: (key: string | number, data: any) => Promise<any>;
  getUserData: (key: string | number) => Promise<any>;
  getSelfArticleId: () => string;
  getSelfExhibitId: () => string;
  getSelfWidgetRenderName: () => string;
  getSelfConfig: () => PlainObject;
  callAuth: () => void;
  addAuth: (
    exhibitId: string,
    options?: { immediate: boolean }
  ) => Promise<any>;
  onLogin: (callback: Function) => void;
  onUserChange: (callback: Function) => void;
  isUserChange: () => boolean;
  callLogin: (callback?: Function) => void;
  callLoginOut: () => void;
  setViewport: (options: {
    width?: string; // immutable
    height?: string; // not supported in browser
    'initial-scale'?: number; // 0.0-10.0   available for theme
    'maximum-scale'?: number; // 0.0-10.0   available for theme
    'minimum-scale'?: number; // 0.0-10.0   available for theme
    'user-scalable'?: string; // available for theme
    'viewport-fit'?: string; // not supported in browser
  }) => void;
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
  }) => void;
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
interface SignItem {
  subjectId: string;
  count: number;
}
interface AuthResult {
  exhibitId: string;
  exhibitName: string;
  authCode: number;
  referee: number;
  defaulterIdentityType: number;
  isAuth: boolean;
  errorMsg: string;
}
interface DependArticleInfo {
  nid: string;
  articleId: string;
  articleName: string;
  articleType: 1;
  version: string;
  resourceType: string;
  articleProperty: {
    fileSize: number;
    mime: string;
  };
}
interface SignCount {
  subjectId: string;
  subjectName: string;
  policyIds: string[];
  latestSignDate: string;
  count: number;
}
