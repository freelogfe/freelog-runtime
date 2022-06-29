/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Modal } from "antd";
import { useEffect } from "react";
export interface TipTipes {
  type: "success" | "warn" | "error" | "notAllow";
}
interface ConfirmProps {
  isModalVisible: boolean;
  type: TipTipes["type"];
  content: string;
  setIsModalVisible: any;
  mask?: boolean;
  duration?: number;
}

export default function Tip(props: ConfirmProps) {
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
      css={css`
        .ant-modal-content {
          background: #ffffff !important;
          border-radius: 6px !important;
          border: 1px solid #f0f0f0 !important;
        }

        .iconfont {
          font-size: 40px;
        }
      `}
    >
      <div className="w-100x h-100x flex-column align-center">
        {props.type === "success" ? (
          <i className="iconfont mr-10 fc-success fs-40">&#xe62d;</i>
        ) : props.type === "warn" ? (
          <i className="iconfont mr-10 fc-warn fs-40">&#xe62e;</i>
        ) : props.type === "notAllow" ? (
          <i
            className="iconfont"
            css={css`
              color: red;
              font-size: 76px !important;
            `}
          >
            &#xe62f;
          </i>
        ) : (
          <i className="iconfont mr-10 fc-error fs-40">&#xe617;</i>
        )}

        <div
          className="tip-content"
          css={css`
            font-size: 18px;
            font-weight: 400;
            color: #222222;
          `}
        >
          {props.content}
        </div>
      </div>
    </Modal>
  );
}
