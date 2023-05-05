import { WidgetApp, PlainObject, NodeInfo, FreelogUserInfo } from './interface';
export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }
  return a + b;
};
// @ts-ignore
const app = window.freelogApp;
export const freelogApp: FreelogApp = app;

export interface FreelogApp {
  nodeInfo: NodeInfo;
  status: {
    authUIMounted: boolean;
    themeMounted: boolean;
  };
  mountWidget: (options: {
    widget: any;
    container: HTMLElement;
    topExhibitData: any;
    config: PlainObject;
    seq?: number | null;
    widget_entry?: boolean | string;
  }) => WidgetApp;
  getExhibitListById: (query: {
    exhibitIds: string;
    isLoadVersionProperty: 0 | 1;
  }) => any;
  getExhibitListByPaging: (query: {
    skip: number;
    limit: number;
    sort: string;
    articleResourceTypes: string;
    omitArticleResourceType: string;
    onlineStatus: number;
    tags: string;
    projection: string;
    keywords: string;
    isLoadVersionProperty: number;
    isLoadPolicyInfo: number;
    isTranslate: number;
    tagQueryType: number;
  }) => any;
  getExhibitInfo: (
    exhibitId: string,
    query: {
      exhibitIds: string;
      isLoadVersionProperty: 0 | 1;
    }
  ) => any;
  getExhibitSignCount: (exhibitId: string) => any;
  getExhibitAuthStatus: (exhibitId: string) => any;
  getExhibitFileStream: (
    exhibitId: string,
    returnUrl?: boolean,
    config?: PlainObject
  ) => any;
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
  ) => any;
  // getExhibitInfoByAuth,
  // getExhibitDepInfo,
  getSignStatistics: (keywords: string | number) => any;
  getExhibitAvailalbe: (exhibitIds: string) => any;
  devData: PlainObject;
  getStaticPath: (path: string) => string;
  getSubDep: () => any;
  getSelfId: () => string;
  callAuth: () => void;
  addAuth: (exhibitId: string, options?: { immediate: boolean }) => void;
  onLogin: (callback: Function) => void;
  onUserChange: (callback: Function) => void;
  callLogin: () => void;
  callLoginOut: () => void;
  getCurrentUser: () => FreelogUserInfo;
  setViewport: (options: {
    width: string; // immutable
    height: string; // not supported in browser
    'initial-scale': number; // 0.0-10.0   available for theme
    'maximum-scale': number; // 0.0-10.0   available for theme
    'minimum-scale': number; // 0.0-10.0   available for theme
    'user-scalable': string; // available for theme
    'viewport-fit': string; // not supported in browser
  }) => void;
  setUserData: (key: string | number, data: string | number) => any;
  getUserData: (key: string | number) => any;
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
