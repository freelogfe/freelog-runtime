import { Modal } from "antd";
import "./tip.scss";
import React, { useState, useEffect } from "react";
import { duration } from "moment";

interface ConfirmProps {
  isModalVisible: boolean;
  type: any;
  content: string;
  setIsModalVisible: any;
  mask?: boolean;
  duration?: number;
}

export default function(props: ConfirmProps) {
  useEffect(() => {
    if (props.isModalVisible) {
      if (props.duration && props.duration > 0) {
        setTimeout(() => props.setIsModalVisible(false), props.duration);
      }
    }
  }, [props.isModalVisible]);
  return (
    <Modal
      title=""
      zIndex={1301}
      centered
      footer={null}
      visible={props.isModalVisible}
      className="w-312"
      mask={!!props.mask}
      closable={false}
      onCancel={() => {
        props.setIsModalVisible(false);
      }}
      wrapClassName="freelog-pc-tip"
    >
      <div className="w-100x h-100x flex-column align-center">
        {props.type === "success" ? (
          <i className="iconfont mr-10 fc-success">&#xe62d;</i>
        ) : props.type === "warn" ? (
          <i className="iconfont mr-10 fc-warn">&#xe62e;</i>
        ) : (
          <i className="iconfont mr-10 fc-error">&#xe617;</i>
        )}

        <div className="tip-content">{props.content}</div>
      </div>
    </Modal>
  );
}
