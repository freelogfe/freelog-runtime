import { placeHolder } from '../../base'

// TODO  需要给data或params定义类型 

export type Presentable = {
    getPagingData: any;
    getByPresentableId: any;
    getByResourceIdOrName: any;
    getTestPagingData: any;
    getTestByPresentableId: any;
    getTestByResourceIdOrName: any;
};

const presentable: Presentable = {

    getPagingData: {
        url: 'presentables',
        method: 'GET',
        params: {
            nodeId: 'string',
            skip: 'string',
            limit: 'string',
            resourceType: 'string',
            omitResourceType: 'string',
            onlineStatus: 'string',
            tags: 'string',
            projection: 'string',
            keywords: 'string',
            isLoadVersionProperty: 'string',
            isLoadPolicyInfo: 'string'
        }
    },
    // presentableId, result|info|resourceInfo|fileStream
    getByPresentableId: {
        url: `auths/presentables/${placeHolder}/${placeHolder}`,
        method: 'GET'
    },
    // nodeId  resourceIdOrName   result|info|resourceInfo|fileStream
    getByResourceIdOrName: {
        url: `auths/presentables/nodes/${placeHolder}/${placeHolder}/${placeHolder}`,
        method: 'GET'
    },
    getTestPagingData: {
        url: `testNodes/${placeHolder}/testResources`,
        method: 'GET',
        params: {
            nodeId: 'string',
            skip: 'string',
            limit: 'string',
            resourceType: 'string',
            onlineStatus: 'string',
            tags: 'string',
            omitResourceType: 'string',
            keywords: 'string'
        }
    },
    // testResourceId, result|info|fileStream
    getTestByPresentableId: {
        url: `auths/testResources/${placeHolder}/${placeHolder}`,
        method: 'GET'
    },
    // testResourceId  resourceIdOrName   result|info|fileStream
    getTestByResourceIdOrName: {
        url: `auths/testResources/nodes/${placeHolder}/${placeHolder}/${placeHolder}`,
        method: 'GET'
    },
}
export default presentable