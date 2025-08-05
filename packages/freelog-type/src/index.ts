import { ResponseType } from "axios";
import { NodeInfo, PlainObject, PageResult, FreelogUserInfo } from "./base";
import { MountExhibitWidgetOptions, MountArticleWidgetOptions } from "./widget";

import {
  WidgetController,
  ResponseDataType,
  AddAuthResult,
  CollectionInfo,
} from "./result";
import { ExhibitDependencyNodeInfo } from "./exhibit";
export * from "./base";
export * from "./result";
export * from "./exhibit";
export * from "./collection";
export * from "./enum";
import {
  ExhibitInfo,
  AuthResult,
  SignItem,
  DependArticleInfo,
  SignCount,
} from "./exhibit";
import { SubItemInfo, ItemAuthResult, ItemDepTree } from "./collection";
interface GetLibraryEntryUrlsResult {
  jsEntryUrl: string;
  cssEntryUrl: string;
  metaJson: {
    nameSpace: string;
    js: {
      entry: string;
      other: string[] | [];
    };
    css: {
      entry: string;
      other: string[] | [];
    };
    other: string[] | [];
  };
  baseUrl: string;
  version: string;
}

export interface FreelogLibraryType {
  getLibraryEntryUrls(resourceName: string): Promise<GetLibraryEntryUrlsResult>;
  loadLibraryJs(jsUrl: string, metaJson: any): Promise<any>;
  loadLibraryCss(cssUrl: string): void;
  dependencyTrees: Array<{
    [Property in keyof ItemDepTree]-?: ItemDepTree[Property];
  }>;
}

