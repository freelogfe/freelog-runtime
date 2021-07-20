
/**
 * 节点集合
 * {
 *   row: 0,    // 固定的
 *   column: 0, //在不同排列中不同
 *   relations: []
 * }
 */
interface Node {
  row: number,  
  column: number,
  relations: Array<string>
}
let nodes = new  Map<any, Node>() 

// 最少交叉的金字塔
let bestPyramid = {
    crosses: 0,
    pyramid: null 
}

/**
 * 如果出现多个最少交叉的，先按交叉数保存起来，最后再取出跟bestPyramid交叉数一样的
 * 此对象数组中不包含bestPyramid中的pyramid
 * {
 *   0:[],
 *   1:[], 
 * }
 */
let betterPyramids = {}

 /**
 * 分层工具  同时记录节点信息
 * @param data 
 *  
 */
function getPyramid(policy: any) {
 /**
   * 数据结构：
   *   节点：状态本身和层级，下一状态的集合
   *   路径：每一个
   *   金字塔：二维数组，记录每个节点的层级
   * 1.找到所有路径
   * 2.明确层级
   *   2.1 以初始状态往下找到所有层（遇环停止且不记录）
   *   2.2 向上去重
   */
  const policyMaps: any = [];
  const policyPyramid: Array<any> = [];
  function findNext(status: any, route: any) {
    // 准备下一层的
    status.transitions.forEach((to: any, index: number) => {
      // cycle test
      let isExist = route.some((x: any) => x[0] === to.toState);
      const event = to;
      // prepare for next route
      const nextRoute = [...route];
      nextRoute.push([to.toState, event, policy[to.toState]]);
      if (isExist) {
        policyMaps.push(nextRoute);
        return;
      }
      // 保存节点信息
      const node = nodes.get(to.toState) || {row: 0, column: 0,relations: []}
      !node.relations.includes(status) && node.relations.push(status)
      node.row = nextRoute.length - 1
      const currentLevel = policyPyramid[nextRoute.length - 1] || [];
      let flag = true;
      // 是否在上层存在，存在即删除
      policyPyramid.forEach((item: any, level: number) => {
        // 1.删除上层的，
        [...item].forEach((it: any, index: number) => {
          if (it.status === to.toState) {
            if (nextRoute.length - 1 >= level) {
              item.splice(index, 1);
            } else {
              // 2.如果下层有则不加入当前层
              flag = false;
            }
          }
        });
      });
      flag && currentLevel.push({ status: to.toState, ...policy[to.toState] });
      policyPyramid[nextRoute.length - 1] = currentLevel;
      // route end
      if (!policy[to.toState].transitions.length) {
        policyMaps.push(nextRoute);
        return;
      }
      // next route  同层往下都携带同一个下一层nextLevel
      findNext(policy[to.toState], nextRoute);
    });
  }
  if (!policy.initial.transitions) {
    return [[["initial", "", policy.initial]]];
  }
  policyPyramid.push([{ status: "initial", ...policy.initial }]);
  findNext(policy.initial, [["initial", "", policy.initial]]);
  // 去除空的层级
  [...policyPyramid].forEach((item: any, index: number) => {
    item && !item.length && policyPyramid.splice(index, 1);
  });
  let maxWidth = 0;
  policyPyramid.forEach((item: any) => {
    maxWidth = item.length > maxWidth ? item.length : maxWidth;
  });
  console.log(policyPyramid);
  return { policyMaps, policyPyramid: { policyPyramid, maxWidth } };
}

/**
 * 计算所有交叉
 */
function getCrosses(){

}

/**
 * 1.分层并记录节点信息  getPyramid
 * 2.按最大层，排列组合 找出最少交叉
 * @param data 
 */
export default function getBestTopology(data: any) {
  
}

