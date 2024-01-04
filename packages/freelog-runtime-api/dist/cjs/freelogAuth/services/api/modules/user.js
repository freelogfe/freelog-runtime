var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/freelogAuth/services/api/modules/user.ts
var user_exports = {};
__export(user_exports, {
  default: () => user_default
});
module.exports = __toCommonJS(user_exports);
var import_base = require("../../base");
var user = {
  login: {
    url: `passport/login`,
    method: "post",
    dataModel: {
      loginName: "string",
      password: "string",
      isRemember: "string",
      returnUrl: "string",
      jwtType: "string"
    }
  },
  loginVerify: {
    url: `users/verifyLoginPassword`,
    method: "get",
    dataModel: {
      password: "string"
    }
  },
  loginOut: {
    url: `passport/logout`,
    method: "get",
    params: {
      returnUrl: "string"
    }
  },
  getCurrent: {
    url: `users/current`,
    method: "get"
  },
  getAccount: {
    url: `accounts/individualAccounts/${import_base.placeHolder}`,
    method: "get"
  },
  postRegister: {
    url: `users`,
    method: "post",
    dataModel: {
      loginName: "string",
      password: "string",
      username: "string",
      authCode: "string"
    }
  },
  getAuthCode: {
    url: `messages/send`,
    method: "post",
    dataModel: {
      loginName: "string",
      authCodeType: "string"
    }
  },
  verifyAuthCode: {
    url: `messages/verify`,
    method: "get",
    dataModel: {
      authCode: "string",
      address: "string",
      authCodeType: "string"
    }
  },
  putResetPassword: {
    url: `users/${import_base.placeHolder}/resetPassword`,
    method: "put",
    dataModel: {
      password: "string",
      authCode: "string"
    }
  },
  putResetPayPassword: {
    url: `accounts/individualAccounts/resetPassword`,
    method: "put",
    dataModel: {
      loginPassword: "string",
      password: "string",
      authCode: "string",
      messageAddress: "string"
    }
  }
};
var user_default = user;
