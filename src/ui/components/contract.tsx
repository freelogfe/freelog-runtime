import { Form, Input, Modal, Button, Checkbox } from "antd";
import user from "../../services/api/modules/user";
import frequest from "../../services/handler";
import { SUCCESS, FAILED, USER_CANCEL } from "../../bridge/event";
import React, { useState } from "react";
import { reisterUI, eventMap, failedMap, endEvent } from "../../bridge/index";
import { LOGIN, CONTRACT } from "../../bridge/event";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function (props: any) {
  const onFinish = async (values: any) => {
    // loginName: "string",
    //   password: "string",
    //   isRemember: "string",
    //   returnUrl: "string",
    //   jwtType: "string",
    values.isRemember = values.isRemember ? 1 : 0;
    const res = await frequest(user.login, "", values);
    if (res.data.errCode === 0) {
      props.eventFinished(SUCCESS);
    }
  };
  const events = props.events;
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    setIsModalVisible(false);
  };
  console.log(events, LOGIN);
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
            <div className="w-100x h-100x flex-column ">
              {[...events, ...events, ...events, ...events, ...events, ...events, ...events, ...events, ...events].map((item: any, index: number) => {
                if (item.event === LOGIN) return "";
                return (
                  <div
                    key={index}
                    onClick={() => {
                      // setCurrentEvent(item);
                    }}
                    className={
                      (index === 1 ? "bg-content ": "") + "pl-20 w-100x b-box h-60  f-main lh-60"
                    }
                  >
                    <div>{item.presentableId}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="w-516 bg-content h-100x   y-auto ">
          {[1, 3, 3, 4].map((item: any) => {
            return (
              <div className="brs-10 w-476x  bg-white my-15 mx-20">
                <div className="f-main flex-row align-center space-between bb-1 px-20 h-50">
                  <div className="fw-bold  fs-14 fc-black">策略1</div>
                  <div className="px-10 py-5 bg-main fs-13 fw-medium fc-white brs-4">
                    获取授权
                  </div>
                </div>
                <div
                  className="px-20 py-15 fw-bold fs-14 fc-black lh-20"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  for public initial[active]: terminate for public
                  initial[active]: terminate
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
