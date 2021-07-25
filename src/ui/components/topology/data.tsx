/**
 * 节点集合
 * {
 *   row: 0,    // 固定的
 *   column: 0, //在不同排列中不同
 *   relations: []
 * }
 */
interface Node {
  row: number;
  column: number;
  relations: Array<string>;
  route: Array<string>;
}
let nodesMap = new Map<any, Node>();

function getRouteMaps(policy: any): any {
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
  findNext(policy.initial, [["initial", "", policy.initial]]);
  return policyMaps
}
/**
 * 分层工具  同时记录节点信息
 * @param policy
 * 如果ba
 */

function getPyramid(policy: any): any {
  const pyramid: any = []
  function findNextLevel(level: number) {
    const currentLevel = pyramid[level] || []
    console.log('currentLevel', currentLevel, pyramid[level - 1])
    // 遍历上层的所有节点
    pyramid[level - 1].forEach((pre: any) => {
      // 拿出节点信息 
      const nodeData = nodesMap.get(pre.status) || {
        row: 0,
        column: 0,
        relations: [],
        route: ['initial']
      };
      pre.transitions.forEach((next: any, index: number) => {
        if(next.toState === 'g') console.log(nodeData)
        // 拿出节点信息
        const toNodeData = nodesMap.get(next.toState) || {
          row: 0,
          column: 0,
          relations: [],
          route: []
        };
        // @ts-ignore 先考虑relations中有没有出现过，如果出现过就是环，则忽略
        // 这里有问题，并没有一直往上找，而是只找了上级
        if (nodeData.route.includes(next.toState)) {
          // 反转,即面向对象，忽略箭头，此时pre与next也建立连接
          !nodeData.relations.includes(next.toState) && !toNodeData.relations.includes(pre.status) && nodeData.relations.push(next.toState);
          return
        }
        
        // 保存上层过来的对应节点
        !toNodeData.relations.includes(pre.status) && toNodeData.relations.push(pre.status);
        toNodeData.row = level; // 此时的层是准确的，在后面向上去重也不会影响，因为会保留最后一个
        // 需要去重，这里是所有到达此节点的路径节点
        toNodeData.route = [...nodeData.route, ...toNodeData.route, next.toState] // 节点自己以及上级的route
        nodesMap.set(next.toState, toNodeData)
        // 再考虑同层去重
        if (!(currentLevel.some((item: any) => item.status === next.toState))) {
          currentLevel.push({ status: next.toState, ...policy[next.toState] })
        }
      })
    })
    if (!currentLevel.length) return
    pyramid[level] = currentLevel
    findNextLevel(level + 1)
  }
  // 第一层已经有了
  pyramid.push([{ status: "initial", ...policy.initial }]);
  // 开始找第一层的所有子节点即第二层
  findNextLevel(1);
  let maxWidth = 0
  // 向上去重
  for (let aRow = pyramid.length - 1; aRow > 0; aRow--) {
    const layer = pyramid[aRow];
    maxWidth < layer.length && (maxWidth = layer.length)
    // 选一个a并比较当层和上面所有层的中列大于a的
    layer.forEach((a: any, aColumn: number) => {
      // 同层已经没有重复的了
      for (let bRow = aRow - 1; bRow > -1; bRow--) {
        pyramid[bRow] = pyramid[bRow].filter((b: any, bColumn: number) => b.status !== a.status);
      }
    });
  }
  maxWidth < pyramid[0].length && (maxWidth = pyramid[0].length)
  return { policyPyramid: pyramid, maxWidth }
}
// @ts-ignore
Array.prototype.equals = function (array: any) {
  // if the other array is a falsy value, return
  if (!array) return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });
/**
 *
 * @param contents 去重
 * @returns
 */
function norepeat(contents: any) {
  var norepeatContents = [];
  for (var i = 0; i < contents.length; i++) {
    const flag = norepeatContents.some((item: any) => {
      return item.equals(contents[i]);
    });
    if (!flag) {
      norepeatContents.push(contents[i]);
    }
  }
  return norepeatContents;
}

/**
 *
 * @param 全排列
 */
function fullSort(input: any) {
  var permArr: any = [],
    usedChars: any = [];
  function main(input: any) {
    var i, ch;
    for (i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0];
      usedChars.push(ch);
      if (input.length == 0) {
        permArr.push(usedChars.slice());
      }
      main(input);
      input.splice(i, 0, ch);
      usedChars.pop();
    }
    return permArr;
  }
  return main(input);
}

