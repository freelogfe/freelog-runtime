import { Modal } from "antd";
import { SUCCESS, USER_CANCEL } from "../../bridge/event";
import React, { useState, useEffect } from "react";
import Presentables from "./presenbles/presentbles";
import { LOGIN } from "../../bridge/event";
import Button from "./_components/button";
import "./auth.scss";
import Contract from "./contract/contract";
import Policy from "./policy/policy";
import frequest from "../../services/handler";
import presentable from "../../services/api/modules/presentable";
import contract from "../../services/api/modules/contract";
import { getUserInfo } from "../../platform/structure/utils";
import getBestTopology from "./topology/data";
import { authcodes } from "../../bridge/authCode";
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
 * 最外面拦截到errCode === 30 时需要跳转登录
 *
 */

interface contractProps {
  events: Array<any>;
  contractFinished(eventId: any, type: number, data?: any): any;
  children?: any;
}
export default function (props: contractProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [contracts, setContracts] = useState([]);
  const events = props.events || [];
  console.log(events);
  const [currentPresentable, setCurrentPresentable] = useState(events[0]);
  const [policies, setPolicies] = useState([]);
  async function getDetail(id: string) {
    const userInfo: any = await getUserInfo();
    const res = await frequest(presentable.getPresentableDetail, [id], {
      isLoadPolicyInfo: 1,
      isTranslate: 1,
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
    const contractedPolicies: any = [];
    const contracts = con.data.data.filter((item: any) => {
      if (item.status === 0) {
        contractedPolicies.push(item.policyId);
        return true;
      }
    });
    console.log(contracts);
    setContracts(contracts);
    res.data.data.policies = res.data.data.policies.filter((i: any) => {
      if (contractedPolicies.includes(i.policyId)) {
        i.contracted = true;
      }
      return i.status === 1;
    });
    res.data.data.policies.forEach((item: any) => {
      console.log(item);
      const { policyMaps, bestPyramid, betterPyramids, nodesMap } =
        getBestTopology(item.fsmDescriptionInfo);
      item.policyMaps = policyMaps;
      item.bestPyramid = bestPyramid;
      item.betterPyramids = betterPyramids;
      item.nodesMap = nodesMap;
      console.log(policyMaps, bestPyramid, betterPyramids);
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
    const subjects: any = [];
    policies.forEach((item: any) => {
      item.checked &&
        subjects.push({
          subjectId: currentPresentable.presentableId,
          policyId: item.policyId,
        });
    });
    const userInfo: any = await getUserInfo();
    const res = await frequest(contract.contracts, [], {
      subjects,
      subjectType: 2,
      licenseeId: userInfo.userId + "",
      licenseeIdentityType: 3,
    });
    if (res.data.isAuth) {
      // `付款到${seller}${amount}块钱就可以达到${status}状态`
    }
    setIsModalVisible(false);
    props.contractFinished(currentPresentable.eventId, SUCCESS);
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
        getContainer={document.getElementById("runtime-root")}
      >
        <div className="w-100x h-574 flex-column">
          {/* 左右 */}
          <div className="w-100x flex-1 flex-row over-h">
            <div className="w-100x h-100x  flex-row">
              {/* 左：待授权展品列表 */}
              <div className="flex-column w-344 h-100x  y-auto">
                {events.length
                  ? events.map((item: any, index: number) => {
                      if (item.event === LOGIN) return "";
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            setCurrentPresentable(item);
                          }}
                          className={
                            (currentPresentable === item ? "bg-content " : "") +
                            " px-20 py-15 w-100x b-box x-auto  cur-pointer presentable-item select-none"
                          }
                        >
                          <div
                            className="presentable-name w-100x text-ellipsis"
                            title={item.presentableName}
                          >
                            {item.presentableName}
                          </div>
                          <div className="flex-row pt-10">
                            {item.presentableInfo.data.data.contracts.map(
                              (contract: any) => {
                                return (
                                  <div
                                    className={
                                      "contract-tag flex-row align-center mr-5"
                                    }
                                  >
                                    <div className="contract-name">
                                      {contract.contractName}
                                    </div>
                                    <div
                                      className={
                                        "contract-dot ml-6 " +
                                        (contract.authStatus === 128
                                          ? "bg-auth-none"
                                          : "bg-auth")
                                      }
                                    ></div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      );
                    })
                  : ""}
                {/* <Presentables></Presentables> */}
              </div>
              {/* 右：策略或合约列表 */}
              <div className="w-516 bg-content h-100x   y-auto px-20 pb-20">
                {contracts.length && policies.length - contracts.length ? (
                  <div className="policy-tip flex-row align-center mt-15 px-10">
                    <div className="tip">最下方有可签约的策略</div>
                  </div>
                ) : null}
                {contracts.map((contract: any, index: number) => {
                  return <Contract contract={contract} key={index}></Contract>;
                })}
                {policies.map((policy: any, index: number) => {
                  return policy.contracted ? null : (
                    <Policy
                      policy={policy}
                      key={index}
                      selectType={contracts.length ? true : false}
                    ></Policy>
                  );
                })}
              </div>
            </div>
          </div>
          {contracts.length ? (
            ""
          ) : (
            <div className="h-74 w-100x text-center">
              <Button click={getAuth} className="w-300 h-38 fs-14 text-center">
                立即签约
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </React.Fragment>
  );
}
