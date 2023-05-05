export interface PlainObject {
  [str: string]: any;
  [num: number]: any;
}
export interface NodeInfo {
  nodeId: number;
  nodeName: string;
  nodeDomain: string;
  ownerUserId: number;
  ownerUserName: string;
  nodeThemeId?: string;
  status?: number;
  uniqueKey?: string;
  tags: string[];
  nodeLogo?: string;
  nodeTitle?: string;
  nodeShortDescription?: string;
  nodeSuspendInfo?: string;
}
export interface FreelogUserInfo {
    [key: string]: any;
    userId: number;
    username: string;
}
export interface WidgetApp {
  unmount: (keeplocation: boolean) => Promise<null>;
  mount(): Promise<null>;
  update?(customProps: PlainObject): Promise<any>;
  getStatus():
    | 'NOT_LOADED'
    | 'LOADING_SOURCE_CODE'
    | 'NOT_BOOTSTRAPPED'
    | 'BOOTSTRAPPING'
    | 'NOT_MOUNTED'
    | 'MOUNTING'
    | 'MOUNTED'
    | 'UPDATING'
    | 'UNMOUNTING'
    | 'UNLOADING'
    | 'SKIP_BECAUSE_BROKEN'
    | 'LOAD_ERROR';
  loadPromise: Promise<null>;
  bootstrapPromise: Promise<null>;
  mountPromise: Promise<null>;
  unmountPromise: Promise<null>;
  getApi: () => PlainObject;
}
