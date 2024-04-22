export interface PlainObject {
  [str: string]: any;
  [num: number]: any;
}


export interface WidgetApp {
  success: boolean;
  widgetId: string;
  getApi: () => PlainObject;
  unmount: (options?: unmountAppParams) => Promise<boolean>;
  reload: (destroy?: boolean) => Promise<boolean>;
  getData: () => any;
  clearData: () => any;
  setData: (data: Record<PropertyKey, unknown>) => any;
  addDataListener: (dataListener: Function, autoTrigger?: boolean) => any;
  removeDataListener: (dataListener: Function) => any;
  clearDataListener: () => any;
}
// unmountApp 参数配置
interface unmountAppParams {
  /**
   * destroy: 是否强制卸载应用并删除缓存资源，默认值：false
   * 优先级: 高于 clearAliveState
   * 对于已经卸载的应用: 当子应用已经卸载或keep-alive应用已经推入后台，则清除应用状态及缓存资源
   * 对于正在运行的应用: 当子应用正在运行，则卸载应用并删除状态及缓存资源
   */
  destroy?: boolean;
  /**
   * clearAliveState: 是否清空应用的缓存状态，默认值：false
   * 解释: 如果子应用是keep-alive，则卸载并清空状态，并保留缓存资源，如果子应用不是keep-alive，则执行正常卸载流程，并保留缓存资源
   * 补充: 无论keep-alive应用正在运行还是已经推入后台，都将执行卸载操作，清空应用缓存状态，并保留缓存资源
   */
  clearAliveState?: boolean;
}
