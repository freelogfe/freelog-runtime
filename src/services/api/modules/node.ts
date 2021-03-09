import { placeHolder } from '../../base'

// TODO  需要给data或params定义类型 

export type Node = {
    getInfoById: any;
    getInfoByNameOrDomain: any; 
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
        params: {
            nodeName: 'string',
            nodeDomain: 'string' 
        }
    }
}
export default node