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
        url: `storages/buckets/.UserNodeData/objects`,
        method: 'POST',
        dataModel: {
            nodeId: 'int',
            nodeDomain: "string",
            userNodeData: "object"
        }
    },
    // storages/buckets/.UserNodeData/objects/{nodeId}  PUT
    putUserData: {
        url: `storages/buckets/.UserNodeData/objects/${placeHolder}`,
        method: 'PUT',
        dataModel: {
            "removeFields": ["name", "meta"],
            "appendOrReplaceObject": {
                "total": "如果没有此属性,则新增",
                "age": "如果存在此属性,则修改值"
            }
        }
    },
    // storages/buckets/.UserNodeData/objects/{objectIdOrNodeId}/customPick  GET
    getUserData: {
        url: `storages/buckets/.UserNodeData/objects/${placeHolder}/customPick`,
        method: 'GET',
        dataModel: {
            fields: "string"
        }
    }
}
export default node