/**
 * 找到在第几列
 * @param status
 * @param pyramid
 * @returns
 */
function getColumn(status: string, pyramid: any) {
  let column = 0;
  pyramid.some((item: any) => {
    return item.some((node: any, index: number) => {
      column = index;
      return node && node.status === status;
    });
  });
  return column;
}
/**
 * 计算所有交叉
 */
function getCrosses(pyramid: any): number {
  let cross = 0;
  // 从最后一层开始
  for (let aRow = pyramid.length - 1; aRow > -1; aRow--) {
    const layer = pyramid[aRow];
    // 选一个a并比较当层和上面所有层的中列大于a的
    layer.forEach((a: any, aColumn: number) => {
      if (!a) return;
      const aNode = nodesMap.get(a.status);
      for (let bRow = aRow; bRow > -1; bRow--) {
        pyramid[bRow].forEach((b: any, bColumn: number) => {
          // a后面的列才判断
          if (bColumn > aColumn && b) {
            const bNode = nodesMap.get(b.status);
            // 此处都是上层  如果存在b的relations中的节点 c 的 column小于a的relations中d的column, 且b的row小于d的row
            // 但是如果是同样的列，会出现重叠，解决方案：1.此处要找出重叠  2.绘图时如果不从同一点画两条线且以折线方式
            // 选用方案2
            bNode?.relations.forEach((c: string) => {
              const cColumn = getColumn(c, pyramid);
              aNode?.relations.forEach((d: string) => {
                const dRow = nodesMap.get(d);
                // @ts-ignore  如果是大于bRow的就是ad与bc无法产生交叉，因为bc的层都在ad上
                if (dRow?.row >= bRow) return;
                const dColumn = getColumn(d, pyramid);
                if (cColumn < dColumn) cross++;
              });
            });
          }
        });
      }
    });
  }
  return cross;
}

/**
 * 1.分层并记录节点信息  getPyramid
 * 2.按最大层，排列组合 找出最少交叉
 * @param data
 */
export default function getBestTopology(data: any): any {
  nodesMap = new Map<any, Node>();
  // 最少交叉的金字塔
  let bestPyramid: any = null;

  /**
   * 如果出现多个最少交叉的，先按交叉数保存起来，最后再取出跟bestPyramid交叉数一样的
   * 此对象数组中不包含bestPyramid中的pyramid
   * {
   *   0:[],
   *   1:[],
   * }
   */
  let betterPyramids: any = {};
  // bestPyramid betterPyramids
  const { policyPyramid, maxWidth } = getPyramid(data);
  console.log(nodesMap, policyPyramid)
  // return
  /**
   * 每一层所有组合方式，与其余层所有组合方式再组合
   */
  // 三维数组
  const allLevel: any = [];
  policyPyramid.forEach((item: any) => {
    const arr = [...item];
    for (var i = item.length; i < maxWidth; i++) {
      arr[i] = null;
    }
    // 每一层没有重复组合的
    allLevel.push(norepeat(fullSort(arr)));
  });
  console.log('allLevel', allLevel);
  let count = 0
  // 从每一层取一个  深度优先
  function compose(nextLevel: any, index: number, _pyramid: any) {
    nextLevel.forEach((layer: any, i: number) => {
      // 取一个
      const pyramid = [..._pyramid]
      pyramid.push(layer);
      if (index + 1 === allLevel.length) {
        // getCross for this tower      bestPyramid    betterPyramids
        const crosses = getCrosses(pyramid);
        if (!crosses) {
          count++
        }
        if (!bestPyramid || crosses < bestPyramid.crosses) {
          bestPyramid = {
            crosses,
            pyramid,
          };
          betterPyramids = {};
        } else if (crosses === bestPyramid.crosses) {
          const arr = (betterPyramids[crosses] || [])
          arr.push(pyramid);
          betterPyramids[crosses] = arr
        }
        return;
      }
      compose(allLevel[index + 1], index + 1, [...pyramid]);
    });
  }
  // 从第一层开始
  compose(allLevel[0], 0, []);
  console.log('zero', count)
  const policyMaps = getRouteMaps(data)
  return { policyMaps, bestPyramid, betterPyramids };
}
