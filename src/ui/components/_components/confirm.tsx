import {Modal } from "antd";
import Button from "./button";
 
interface ConfirmProps {
  isModalVisible: boolean;
  currentPresentable: any;
  currentPolicy: any;
  getAuth: any;
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
      title="签约确认"
      zIndex={1201}
      centered
      footer={null}
      visible={props.isModalVisible}
      className="w-560"
      onOk={handleOk}
      onCancel={handleCancel}
      wrapClassName="freelog-confirm"
    >
      <div className="w-100x h-100x flex-column justify-center  pt-16">
        <div className="flex-row fc-grey mb-20 fs-14 justify-center">
          <span className="pr-10 shrink-0">展品名称</span>
          {props.currentPresentable ? (
            <span>
              {props.currentPresentable.presentableInfo.data.presentableName ||
                props.currentPresentable.presentableInfo.data.resourceName}
            </span>
          ) : (
            ""
          )}
        </div>
        <div className="flex-row align-center lh-25 fs-16 fc-grey mb-70 justify-center">
          <span className="shrink-0">确定使用</span>
          <span className="fc-main fw-bold px-10">
            {props.currentPolicy.policyName}
          </span>
          <span className="shrink-0">获取授权？</span>
        </div>
        <div className="flex-row justify-center">
          <Button
            type="cancel"
            click={(e) => {
              props.setIsModalVisible(false);
            }}
            className="mr-10"
          >
            取消
          </Button>
          <Button
            click={(e) => {
              props.getAuth();
            }}
            type="main"
          >
            确定
          </Button>
        </div>
      </div>
    </Modal>
  );
}
