import { unmountAppParams } from "./widget";
import { AxiosResponse, ResponseType } from "axios";
import { IApiDataFormat, PageResult, PlainObject } from "./base";
import {
  ExhibitInfo,
  AuthResult,
  SignItem,
  DependArticleInfo,
  SignCount,
} from "./exhibit";
import { SubItemInfo, ItemAuthResult, ItemDepTree } from "./collection";
import { ArticleTypeEnum as ArticleTypeEnum2 } from "./enum";
import { NodeInfo as NodeInfo2 } from "./base";
export type ArticleTypeEnum = ArticleTypeEnum2;
export type NodeInfo = NodeInfo2;
export { SubjectTypeEnum, FreelogUserInfo } from "./base";
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
