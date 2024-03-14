import { Modal } from "antd";
import { useEffect } from "react";
import "./tip.scss";
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
      open={props.isModalVisible}
      className="w-312"
      mask={!!props.mask}
      closable={false}
      onCancel={() => {
        props.setIsModalVisible(false);
      }}
      wrapClassName="modal-tip"
    >
      <div className="w-100x h-100x flex-column align-center">
        {props.type === "success" ? (
          <i className="iconfont mr-10 fc-success fs-40">&#xe62d;</i>
        ) : props.type === "warn" ? (
          <i className="iconfont mr-10 fc-warn fs-40">&#xe62e;</i>
        ) : props.type === "notAllow" ? (
          <i className="iconfont fs-76 fc-red">&#xe62f;</i>
        ) : (
          <i className="iconfont mr-10 fc-error fs-40">&#xe617;</i>
        )}

        <div
          className="tip-content fs-18 fw-regular"
          style={{
            color: "#222222",
          }}
        >
          {props.content}
        </div>
      </div>
    </Modal>
  );
}
