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
}
let nodes = new Map<any, Node>();

/**
 * 分层工具  同时记录节点信息
 * @param data
 *
 */
function getPyramid(policy: any): any {
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
      const node = nodes.get(to.toState) || {
        row: 0,
        column: 0,
        relations: [],
      };
      !node.relations.includes(status) && node.relations.push(status);
      node.row = nextRoute.length - 1;
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
  return { policyMaps, policyPyramidData: { policyPyramid, maxWidth } };
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

// 最少交叉的金字塔
let bestPyramid:any = null;

/**
 * 如果出现多个最少交叉的，先按交叉数保存起来，最后再取出跟bestPyramid交叉数一样的
 * 此对象数组中不包含bestPyramid中的pyramid
 * {
 *   0:[],
 *   1:[],
 * }
 */
let betterPyramids: any = {};

/**
 * 找到在第几列
 * @param status 
 * @param pyramid 
 * @returns 
 */
function getColumn(status:string, pyramid:any){
  let column = 0
  pyramid.forEach((item:any)=>{
    item.some((node:string, index: number)=>{
      column = index
      return node === status
    })
  })
  return column
}
/**
 * 计算所有交叉
 */
function getCrosses(pyramid: any):number {
  let cross = 0
  // 从最后一层开始
  for (let aRow = 0; aRow < pyramid.length; aRow++) {
    const layer = pyramid[aRow];
    // 选一个a并比较当层和上面所有层的中列大于a的
    layer.forEach((a:any, aColumn: number)=>{
      if(!a) return
      const aNode = nodes.get(a)
      for (let bRow = aRow; bRow < pyramid.length; bRow++) {
        pyramid[bRow].forEach((b:any, bColumn:number)=>{
          // a后面的列才判断
          if(bColumn > aColumn && b){
            const bNode = nodes.get(b)
            // 此处都是上层  如果存在b的relations中的节点 c 的 column大于a的relations中d的column, 且b的row小于d的row
            // 但是如果是同样的列，会出现重叠，解决方案：1.此处要找出重叠  2.绘图时如果不从同一点画两条线且以折线方式
            // 选用方案2
            bNode?.relations.forEach((c:string)=>{
              const cColumn = getColumn(c,pyramid)
              aNode?.relations.forEach((d:string)=>{
                const dRow = nodes.get(d)
                // @ts-ignore  如果是小于bRow的就是ad与bc无法产生交叉，因为bc的层都在ad上
                if(dRow?.row <= bRow) return
                const dColumn = getColumn(d,pyramid)
                cColumn > dColumn && cross++
              })
            })
          }
        })
      }
    })
  }
  return cross
}

/**
 * 1.分层并记录节点信息  getPyramid
 * 2.按最大层，排列组合 找出最少交叉
 * @param data
 */
export default function getBestTopology(data: any):any {
  // bestPyramid betterPyramids
  const { policyMaps, policyPyramidData } = getPyramid(data);
  const { policyPyramid, maxWidth } = policyPyramidData;
  const height = policyPyramid.length - 1;
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
    allLevel.push(norepeat(fullSort(item)));
  });

  // 从每一层取一个  深度优先
  function compose(nextLevel: any, index: number, pyramid: any) {
    nextLevel.forEach((layer: any) => {
      // 取一个
      pyramid.push(layer);
      if (index + 1 === allLevel.length) {
        // getCross for this tower      bestPyramid    betterPyramids
        const crosses = getCrosses(pyramid);
        if (crosses < bestPyramid.crosses || !bestPyramid) {
          bestPyramid = {
            crosses,
            pyramid,
          };
          betterPyramids = { crosses: betterPyramids[crosses] };
        } else if (crosses === bestPyramid.crosses) {
          betterPyramids[crosses] = betterPyramids[crosses] || [];
        }
        return;
      }
      compose(allLevel[index + 1], index + 1, [...pyramid]);
    });
  }
  // 从第一层开始
  compose(allLevel[0], 0, []);
  return {bestPyramid, betterPyramids}
}
