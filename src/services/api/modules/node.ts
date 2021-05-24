import { placeHolder } from '../../base'

// TODO  需要给data或params定义类型 

export type Node = {
    getInfoById: any;
    getInfoByNameOrDomain: any; 
    postUserData: any;
    putUserData: any;
    getUserData: any;
};

const node: Node = {
    getInfoById: {
        url: `nodes/${placeHolder}`,
        method: 'GET' 
    },
    // presentableId, result|info|resourceInfo|fileStream
    getInfoByNameOrDomain: {
        url: `nodes/detail`,
        method: 'GET',
        dataModel: {
            nodeName: 'string',
            nodeDomain: 'string' 
        }
    },
    // storages/buckets/.UserNodeData/objects   post
    postUserData: {
        url: `storages/buckets/.UserNodeData/objects/${placeHolder}`,
        method: 'POST' 
    },
    // storages/buckets/.UserNodeData/objects/{nodeId}  PUT
    putUserData: {
        url: `storages/buckets/.UserNodeData/objects/${placeHolder}`,
        method: 'PUT' 
    },
    // storages/buckets/.UserNodeData/objects/{objectIdOrNodeId}/customPick  GET
    getUserData: {
        url: `storages/buckets/.UserNodeData/objects/${placeHolder}`,
        method: 'GET' 
    }
}
export default node