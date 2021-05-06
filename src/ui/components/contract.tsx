import { Form, Input, Modal, Button, Checkbox } from "antd";
import { SUCCESS, FAILED, USER_CANCEL } from "../../bridge/event";
import React, { useState, useEffect } from "react";
import { LOGIN } from "../../bridge/event";
import frequest from "../../services/handler";
import presentable from "../../services/api/modules/presentable";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function (props: any) {
  const events = props.events || [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPresentable, setCurrentPresentable] = useState(events[0]);
  const [currentDetail, setCurrentDetail] = useState({policies: []});
  async function getDetail(id: string){
   const res = await frequest(presentable.getPresentableDetail, [id], {isLoadPolicyInfo: 1})
   console.log(res)
   setCurrentDetail(res.data.data)
  }
  useEffect(() => {
    console.log(events[0])
    // events[0] && getDetail(events[0].presentableId)
  }, [])
  useEffect(() => {
    currentPresentable && getDetail(currentPresentable.presentableId)
  }, [currentPresentable])
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <Modal
      title="展品授权"
      zIndex={1200}
      centered
      footer={null}
      visible={true}
      width={860}
      closable={false}
      className="h-600"
      wrapClassName="freelog-contract"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="w-100x h-500 flex-row">
        <div className="flex-column w-344 h-100x  y-auto">
          {events.length ? (
              [...events].map((item: any, index: number) => {
                if (item.event === LOGIN) return "";
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setCurrentPresentable(item);
                    }}
                    className={
                      (currentPresentable === item ? "bg-content ": "") + " pl-20 w-100x b-box h-60 cur-pointer f-main lh-60 select-none"
                    }
                  >
                    <div>{item.presentableInfo.data.presentableName || item.presentableInfo.data.resourceName}</div>
                  </div>
                );
              })
          ) : (
            ""
          )}
        </div>
        <div className="w-516 bg-content h-100x   y-auto ">
          {currentDetail.policies.map((item: any, index: number) => {
            return (
              <div key={index} className="brs-10 w-476x  bg-white my-15 mx-20 bs-less">
                <div className="f-main flex-row align-center space-between bb-1 px-20 h-50">
                  <div className="fw-bold  fs-14 fc-black">{item.policyName}</div>
                  <div className="px-10 py-5 bg-main fs-13 fw-medium fc-white brs-4 cur-pointer select-none">
                    获取授权
                  </div>
                </div>
                <pre
                  className="px-20 py-15 fw-bold fs-14 fc-black lh-20"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {item.policyText}
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
