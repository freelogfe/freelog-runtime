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
export interface WidgetController {
  success: boolean;
  name: string;
  unmount: (options?: unmountAppParams) => Promise<boolean>;
  reload: (destroy?: boolean) => Promise<boolean>;
  getData: () => any;
  clearData: () => any;
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

export type GetExhibitInfoResult = AxiosResponse<IApiDataFormat<ExhibitInfo[]>>;

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
