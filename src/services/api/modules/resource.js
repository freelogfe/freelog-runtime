import { placeHolder } from '../../base'

// TODO  需要给data或params定义类型 
const resource = {}

// 用户管理
resource.getResources = {
    url: '/api/resources/count',
    method: 'GET',
    params: {
        userIds: 'string'
    }
}
export default resource;