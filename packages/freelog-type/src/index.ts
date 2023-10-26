import { WidgetApp, PlainObject, NodeInfo, FreelogUserInfo } from './interface';
// export const sum = (a: number, b: number) => {
//   if ('development' === process.env.NODE_ENV) {
//     console.log('boop');
//   }
//   return a + b;
// };
// @ts-ignore
const app = window.freelogApp;
export const freelogApp: FreelogApp = app;

export interface FreelogApp {
  initGlobalState:(state: any)=>any;
  nodeInfo: NodeInfo;
  status: {
    authUIMounted: boolean;
    themeMounted: boolean;
  };
  mountWidget: (options: {
    widget: any;
    container: HTMLElement | null;
    config?: PlainObject;
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
    options: { 
      returnUrl?: boolean,
      config?: {onUploadProgress: any,onDownloadProgress:any,responseType: any},
      subFilePath?: string
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
  getExhibitDepInfo: (
    exhibitId: string,
    articleNids: string,
  ) => Promise<any>;
  getSignStatistics: (keywords: string | number) => Promise<any>;
  getExhibitAvailalbe: (exhibitIds: string)  => Promise<any>;
  devData: PlainObject;
  getStaticPath: (path: string) => string;
  getSubDep: () => Promise<any>;
  getSelfArticleId: () => string;
  getSelfExhibitId: () => string;
  getSelfWidgetId: () => string;
  callAuth: () => void;
  addAuth: (exhibitId: string, options?: { immediate: boolean }) => Promise<any>;
  onLogin: (callback: Function) => void;
  onUserChange: (callback: Function) => void;
  callLogin: (callback: Function) => void;
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
}
