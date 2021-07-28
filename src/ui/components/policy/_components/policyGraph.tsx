

import { Graph } from "@antv/x6";
import React, { useState, useEffect } from "react";

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
   * 
   * 排兵布阵：
   * 节点摆放：
   *     针对nodes数组确定每一个节点的方位，
   *     线是从下往上画的：例如从最后一层最后一个开始
   * 
   */
  const data = {
    // 节点
    nodes: [
      {
        id: "node1", // String，可选，节点的唯一标识
        x: 40, // Number，必选，节点位置的 x 值
        y: 40, // Number，必选，节点位置的 y 值
        width: 80, // Number，可选，节点大小的 width 值
        height: 40, // Number，可选，节点大小的 height 值
        label: "hell44444444444444444444444444444444o", // String，节点标签
      },
      {
        id: "node2", // String，节点的唯一标识
        x: 160, // Number，必选，节点位置的 x 值
        y: 180, // Number，必选，节点位置的 y 值
        width: 80, // Number，可选，节点大小的 width 值
        height: 40, // Number，可选，节点大小的 height 值
        label: "world", // String，节点标签
      },
      {
        id: "node3", // String，节点的唯一标识
        x: 100, // Number，必选，节点位置的 x 值
        y: 280, // Number，必选，节点位置的 y 值
        width: 80, // Number，可选，节点大小的 width 值
        height: 40, // Number，可选，节点大小的 height 值
        label: "world2", // String，节点标签
      },
    ],
    // 边
    edges: [
      {
        source: "node1", // String，必须，起始节点 id
        target: "node2", // String，必须，目标节点 id
        labels: [
          {
            attrs: { label: { text: "edge" } },
          },
        ],
      },
      {
        source: "node2", // String，必须，起始节点 id
        target: "node1", // String，必须，目标节点 id
        labels: [
          {
            attrs: { label: { text: "edge33" } },
          },
        ],
        connector: {
            name: 'rounded',
            args: {},
          },
        vertices: [
          { x: 300, y: 180 },
        ],
      },
      {
        source: "node1", // String，必须，起始节点 id
        target: "node3", // String，必须，目标节点 id
        labels: [
          {
            attrs: { label: { text: "edge1" } },
          },
        ],
      },
    ],
  };
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
        edgeMovable: false
      }
    });
    graph.fromJSON(data);
  });

  return <div id="x6-container" className="p-20 h-400 w-100x"></div>;
}
