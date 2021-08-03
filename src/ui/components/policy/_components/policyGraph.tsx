import { Graph } from "@antv/x6";
import React, { useState, useEffect } from "react";
import { forEach } from "lodash";

interface GraphProps {
  policy: any;
  children?: any;
}

export default function (props: GraphProps) {
  /**
   * first: 面临最大问题，计算文字长短问题
   * start:
   */

  /**
   * 垂直线需要转弯
   * 面向对象：
   *     画板：高和宽，多少层
   *     层：多少列
   *     节点：在第几层第几列
   *     线段：起点，终点，箭头方向
   * Graph: width height
   * node: {
        id: "node1", // String，可选，节点的唯一标识
        x: 40, // Number，必选，节点位置的 x 值
        y: 40, // Number，必选，节点位置的 y 值
        width: 80, // Number，可选，节点大小的 width 值
        height: 40, // Number，可选，节点大小的 height 值
        label: "hello", // String，节点标签
      }
     edges: {
        source: "node1", // String，必须，起始节点 id
        target: "node2", // String，必须，目标节点 id
        labels: [
          {
            attrs: { label: { text: "edge" } },
          },
        ],
      },
      policyMaps, bestPyramid, betterPyramids, nodesMap， bestPyramid.maxWidth 
      方案：固定节点大小，字体大小？那就放不下，如何解决放不下的问题：滚动
            步骤：1.固定层高和节点大小字体大小
                  2.通过bestPyramid.pyramid 确定节点的id和位置和内容
                  3.通过nodesMap确定线段的起始点 折线点 以及计算出是否重叠与穿过了节点。
   */
  const nodes: any = [];
  props.policy.bestPyramid.pyramid.forEach((layer: any, yIndex: number) => {
    // x 40间隙 node 宽100    y 60间隙 node搞60
    layer.forEach((node: any, xIndex: number) => {
      if (!node) return;
      nodes.push({
        id: node.status, // String，可选，节点的唯一标识
        x: xIndex * 100 + xIndex * 80, // Number，必选，节点位置的 x 值
        y: yIndex * 60 + yIndex * 60, // Number，必选，节点位置的 y 值
        width: 100, // Number，可选，节点大小的 width 值
        height: 60, // Number，可选，节点大小的 height 值
        label: node.status, // String，节点标签
        zIndex: 1000,
        attrs: {
          body: {
            fill: '#efdbff',
            stroke: '#9254de',
            rx: 8,
            ry: 8,
            zIndex: 1
          },
        },
      });
    });
  });
  const edges: any = []
  props.policy.translateInfo.fsmInfos.forEach((info:any)=>{
    info.eventTranslateInfos.forEach((eventInfo:any)=>{
      eventInfo.used = false      
    })
  })
  props.policy.nodesMap.forEach((node:any, key:any)=>{
    // 判断source 与 target ，如果邻行且同列，不需要折线，否则都需要折线
    // 折线点判断：邻行，如果从左往右画，折线点在target上方，且记录这个点，下一次需要避免这个点
    //             隔行同列, 如果是中间左边列，y方向在target和source中的左边取平均，x方向在节点的左侧，同理右边
    //             隔行非同列，
    node.from.forEach((item:any)=>{
      let text = ''
      props.policy.translateInfo.fsmInfos.forEach((info:any)=>{
        if(info.stateInfo.origin === item){
          info.eventTranslateInfos.forEach((eventInfo:any)=>{
            if(eventInfo.origin.state === key){
              eventInfo.used = true
              text = eventInfo.content.substr(0, eventInfo.content.lastIndexOf('，'))
            }
          })
        }
      })
      edges.push({
        source: item, // String，必须，起始节点 id
        target: key, // String，必须，目标节点 id
        labels: [
          {
            attrs: { label: { text } },
          },
        ],
        // connector: {
        //     name: 'rounded',
        //     args: {},
        //   },
        // vertices: [
        //   { x: 300, y: 180 },
        // ],
      })
    })
    node.to.forEach((item:any)=>{
      let text = ''
      props.policy.translateInfo.fsmInfos.forEach((info:any)=>{
        if(info.stateInfo.origin === key){
          info.eventTranslateInfos.forEach((eventInfo:any)=>{
            if(eventInfo.origin.state === item){
              eventInfo.used = true
              text = eventInfo.content.substr(0, eventInfo.content.lastIndexOf('，'))
            }
          })
        }
      })
      edges.push({
        source: key, // String，必须，起始节点 id
        target: item, // String，必须，目标节点 id
        labels: [
          {
            attrs: { label: { text } },
          },
        ],
        // connector: {
        //     name: 'rounded',
        //     args: {},
        //   },
        // vertices: [
        //   { x: 300, y: 180 },
        // ],
      })
    })
  })
  console.log(props.policy, props.policy.nodesMap);
  const data = {

    // 边
    edges: [
      ...edges
      // {
      //   source: "node2", // String，必须，起始节点 id
      //   target: "node1", // String，必须，目标节点 id
      //   labels: [
      //     {
      //       attrs: { label: { text: "edge33" } },
      //     },
      //   ],
      //   connector: {
      //       name: 'rounded',
      //       args: {},
      //     },
      //   vertices: [
      //     { x: 300, y: 180 },
      //   ],
      // }
    ],
        // 节点
        nodes,
  };
  console.log(data)
  useEffect(() => {
    const graph = new Graph({
      // @ts-ignore
      container: document.getElementById("x6-container"),
      width: 800,
      height: 600,
      // frozen: true,
      panning: false,
      interacting: {
        nodeMovable: false,
        edgeMovable: false,
      },
    });
    graph.fromJSON(data);
  });

  return (
    <div className="w-100x h-100x x-auto y-auto ">
      <div id="x6-container" className="  w-100x  x-auto y-auto"></div>
    </div>
  );
}
