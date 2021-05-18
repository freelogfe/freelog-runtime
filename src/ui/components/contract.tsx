import { Modal } from "antd";
import { SUCCESS, USER_CANCEL } from "../../bridge/event";
import React, { useState, useEffect } from "react";
import { LOGIN } from "../../bridge/event";
import frequest from "../../services/handler";
import presentable from "../../services/api/modules/presentable";
import contract from "../../services/api/modules/contract";
import Button from "./_components/button";
import { getStatusMaps } from "../../utils/policy";
import { getUserInfo } from "../../platform/structure/utils";
import Confirm from "./_components/confirm";
interface contractProps {
  events: Array<any>;
  contractFinished(eventId: any, type: number, data?: any): any;
  children?: any;
}
export default function (props: contractProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const events = props.events || [];
  const [currentPolicy, setCurrentCurrentPolicy] = useState({
    policyId: "",
    policyName: "",
  });
  const [currentPresentable, setCurrentPresentable] = useState(events[0]);
  const [policies, setPolicies] = useState([]);
  async function getDetail(id: string) {
    const userInfo: any = await getUserInfo();
    const res = await frequest(presentable.getPresentableDetail, [id], {
      isLoadPolicyInfo: 1,
    });
    const con = await frequest(contract.getContracts, "", {
      subjectIds: currentPresentable.presentableId,
      subjectType: 2,
      licenseeIdentityType: 3,
      licenseeId: userInfo.userId,
      isLoadPolicyInfo: 1,
    });
    /**
     * 获取
     */
    // console.log(Object.keys(con.data.data[0].policyInfo.fsmDescriptionInfo))
    const contracts = con.data.data.filter((item: any) => {
      return item.status === 0;
    });
    res.data.data.policies.forEach((item: any) => {
      console.log(item);
      item.routeMaps = getStatusMaps(
        item.fsmDescriptionInfo
      );
    });
    console.log(res.data.data.policies);
    setPolicies(res.data.data.policies);
  }
  useEffect(() => {
    setCurrentPresentable(events[0]);
  }, [props.events]);
  useEffect(() => {
    currentPresentable && getDetail(currentPresentable.presentableId);
  }, [currentPresentable]);

  const userCancel = () => {
    props.contractFinished("", USER_CANCEL);
    console.log("userCancel");
  };
  const getAuth = async () => {
    const userInfo: any = await getUserInfo();
    const res = await frequest(contract.contract, [], {
      subjectId: currentPresentable.presentableId,
      subjectType: 2,
      policyId: currentPolicy.policyId,
      licenseeId: userInfo.userId + "",
      licenseeIdentityType: 3,
    });
    if (res.data.isAuth) {
      // `付款到${seller}${amount}块钱就可以达到${status}状态`
    }
    props.contractFinished(currentPresentable.eventId, SUCCESS);
    setIsModalVisible(false);
  };
  return (
    <React.Fragment>
      <Confirm
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        getAuth={getAuth}
        currentPolicy={currentPolicy}
        currentPresentable={currentPresentable}
      />
      <Modal
        title="展品授权"
        zIndex={1200}
        centered
        footer={null}
        visible={true}
        width={860}
        onCancel={userCancel}
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
                      <div>{item.presentableName}</div>
                    </div>
                  );
                })
              : ""}
          </div>
          <div className="w-516 bg-content h-100x   y-auto ">
            {policies.map((policy: any, index: number) => {
              return (
                <div
                  key={index}
                  className="brs-10 w-476x  bg-white my-15 mx-20 bs-less"
                >
                  <div className="f-main flex-row align-center space-between bb-1 px-20 h-50">
                    <div className="fw-bold  fs-14 fc-black">
                      {policy.policyName}
                    </div>
                    <Button
                      click={(e) => {
                        setCurrentCurrentPolicy(policy);
                        setIsModalVisible(true);
                      }}
                      className=" bg-white"
                    >
                      获取授权
                    </Button>
                  </div>

                  {policy.routeMaps.map((route: any) => {
                    return (
                      <div className="flex-column   mb-10 bb-1 px-10" key={route}>
                        {route.map((node: any, index: number) => {
                          return (
                            <div className="flex-column" key={index}>
                              {index === 0 ? <div>签约后</div> : null}
                              <div className="pl-20">{node[1].translation}</div>
                              <div className="my-5">{node[0] + (node[2].isAuth ? '[授权]' : '')}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
}
