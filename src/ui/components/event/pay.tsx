import { Modal } from "antd";
import Button from "../_components/button";
import "./pay.scss";
interface ConfirmProps {
  isModalVisible: boolean;
  setIsModalVisible: any;
}

export default function (props: ConfirmProps) {
  const handleOk = () => {
    props.setIsModalVisible(false);
  };
  const handleCancel = () => {
    props.setIsModalVisible(false);
  };
  return (
    <Modal
      title="支付"
      zIndex={1201}
      centered
      footer={null}
      visible={props.isModalVisible}
      className="w-600 "
      onOk={handleOk}
      onCancel={handleCancel}
      wrapClassName="freelog-pay"
      getContainer={document.getElementById("runtime-root")}
    >
      <div className="flex-column ">
        {/* 金额 */}
        <div className="amount text-center my-40 px-80">
          <span>
            100<span className="type ml-10">羽币</span>
          </span>
        </div>
        <div className="flex-row px-80 over-h">
          <div className="flex-column shrink-0">
            <div className="left-item">标的物标的物标的物标的物标的物标的物</div>
            <div className="left-item">授权合约</div>
            <div className="left-item">收款方</div>
            <div className="left-item">支付方式</div>
          </div>
          <div className="flex-column flex-1">
            <div className="right-item text-ellipsis">标的物</div>
            <div className="right-item text-ellipsis">授权合约</div>
            <div className="right-item text-ellipsis">收款方</div>
            <div className="right-item text-ellipsis">支付方式</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
