import { Modal } from "antd";
import { SUCCESS, USER_CANCEL } from "../../bridge/event";
import React, { useState, useEffect } from "react";
import Presentables from './presenbles/presentbles'
import Contract from './contract/contract'
import Policy from './policy/policy'

/**
 * 展品授权窗口：
 *     左：展品列表
 *         上：展品名称
 *         下：已签约合同：绿色：已授权，黄色：未授权，红色：异常
 *     右：合约与策略列表：合约列表在上面，策略在下面
 *         合约：上：策略名称
 *               中： 上：策略内容：当前状态---->是否授权，当前时间--->状态内容，事件需要可点击
 *                    下：合约流转记录：可显示隐藏
 *               下：合约编号，签约时间
 *         策略：上：整行：名称 复选框（没有合约时，复选框变成签约按钮）
 *               中：tab页：策略内容，状态机视图，策略代码   
 * 组件化：不过分考虑细腻度
 *     最外层：
 *         待获取授权展品组件
 *         合约组件：授权状态组件（全局），按钮组件（全局），流转记录组件（有可能需要放大，所以提出来）
 *         策略组件(策略组件需要放大或点击合约的策略内容单独显示)：状态机视图组件，策略内容组件，策略代码组件
 *             
 */ 
interface contractProps {
  events: Array<any>;
  contractFinished(eventId: any, type: number, data?: any): any;
  children?: any;
}
export default function (props: contractProps) {
  const userCancel = () => {
    props.contractFinished("", USER_CANCEL);
  };
  return (
    <React.Fragment>
      <Modal
        title="展品授权"
        zIndex={1200}
        centered
        footer={null}
        visible={true}
        width={860}
        onCancel={userCancel}
        className="h-600"
        keyboard={false}
        maskClosable={false}
        wrapClassName="freelog-contract"
        getContainer={document.getElementById('runtime-root')}
      >
        {/* 左右 */}
        <div className="w-100x h-500 flex-row">
          {/* 左：待授权展品列表 */}
          <div className="flex-column w-344 h-100x  y-auto">
             <Presentables></Presentables>
          </div>
          {/* 右：策略或合约列表 */}
          <div className="w-516 bg-content h-100x   y-auto ">
            <Contract></Contract>
            <Policy></Policy>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
}
