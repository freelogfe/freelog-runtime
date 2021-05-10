import { Form, Input, Modal, Checkbox } from "antd";
import { SUCCESS, FAILED, USER_CANCEL } from "../../bridge/event";
import React, { useState, useEffect } from "react";
import { LOGIN } from "../../bridge/event";
import frequest from "../../services/handler";
import presentable from "../../services/api/modules/presentable";
import contract from "../../services/api/modules/contract";
import Button from './_components/button'


export default function (props: any) {
  const events = props.events || [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPolicy, setCurrentCurrentPolicy] = useState({policyId: '', policyName: ''});
  const [currentPresentable, setCurrentPresentable] = useState(events[0]);
  const [currentDetail, setCurrentDetail] = useState({
    policies: [],
  });
  async function getDetail(id: string) {
    const res = await frequest(presentable.getPresentableDetail, [id], {
      isLoadPolicyInfo: 1,
    });
    const con = await frequest(contract.getContracts, "", {
      subjectIds: 1,
      subjectType: 2,
      licenseeIdentityType: 3,
      licenseeId: 1,
    });
    console.log(res.data.data, 234234)
    setCurrentDetail(res.data.data);
  }
  useEffect(() => {
    // events.forEach((item: any) => {
      
    // })
    setCurrentPresentable(events[0])
  }, [props.events]);
  useEffect(() => {
    currentPresentable && getDetail(currentPresentable.presentableId);
  }, [currentPresentable]);
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const getAuth = async () => {
    const res = await frequest(contract.contract, [], {
      subjectId: currentPresentable.presentableId,
      subjectType: 2,
      policyId: currentPolicy.policyId,
      licenseeId: 23345,
      licenseeIdentityType: 3
    });
    setIsModalVisible(false);
  };
  return (
    <React.Fragment>
      <Modal
        title="签约确认"
        zIndex={1201}
        centered
        footer={null}
        visible={isModalVisible}
        className="w-560"
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName="freelog-confirm"
      >
        <div className="w-100x h-100x flex-column justify-center  pt-16">
          <div className="flex-row fc-grey mb-20 fs-14 justify-center">
            <span className="pr-10 shrink-0">展品名称</span>
            {currentPresentable ? (
              <span>
                {currentPresentable.presentableInfo.data.presentableName ||
                  currentPresentable.presentableInfo.data.resourceName}
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="flex-row align-center lh-25 fs-16 fc-grey mb-70 justify-center">
            <span className="shrink-0">确定使用</span>
            <span className="fc-main fw-bold px-10">
              {currentPolicy.policyName}
            </span>
            <span className="shrink-0">获取授权？</span>
          </div>
          <div className="flex-row justify-center">
            <Button
              type="cancel"
              click={(e) => {
                setIsModalVisible(false);
              }}
              className="mr-10"
            >
              取消
            </Button>
            <Button
              click={(e) => {
                getAuth();
              }}
              type="main"
             >
              确定
            </Button>
          </div>
        </div>
      </Modal>

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
      >
        <div className="w-100x h-500 flex-row">
          <div className="flex-column w-344 h-100x  y-auto">
            {events.length
              ? [...events].map((item: any, index: number) => {
                  if (item.event === LOGIN) return "";
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setCurrentPresentable(item);
                      }}
                      className={
                        (currentPresentable === item ? "bg-content " : "") +
                        " pl-20 w-100x b-box h-60 cur-pointer f-main lh-60 select-none"
                      }
                    >
                      <div>
                        {item.presentableName}
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
          <div className="w-516 bg-content h-100x   y-auto ">
            {currentDetail.policies.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className="brs-10 w-476x  bg-white my-15 mx-20 bs-less"
                >
                  <div className="f-main flex-row align-center space-between bb-1 px-20 h-50">
                    <div className="fw-bold  fs-14 fc-black">
                      {item.policyName}
                    </div>
                    <Button
                      click={(e) => {
                        setCurrentCurrentPolicy(item);
                        setIsModalVisible(true);
                      }}
                      className=""
                    >
                      获取授权
                    </Button>
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
    </React.Fragment>
  );
}
