import { placeHolder } from "../../base";

export type User = {
  login: any;
  loginOut: any;
  getCurrent: any;
};

const user = {
  login: {
    url: `passport/login`,
    method: "post",
    params: {
      loginName: "string",
      password: "string",
      isRemember: "string",
      returnUrl: "string",
      jwtType: "string",
    },
  },
  loginOut: {
    url: `passport/logout`,
    method: "post",
    params: {
      returnUrl: "string",
    },
  },
  getCurrent: {
    url: `users/current`,
    method: "get",
  }
};

// user.getUserInfos = {  passport/logout?returnUrl={returnUrl}
//     url: '/api/userinfos',
//     method: 'GET',
// }

// user.searchUser = {
//     url: '/api/userinfos/detail',
//     method: 'GET',
// }

// user.queryCurrent = {
//     url: '/api/users/current',
//     method: 'GET',
// }

// user.login = {
//     url: '/v1/passport/login',
//     method: 'POST',
//     dataModel: {
//         loginName: 'string',
//         password: 'string',
//         mobile: 'string',
//         jwtType: 'string',
//         captcha: 'string',
//     }
// }

// user.loginOut = {
//     url: `/api/passport/logout`,
//     method: 'get',
// }

export default user;
