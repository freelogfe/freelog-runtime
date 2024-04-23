import {
  ContractLicenseeIdentityTypeEnum,
  ContractStatusEnum,
  SubjectTypeEnum,
} from "egg-freelog-base";
export interface ContractInfo {
  contractId: string;
  contractName: string;

  // 甲方相关信息
  licensorId: string | number;
  licensorName: string;
  licensorOwnerId: number;
  licensorOwnerName: string;

  // 乙方相关信息
  licenseeId: string | number;
  licenseeName: string;
  licenseeOwnerId: number;
  licenseeOwnerName: string;
  licenseeIdentityType: ContractLicenseeIdentityTypeEnum;

  // 标的物相关信息
  subjectId: string;
  subjectName: string;
  subjectType: SubjectTypeEnum;

  // 合同状态机部分
  fsmCurrentState?: string | null;
  fsmRunningStatus?: number;
  fsmDeclarations?: object;

  // 其他信息
  policyId: string;
  status?: ContractStatusEnum;
  authStatus: number;
  createDate?: Date;

  isAuth?: boolean;
  isTestAuth?: boolean;
}

export interface FsmDescriptionInfo {
  [stateName: string]: FsmStateDescriptionInfo;
}

export interface FsmStateDescriptionInfo {
  isAuth: boolean;
  isTestAuth: boolean;
  isInitial?: boolean;
  isTerminate?: boolean;
  serviceStates: string[];
  transitions: PolicyEventInfo[];
}

export interface PolicyEventInfo {
  code: string;
  service: string;
  name: string;
  eventId: string;
  toState: string;
  args?: {
    [paramName: string]: any;
  };
}
export interface BasePolicyInfo {
  policyId: string;
  policyText: string;
  subjectType?: number;
  fsmDescriptionInfo: FsmDescriptionInfo;
  fsmDeclarationInfo?: any;
  translateInfo?: any;
}
