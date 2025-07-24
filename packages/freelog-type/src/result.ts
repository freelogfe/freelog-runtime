import { unmountAppParams } from "./widget";
import { AxiosResponse } from "axios";
import { IApiDataFormat } from "./base";

import { SubItemInfo } from "./collection";
export interface WidgetController {
  success: boolean;
  name: string;
  unmount: (options?: unmountAppParams) => Promise<boolean>;
  reload: (destroy?: boolean) => Promise<boolean>;
  getData: () => any;
  clearData: () => any;
  forceSetData: (data: Record<PropertyKey, unknown>) => any;
  setData: (data: Record<PropertyKey, unknown>) => any;
  addDataListener: (dataListener: Function, autoTrigger?: boolean) => any;
  removeDataListener: (dataListener: Function) => any;
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
