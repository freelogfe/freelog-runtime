import { placeHolder } from "../../base";

export type User = {
  login: any;
  loginOut: any;
  getCurrent: any;
  getAccount: any;
  getAuthCode: any;
  postRegister: any;
  putResetPassword: any;
  putResetPayPassword: any;
  verifyAuthCode: any;
  loginVerify: any;
};

const user: User = {
  login: {
    url: `passport/login`,
    method: "post",
    dataModel: {
      loginName: "string",
      password: "string",
      isRemember: "string",
      returnUrl: "string",
      jwtType: "string",
    },
  },
  loginVerify: {
    url: `users/verifyLoginPassword`,
    method: "get",
    dataModel: {
      password: "string",
    },
  },
  loginOut: {
    url: `passport/logout`,
    method: "get",
    params: {
      returnUrl: "string",
    },
  },
  getCurrent: {
    url: `users/current`,
    method: "get",
  },
  getAccount: {
    url: `accounts/individualAccounts/${placeHolder}`,
    method: "get",
  },
  postRegister: {
    url: `users`,
    method: "post",
    dataModel: {
      loginName: "string",
      password: "string",
      username: "string",
      authCode: "string",
    },
  },
  getAuthCode: {
    url: `messages/send`,
    method: "post",
    dataModel: {
      loginName: "string",
      authCodeType: "string",
    },
  },
  verifyAuthCode: {
    url: `messages/verify`,
    method: "get",
    dataModel: {
      authCode: "string",
      address: "string",
      authCodeType: "string"
    },
  },
  putResetPassword: {
    url: `users/${placeHolder}/resetPassword`,
    method: "put",
    dataModel: {
      password: "string",
      authCode: "string",
    },
  },
  putResetPayPassword: {
    url: `accounts/individualAccounts/resetPassword`,
    method: "put",
    dataModel: {
      loginPassword: "string",
      password: "string",
      authCode: "string",
      messageAddress: "string",
    },
  },
};

export default user;
