import { placeHolder } from '../../base'


const user = {}

user.getUserInfos = {
    url: '/api/userinfos',
    method: 'GET',
}

user.searchUser = {
    url: '/api/userinfos/detail',
    method: 'GET',
}

user.queryCurrent = {
    url: '/api/users/current',
    method: 'GET',
}

// TODO 使用namespace来做

user.login = {
    url: '/v1/passport/login',
    method: 'POST',
    dataModel: {
        loginName: 'string',
        password: 'string',
        mobile: 'string',
        jwtType: 'string',
        captcha: 'string',
    }
}

user.loginOut = {
    url: `/api/passport/logout`,
    method: 'get',
}

export default user;