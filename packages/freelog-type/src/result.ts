import { unmountAppParams } from "./widget";
import { AxiosResponse } from "axios";
import { IApiDataFormat } from "./base";

import { SubItemInfo } from "./collection";
export interface WidgetController {
  /**
   * 子插件是否成功加载
   */
  success: boolean;
  /**
   * 子插件渲染id  widgetRenderName
   */
  name: string;
  /**
   * 卸载插件
   */
  unmount: (options?: unmountAppParams) => Promise<boolean>;
  /**
   *  @param destroy 重新渲染时是否彻底删除缓存值，可选
   */
  reload: (destroy?: boolean) => Promise<boolean>;
  /**
   * 获取子插件数据
   */
  getData: () => any;
  /**
   * 清除发送给子插件的数据
   */
  clearData: () => any;
  /**
   * 发送数据给子插件，子插件通过 widgetApi.addDataListener 监听获取
   */
  setData: (data: Record<PropertyKey, unknown>) => any;
  /**
   * 方法拥有和 setData 一样的参数和行为，唯一不同的是 forceSetData 会强制发送数据，无论数据是否变化
   */
  forceSetData: (data: Record<PropertyKey, unknown>) => any;
  /**
   * 监听子插件dipatch过来的数据
   * @param dataListener 监听函数
   * @param autoTrigger 是否立刻触发一次监听函数，默认值为 false
   */
  addDataListener: (dataListener: Function, autoTrigger?: boolean) => any;
  /**
   * 解绑监听函数
   * @param dataListener 监听函数
   */
  removeDataListener: (dataListener: Function) => any;
  /**
   * 清空所有绑定的监听函数
   */
  clearDataListener: () => any;
}
export type CollectionInfo = {
  exhibitId: string;
  totalItem: number;
  itemList: SubItemInfo[];
};
export type ResponseDataType<T> = AxiosResponse<IApiDataFormat<T>>;

export type AddAuthResult = {
  status: string | number;
  data: any;
};
