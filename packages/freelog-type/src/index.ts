import { NodeInfo, PlainObject } from "./base";
import { AxiosResponse, ResponseType } from "axios";
import { FreelogUserInfo, PageResult } from "egg-freelog-base";
import { IApiDataFormat } from "./base";
import { ExhibitInfo, PresentableDependencyTree } from "./interface";
import { SetUserDataKeyForDev, MountWidget } from "./freelogApp";
export let widgetApi: WidgetApi = {} as WidgetApi;
export let freelogApp: FreelogApp = {} as FreelogApp;
export const initFreelogApp = () => {
  const app = window.microApp?.getData().freelogApp;
  freelogApp = app;
  widgetApi = window.microApp;

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
  setUserDataKeyForDev: SetUserDataKeyForDev;
  nodeInfo: NodeInfo;
  devData: PlainObject;
  getCurrentUser: () => FreelogUserInfo;
  mountWidget: MountWidget;
  getExhibitListById: (query: {
    exhibitIds: string;
    isLoadVersionProperty?: 0 | 1;
  }) => Promise<AxiosResponse<IApiDataFormat<ExhibitInfo[]>>>;
  getExhibitListByPaging: (options?: {
    /**
     * 跳过的数量.默认为0.
     */
    skip?: number;
    /**
     * 本次请求获取的数据条数.一般不允许超过100
     */
    limit?: number;
    /**
     * 排序,格式为{排序字段}:{1|-1},1是正序,-1是倒序
     */
    sort?: string;
    /**
     * 作品资源类型,多个用逗号分隔
     */
    articleResourceTypes?: string;
    /**
     * 忽略的作品资源类型,与resourceType参数互斥
     */
    omitArticleResourceType?: string;
    /**
     * 上线状态 (0:下线 1:上线 2:全部) 默认1
     */
    onlineStatus?: number;
    /**
     * 用户创建presentable时设置的自定义标签,多个用","分割
     */
    tags?: string;
    /**
     *  tags的查询方式1:任意匹配一个标签 2:全部匹配所有标签 默认:1
     */
    tagQueryType?: number;
    /**
     * 指定返回的字段,多个用逗号分隔
     */
    projection?: string;
    /**
     * 搜索关键字,目前支持模糊搜索节点资源名称和资源名称
     */
    keywords?: string;
    /**
     * 是否响应展品版本属性
     */
    isLoadVersionProperty?: 0 | 1;
    /**
     * 是否加载策略信息.测试环境自动忽略此参数
     */
    isLoadPolicyInfo?: 0 | 1;
    /**
     * 是否同步翻译.测试环境自动忽略此参数
     */
    isTranslate?: 0 | 1;
  }) => Promise<AxiosResponse<IApiDataFormat<PageResult<ExhibitInfo[]>>>>;
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
        onUploadProgress?: (progressEvent: any) => void;
        onDownloadProgress?: (progressEvent: any) => void;
        responseType?: ResponseType;
      };
      /**
       * 漫画中的图片等子文件的路径
       */
      subFilePath?: string;
    }
  ) => Promise<any | string>;
  getExhibitDepFileStream: (
    exhibitId: string,
    options: {
      /**
       * 依赖树上的父级节点ID
       */
      parentNid: string;
      /**
       * 子依赖的作品ID
       */
      subArticleId: string;
      returnUrl?: boolean;
      config?: {
        onUploadProgress?: (progressEvent: any) => void;
        onDownloadProgress?: (progressEvent: any) => void;
        responseType?: ResponseType;
      };
      /**
       * 漫画中的图片等子文件的路径
       */
      subFilePath?: string;
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
    options?: {
      /**
       * 引用的发行版本号,默认使用锁定的最新版本
       */
      version?: string;
      /**
       * 叶子节点ID,如果需要从叶子节点开始响应,则传入此参数
       */
      nid?: string;
      /**
       * 依赖树最大返回深度
       */
      maxDeep?: number;
      /**
       * 是否包含根节点,默认包含
       */
      isContainRootNode?: boolean;
    }
  ) => Promise<AxiosResponse<IApiDataFormat<PresentableDependencyTree[]>>>;
  getExhibitDepInfo: (
    exhibitId: string,
    query: {
      /**
       * 展品依赖的作品ID,多个用逗号分隔
       */
      articleNids: string;
    }
  ) => Promise<IApiDataFormat<DependArticleInfo[]>>;
  getSignStatistics: (query?: {
    /**
     * 标的物名称，这里指展品名称
     */
    keywords: string;
  }) => Promise<IApiDataFormat<SignCount[]>>;
  getSubDep: () => Promise<{
    exhibitName: string;
    exhibitId: string;
    /**
     * 作品链路id, 在依赖树当中的唯一标识id
     */
    articleNid: string;
    /**
     * 作品类型
     */
    resourceType: string;
    subDep: {
      /**
       * 子依赖作品id
       */
      id: string;
      /**
       * 子依赖名称
       */
      name: string;
      /**
       * 子依赖链路id,在依赖树当中的唯一标识id
       */
      nid: string;
      /**
       * 资源类型
       */
      resourceType: string[];
      /**
       * 当前请求的作品类型(1:独立资源 2:组合资源 3:节点组合资源 4:存储对象)
       */
      type: number;
    }[];
    versionInfo: PlainObject;
    /**
     * 有授权时data为展品信息，无授权时data为授权信息
     */
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
    width?: string;
    height?: string;
    "initial-scale"?: number;
    "maximum-scale"?: number;
    "minimum-scale"?: number;
    "user-scalable"?: string;
    "viewport-fit"?: string;
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
  getShareUrl: (exhibitId: string, type: "detail" | "content") => string;
  mapShareUrl: (routeMap: {
    // 详情对应的路由，运行时获取返回值后会修改url
    detail?: (exhibitId: string) => string;
    // 内容对应的路由，运行时获取返回值后会修改url
    content?: (exhibitId: string) => string;
  }) => void;
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
