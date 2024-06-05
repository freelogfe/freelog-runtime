import { ResponseType } from "axios";
import { NodeInfo, PlainObject, FreelogUserInfo } from "./base";
import { MountExhibitWidgetOptions, MountArticleWidgetOptions } from "./widget";

import {
  WidgetController,
  GetExhibitListByIdResult,
  GetExhibitListByPagingResult,
  GetExhibitInfoResult,
  GetExhibitSignCountResult,
  GetExhibitAuthStatusResult,
  GetExhibitAvailableResult,
  GetExhibitDepInfoResult,
  GetSignStatisticsResult,
  AddAuthResult,
} from "./result";
import { ExhibitDependencyNodeInfo } from "./exhibit";
export * from "./result";
export * from "./exhibit";


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
  setGlobalData: (data: PlainObject) => any;
  getGlobalData: () => any;
  addGlobalDataListener: (dataListener: Function, autoTrigger?: boolean) => any;
  removeGlobalDataListener: (dataListener: Function) => any;
  clearGlobalDataListener: () => any;
}
export interface FreelogApp {
  nodeInfo: NodeInfo;
  // devData: PlainObject;
  getCurrentUser: () => FreelogUserInfo;
  mountArticleWidget: (
    options: MountArticleWidgetOptions
  ) => Promise<WidgetController>;
  mountExhibitWidget: (
    options: MountExhibitWidgetOptions
  ) => Promise<WidgetController>;
  getTopExhibitId: () => string;
  getSelfProperty: (isFromServer?: boolean) => Promise<PlainObject>;
  getSelfDependencyTree: (
    isFromServer?: boolean
  ) => Promise<ExhibitDependencyNodeInfo[]>;
  getExhibitListById: (query: {
    exhibitIds: string;
    isLoadVersionProperty?: 0 | 1;
  }) => Promise<GetExhibitListByIdResult>;
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
  }) => Promise<GetExhibitListByPagingResult>;
  getExhibitInfo: (
    exhibitId: string,
    query?: {
      isLoadVersionProperty: 0 | 1;
    }
  ) => Promise<GetExhibitInfoResult>;
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
  ) => Promise<GetExhibitSignCountResult>;
  getExhibitAuthStatus: (
    exhibitIds: string
  ) => Promise<GetExhibitAuthStatusResult>;
  getExhibitAvailable: (
    exhibitIds: string
  ) => Promise<GetExhibitAvailableResult>;

  getExhibitDepInfo: (
    exhibitId: string,
    query: {
      /**
       * 展品依赖的作品ID,多个用逗号分隔
       */
      articleNids: string;
    }
  ) => Promise<GetExhibitDepInfoResult>;
  getSignStatistics: (query?: {
    /**
     * 标的物名称，这里指展品名称
     */
    keywords: string;
  }) => Promise<GetSignStatisticsResult>;
  setUserData: (data: any) => Promise<any>;
  getUserData: () => Promise<any>;
  getSelfWidgetRenderName: () => string;
  callAuth: () => void;
  addAuth: (
    exhibitId: string,
    options?: { immediate: boolean }
  ) => Promise<AddAuthResult>;
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