export let widgetApi: WidgetApi = {} as WidgetApi;
export let freelogApp: FreelogApp = {} as FreelogApp;
export const initFreelogApp = () => {
  const app = window.microApp?.getData().freelogApp;
  freelogApp = app;
  widgetApi = window.microApp;

  const obj = {};
  const proxyObj = new Proxy(obj, {
    get(target: any, key: string) {
      const holdKeys = [
        "getLibraryEntryUrls",
        "loadLibraryJs",
        "loadLibraryCss",
      ];
      const promiseResultKeys = ["getLibraryEntryUrls", "loadLibraryJs"];
      if (holdKeys.indexOf(key) !== -1) {
        if (promiseResultKeys.indexOf(key) !== -1) {
          return async function (...arg: any[]) {
            const result = await (window as any).rawWindow.FreelogLibrary[key](
              ...arg,
              window
            );
            return result;
          };
        } else {
          return function (...arg: any[]) {
            (window as any).rawWindow.FreelogLibrary[key](...arg, window);
          };
        }
      }
      return (window as any).rawWindow.FreelogLibrary[key];
    },
  }) as FreelogLibraryType;
  (window as any).FreelogLibrary = proxyObj;

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
  getStaticPath: (
    /**
     * 静态资源路径，以/开头。
     */
    path: string
  ) => string;
  // devData: PlainObject;
  getCurrentUser: () => FreelogUserInfo;
  mountArticleWidget: (
    options: MountArticleWidgetOptions
  ) => Promise<WidgetController>;
  mountExhibitWidget: (
    options: MountExhibitWidgetOptions
  ) => Promise<WidgetController>;
  getTopExhibitId: () => string;
  getSelfNid: () => string;
  getSelfProperty: (isFromServer?: boolean) => Promise<PlainObject>;
  getSelfDependencyTree: (
    isFromServer?: boolean
  ) => Promise<ExhibitDependencyNodeInfo[]>;
  getExhibitById: (
    /**
     * 展品ID
     */
    exhibitId: string,
    query?: {
      /**
       * 是否加载授权信息: 0:不加载， 1:加载，默认0
       */
      authInfo?: 0 | 1;
      /**
       * 是否响应展品版本属性，包含依赖信息。默认0 否
       */
      isLoadVersionProperty?: 0 | 1;
    }
  ) => Promise<ResponseDataType<ExhibitInfo>>;
  getExhibitListById: (query: {
    /**
     * 展品ID,多个用逗号分隔
     */
    exhibitIds: string;
    /**
     * 是否响应展品版本属性，包含依赖信息。默认0 否
     */
    isLoadVersionProperty?: 0 | 1;
  }) => Promise<ResponseDataType<ExhibitInfo[]>>;
  getExhibiListAuthById: (query: {
    /**
     * 展品ID,多个用逗号分隔
     */
    exhibitIds: string;
    /**
     * 是否响应展品版本属性，包含依赖信息。默认0 否
     */
    isLoadVersionProperty?: 0 | 1;
  }) => Promise<ResponseDataType<ExhibitInfo[]>>;
  getExhibitListByPage: (query: {
    /**
     * 跳过的数量.默认为0.
     */
    skip: number;
    /**
     * 本次请求获取的数据条数.一般不允许超过100
     */
    limit: number;
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
     * 是否响应展品版本属性，包含依赖信息。默认0 否
     */
    isLoadVersionProperty?: 0 | 1;
  }) => Promise<ResponseDataType<PageResult<ExhibitInfo>>>;
  getExhibitListAuthByPage: (query: {
    /**
     * 默认 0，传 1 则返回所有信息，否则只有授权信息
     */
    allInfo?: 0 | 1;
    /**
     * 跳过的数量.默认0
     */
    skip: number;
    /**
     * 本次请求获取的数据条数.一般不允许超过100
     */
    limit: number;
    /**
     * 排序,格式为{排序字段}:{1|-1},1是正序,-1是倒序
     */
    sort?: string;
    /**
     * 过滤选项：筛选符合的作品资源类型,多个用逗号分隔
     */
    articleResourceTypes?: string;
    /**
     * 排除选项：筛选不包含的作品资源类型,与 articleResourceTypes 二选一，若同时传递 则忽略omitArticleResourceType，
     */
    omitArticleResourceType?: string;
    /**
     * 过滤选项：筛选上线状态 (0:下线 1:上线 2:全部) 默认1
     */
    onlineStatus?: number;
    /**
     * 过滤选项：用户创建展品时设置的自定义标签,多个用","分割
     */
    tags?: string;
    /**
     * 过滤选项：tags的查询方式1:任意匹配一个标签 2:全部匹配所有标签 默认1
     */
    tagQueryType?: number;
    /**
     * 指定返回的字段,多个用逗号分隔
     */
    projection?: string;
    /**
     * 过滤选项：搜索关键字,目前支持模糊搜索节点资源名称和资源名称
     */
    keywords?: string;
    /**
     * 是否响应展品版本信息，包含依赖信息。默认0 否
     */
    isLoadVersionProperty?: 0 | 1;
  }) => Promise<ResponseDataType<PageResult<ExhibitInfo>>>;
  getExhibitAuthStatus: (
    /**
     * 展品ID,多个用逗号分隔
     */
    exhibitIds: string
  ) => Promise<ResponseDataType<AuthResult[]>>;
  getExhibitFileStream: (
    /**
     * 展品ID
     */
    exhibitId: string,
    options?: {
      /**
       * 是否仅返回文件 URL，默认为false
       */
      returnUrl?: boolean;
      /**
       * 允许的axios的请求配置项
       */
      config?: {
        onUploadProgress?: (progressEvent: any) => void;
        onDownloadProgress?: (progressEvent: any) => void;
        timeout?: number;
        responseType?: ResponseType;
      };
      /**
       * 指定子文件路径，例如漫画中的图片等子文件的路径
       */
      subFilePath?: string;
    }
  ) => Promise<any | string>;
  getExhibitRecommend: (
    /**
     * 展品ID
     */
    exhibitId: string,
    query: {
      /**
       * 推荐指标多个用逗号分隔,优先级也按照实际顺序来, 具体指标为
       * sameAuthorAndType: 同作者同资源类型
       * sameTagAndType:同类型同标签(部分)
       * sameType:同类型
       * latestCreate:最新创建的
       */
      recommendNorm?: string;
      /**
       * 推荐数量，默认10，最大 100
       */
      size?: number;
    }
  ) => Promise<ResponseDataType<ExhibitInfo[]>>;
  getExhibitSignCount: (
    /**
     * 多个展品id，用逗号分隔
     */
    exhibitIds: string
  ) => Promise<ResponseDataType<SignItem[]>>;

  getExhibitAvailable: (
    /**
     * 多个展品id，用逗号分隔
     */
    exhibitIds: string
  ) => Promise<ResponseDataType<AuthResult[]>>;

  getExhibitDepInfo: (
    /**
     * 展品ID
     */
    exhibitId: string,
    query: {
      /**
       * 展品依赖的作品ID,多个用逗号分隔
       */
      articleNids: string;
    }
  ) => Promise<ResponseDataType<DependArticleInfo[]>>;
  getCollectionSubListByPage: (
    /**
     * 展品ID
     */
    exhibitId: string,
    query: {
      /**
       * 排序方式: 1:升序 -1:降序，默认1
       */
      sortType?: number;
      /**
       * 跳过的数量.默认0
       */
      skip: number;
      /**
       * 本次请求获取的数据条数.一般不允许超过100
       */
      limit: number;
      /**
       * 是否加载单品挂载的作品详情 0:不加载 1:加载，默认0
       */
      isShowDetailInfo?: number;
    }
  ) => Promise<ResponseDataType<PageResult<SubItemInfo>>>;
  getCollectionSubListAuthByPage: (
    /**
     * 展品ID
     */
    exhibitId: string,
    query: {
      /**
       * 默认 0，传 1 则返回所有信息，否则只有授权信息
       */
      allInfo?: 0 | 1;
      /**
       * 排序方式: 1:升序 -1:降序，默认1
       */
      sortType?: number;
      /**
       * 跳过的数量.默认0
       */
      skip: number;
      /**
       * 本次请求获取的数据条数.一般不允许超过100
       */
      limit: number;
      /**
       * 是否加载单品挂载的作品详情 0:不加载 1:加载，默认0
       */
      isShowDetailInfo?: number;
    }
  ) => Promise<ResponseDataType<PageResult<SubItemInfo>>>;
  getCollectionsSubListByPage: (
    /**
     * 多个展品id，用逗号分隔
     */
    exhibitIds: string,
    query: {
      /**
       * 排序方式: 1:升序 -1:降序，默认1
       */
      sortType?: number;
      /**
       * 跳过的数量.默认0
       */
      skip: number;
      /**
       * 本次请求获取的数据条数.一般不允许超过100
       */
      limit: number;
      /**
       * 是否加载单品挂载的作品详情 0:不加载 1:加载，默认0
       */
      isShowDetailInfo?: number;
    }
  ) => Promise<ResponseDataType<PageResult<CollectionInfo>>>;
  getCollectionSubById: (
    /**
     * 展品ID
     */
    exhibitId: string,
    query: {
      /**
       * 是否加载授权信息: 0:不加载， 1:加载，默认0
       */
      authInfo?: 0 | 1;
      /**
       * 单品ID
       */
      itemId: string;
    }
  ) => Promise<ResponseDataType<SubItemInfo>>;
  getCollectionSubListById: (
    /**
     * 展品ID
     */
    exhibitId: string,
    query: {
      /**
       * 单品ID,多个用“,”隔开
       */
      itemIds: string;
    }
  ) => Promise<ResponseDataType<SubItemInfo[]>>;
  getCollectionSubListAuthById: (
    /**
     * 展品ID
     */
    exhibitId: string,
    query: {
      /**
       * 单品ID,多个用“,”隔开
       */
      itemIds: string;
    }
  ) => Promise<ResponseDataType<SubItemInfo[]>>;
  getCollectionSubAuthStatus: (
    /**
     * 展品ID
     */
    exhibitId: string,
    query: {
      /**
       * 单品ID,多个用“,”隔开
       */
      itemIds: string;
    }
  ) => Promise<ResponseDataType<ItemAuthResult[]>>;

  getCollectionSubDepList: (
    /**
     * 展品ID
     */
    exhibitId: string,
    query: {
      /**
       * 单品ID
       */
      itemId: string;
    }
  ) => Promise<ResponseDataType<ItemDepTree[]>>;
  getCollectionSubFileStream: (
    /**
     * 展品ID
     */
    exhibitId: string,
    query: {
      /**
       * 单品ID
       */
      itemId: string;
      /**
       * 是否仅返回文件 URL，默认为false
       */
      returnUrl?: boolean;
      /**
       * 指定子文件路径，例如漫画中的图片等子文件的路径
       */
      subFilePath?: string;
    }
  ) => Promise<any | string>;
  getCollectionSubDepFileStream: (
    /**
     * 展品ID
     */
    exhibitId: string,
    query: {
      /**
       * 单品ID
       */
      itemId: string;
      /**
       * 依赖的链路id
       */
      nid: string; // 依赖的链路id
      /**
       * 是否仅返回文件 URL，默认为false
       */
      returnUrl?: boolean;
      /**
       * 指定子文件路径，例如漫画中的图片等子文件的路径
       */
      subFilePath?: string;
    }
  ) => Promise<any | string>;
  getExhibitDepFileStream: (
    /**
     * 展品ID
     */
    exhibitId: string,
    query: {
      /**
       * 依赖的链路id
       */
      nid: string;
      /**
       * 是否仅返回文件 URL，默认为false
       */
      returnUrl?: boolean;
      /**
       * 允许的axios的请求配置项
       */
      config?: {
        onUploadProgress?: (progressEvent: any) => void;
        onDownloadProgress?: (progressEvent: any) => void;
        timeout?: number;
        responseType?: ResponseType;
      };
      /**
       * 指定子文件路径，例如漫画中的图片等子文件的路径
       */
      subFilePath?: string;
    }
  ) => Promise<any | string>;

  getSignStatistics: (query?: {
    /**
     * 标的物名称，这里指展品名称
     */
    keywords: string;
  }) => Promise<ResponseDataType<SignCount[]>>;
  setUserData: (key: string, data: any) => Promise<any>;
  getUserData: (key: string) => Promise<ResponseDataType<PlainObject>>;
  deleteUserData: (key: string) => Promise<any>;
  getSelfWidgetRenderName: () => string;
  callAuth: () => void;
  addAuth: (
    /**
     * 展品ID
     */
    exhibitId: string,
    options?: {
      /**
       * 是否立即弹出授权框，默认false
       */
      immediate: boolean;
    }
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
  getShareUrl: (
    query: {
      /**
       * 展品ID
       */
      exhibitId: string;
      /**
       * 单品ID
       */
      itemId?: string;
    },
    type: string
  ) => string;
  mapShareUrl: (routeMap: {
    [str: string]: (
      /**
       * 展品ID
       */
      exhibitId: string,
      /**
       * 单品ID
       */
      itemId?: string
    ) => string;
  }) => void;
  getWechatShareURL: () => string;
  isWeChatOrQQ: () => boolean;
  updateWechatShare: (
    /**
     * 分享到微信QQ好友配置
     */
    appMessageShareData: {
      /**
       * 分享标题
       */
      title: string;
      /**
       * 分享描述
       */
      desc: string;
      /**
       * 分享图标
       */
      imgUrl: string;
      /**
       * 成功回调
       */
      success: () => void;
    },
    /**
     * 分享到微信朋友圈QQ空间配置
     */
    timelineShareData: {
      /**
       * 分享标题
       */
      title: string;

      /**
       * 分享图标
       */
      imgUrl: string;
      /**
       * 成功回调
       */
      success: () => void;
    }
  ) => Promise<string>;
}
