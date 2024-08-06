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
import {
  SubjectTypeEnum as SubjectTypeEnum2,
  FreelogUserInfo as FreelogUserInfo2,
} from "./base";
export type ArticleTypeEnum = ArticleTypeEnum2;
export type NodeInfo = NodeInfo2;
export type FreelogUserInfo = FreelogUserInfo2;
export type SubjectTypeEnum = SubjectTypeEnum2;

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

export type GetExhibitListByIdResult = AxiosResponse<
  IApiDataFormat<ExhibitInfo[]>
>;

export type GetExhibitListByPagingResult = AxiosResponse<
  IApiDataFormat<PageResult<ExhibitInfo>>
>;
export type GetExhibitRecommendResult = AxiosResponse<
  IApiDataFormat<ExhibitInfo[]>
>;
export type GetCollectionSubListResult = AxiosResponse<
  IApiDataFormat<SubItemInfo[]>
>;
export type GetCollectionSubInfoResult = AxiosResponse<
  IApiDataFormat<SubItemInfo[]>
>;
export type GetCollectionSubAuthResult = AxiosResponse<
  IApiDataFormat<ItemAuthResult[]>
>;
export type GetCollectionSubDepListResult = AxiosResponse<
  IApiDataFormat<ItemDepTree[]>
>;
export type GetExhibitInfoResult = AxiosResponse<IApiDataFormat<ExhibitInfo>>;

export type GetExhibitSignCountResult = AxiosResponse<
  IApiDataFormat<SignItem[]>
>;

export type GetExhibitAuthStatusResult = AxiosResponse<
  IApiDataFormat<AuthResult[]>
>;

export type GetExhibitAvailableResult = AxiosResponse<
  IApiDataFormat<AuthResult[]>
>;

export type GetExhibitDepInfoResult = AxiosResponse<
  IApiDataFormat<DependArticleInfo[]>
>;

export type GetSignStatisticsResult = AxiosResponse<
  IApiDataFormat<SignCount[]>
>;

export type AddAuthResult = {
  status: string | number;
  data: any;
};
