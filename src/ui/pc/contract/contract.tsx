import { Radio, Input, Space } from "antd";
import { useState, useEffect } from "react";
import Button from "../_components/button";
import Pay from "../event/pay";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import "./contract.scss";
import PolicyGraph from "../policy/_components/policyGraph";
import PolicyCode from "../policy/_components/policyCode";
import PolicyContent from "../policy/_components/policyContent";
import { Tabs, Checkbox, Popconfirm } from "antd";
const { TabPane } = Tabs;

var moment = require("moment");
/**
 * 事件执行后：分情况，如果是获得授权的事件，那就是---获得授权后
 */
interface ItemProps {
  policy: any;
  contract: any;
  children?: any;
  paymentFinish: any;
  [propName: string]: any;
}

export default function (props: ItemProps) {
  const [eventIndex, setEventIndex] = useState(-1);
  const [unfold, setUnFold] = useState(false);
  const [argsMap, setArgsMap] = useState<Map<any, any>>(new Map());
  const [authClass, setAuthClass] = useState("bg-auth-non");
  const [authStatus, setAuthStatus] = useState("未授权");
  const [currentStatus, setCurrentStatus] = useState({
    eventTranslateInfos: [{ origin: { args: { amount: "" } } }],
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    const argsMap = new Map();
    props.contract.fsmDeclarations.envArgs?.forEach((item: any) => {
      argsMap.set(item.name, item);
    });
    setArgsMap(argsMap);
    let authClass = "bg-auth-end";
    let authStatus = "已终止";
    if (props.contract.status !== 1) {
      authStatus = "未授权";
      authClass = "bg-auth-non";
      if (props.contract.authStatus === 2 && window.isTest) {
        authStatus = "已授权";
        authClass = "bg-auth";
      } else if (props.contract.authStatus === 1) {
        authStatus = "已授权";
        authClass = "bg-auth";
      }
    }
    setAuthStatus(authStatus);
    setAuthClass(authClass);
    props.contract.policyInfo.translateInfo.fsmInfos.some((item: any) => {
      if (item.stateInfo.origin === props.contract.fsmCurrentState) {
        let tec = 0; // TransactionEventCount
        item.eventTranslateInfos.forEach((event: any) => {
          if (event.origin.name === "TransactionEvent") tec++;
          props.contract.policyInfo.translateInfo.fsmInfos.some(
            (state: any) => {
              if (state.stateInfo.origin === event.origin.state) {
                event.nextState = {
                  ...state,
                  ...props.contract.policyInfo.fsmDescriptionInfo[
                  event.origin.state
                  ],
                };
                return true;
              }
            }
          );
        });

        const currentSatus = {
          tec,
          status: props.contract.fsmCurrentState,
          ...item,
          ...props.contract.policyInfo.fsmDescriptionInfo[
          props.contract.fsmCurrentState
          ],
        };
        // @ts-ignore
        setCurrentStatus(currentSatus);
        return true;
      }
    });
  }, [props.contract]);
  function onChange(e: any) {
    setEventIndex(e.target.value);
  }
  function payEvent(e: any) {
    setIsModalVisible(true);
  }
  function paymentFinish(status: number) {
    if (status === 2) {
      setIsModalVisible(false);
    }
    props.paymentFinish()
  }
  return (
    <div className="contract-card px-20 py-15 mt-15 w-100x">
      {eventIndex > -1 && (
        <Pay
          contractId={props.contract.contractId}
          subjectName={props.contract.subjectName}
          contractName={props.contract.contractName}
          paymentFinish={paymentFinish}
          // @ts-ignore
          receiver={
            argsMap.get(
              // @ts-ignore
              currentStatus.eventTranslateInfos[eventIndex].origin.args.account
            ).ownerName
          }
          // @ts-ignore
          eventId={currentStatus.eventTranslateInfos[eventIndex].origin.id}
          // @ts-ignore
          transactionAmount={
            currentStatus.eventTranslateInfos[eventIndex].origin.args.amount
          }
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        ></Pay>
      )}
      <div className="flex-row w-100x">
        <div className="contract-name  text-ellipsis">
          {props.contract.contractName}
        </div>
        {/* <div className="policy-button cur-pointer  shrink-0 select-none">策略内容</div> */}
      </div>
      <Tabs defaultActiveKey="1" className="select-none">
        <TabPane tab="合约流转记录" key="1">
          {/* 状态整体 */}
          <div className="status-card p-15 mt-15">
            <div className="flex-row">
              <div className={"auth-status text-center select-none " + authClass}>
                {authStatus}
              </div>
              <div className="auth-time">
                {moment(props.contract.updateDate).format("YYYY-MM-DD HH:mm")}
              </div>
            </div>
            <div className="flex-row py-10 space-between align-center">
              <div>当前无授权，请选择执行事件</div>

              {
                // @ts-ignore
                currentStatus.tec > 1 && (
                  <Button
                    className="fs-12"
                    disabled={eventIndex === -1}
                    click={payEvent}
                  >
                    支付
                  </Button>
                )
              }
            </div>
            {/* 可选事件 */}
            <div>
              <div className="flex-row">
                <Radio.Group onChange={onChange} value={eventIndex}>
                  <div className="flex-column">
                    {
                      // @ts-ignore
                      currentStatus.eventTranslateInfos &&
                      // @ts-ignore
                      currentStatus.eventTranslateInfos.map(
                        (event: any, index: number) => {
                          // origin.id  name
                          return (
                            <div className={"event-card p-10 mt-10 flex-column " + (index !== eventIndex? '' : "event-selected")}  key={index}>
                              <Radio
                                className=""
                                value={index}
                                disabled={
                                  event.origin.name !== "TransactionEvent"
                                }
                              >
                                <div className="flex-row event flex-wrap align-center">
                                  <div className="mr-10 flex-row align-center">
                                    <span>{event.content}</span>
                                    <span className="auth ml-10">
                                      {event.nextState && event.nextState.isAuth ? "获得授权" : ""}
                                    </span>
                                  </div>
                                  {
                                    // @ts-ignore
                                    currentStatus.tec === 1 &&
                                    event.origin.name ===
                                    "TransactionEvent" && (
                                      <Button
                                        disabled={index !== eventIndex}
                                        className="fs-12"
                                        click={payEvent}
                                      >
                                        支付
                                      </Button>
                                    )
                                  }
                                </div>
                              </Radio>
                              {/* 执行完成后下一个状态的所有事件 */}
                              <div className="flex-column event-next pt-5 ml-25">
                                {/** 事件执行后：分情况，如果是获得授权的事件，那就是---获得授权后
                               * event.origin.state
                               */}
                                <div className="event-next">
                                  {event.nextState && event.nextState.isAuth
                                    ? "获得授权后"
                                    : "执行成功后:"}
                                </div>
                                {event.nextState && event.nextState.eventTranslateInfos.map(
                                  (nextEvent: any, index: number) => {
                                    return (
                                      <div
                                        key={index}
                                        className="flex-row align-center"
                                      >
                                        <div className="event-dot mr-5"></div>
                                        <span>{nextEvent.content}</span>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        }
                      )
                    }
                  </div>
                </Radio.Group>
              </div>
            </div>
            <div className="fluent-record text-align-center cur-pointer select-none mt-20">
              {!unfold ? (
                <div
                  onClick={(e) => {
                    setUnFold(true);
                  }}
                >
                  展开流转记录 <DownOutlined />
                </div>
              ) : (
                <div
                  onClick={(e) => {
                    setUnFold(false);
                  }}
                >
                  收起流转记录 <UpOutlined />
                </div>
              )}
            </div>
          </div>
          <div className="contract-code pt-12">
            合同编号 {props.contract.contractId} | 签约时间{" "}
            {moment(props.contract.updateDate).format("YYYY-MM-DD HH:mm")}
          </div>
        </TabPane>
        <TabPane tab="策略内容" key="2">
          <PolicyContent
            translateInfo={props.policy.translateInfo}
          ></PolicyContent>
        </TabPane>
        <TabPane tab="状态机视图" key="3">
          <PolicyGraph policy={props.policy}></PolicyGraph>
        </TabPane>
        <TabPane tab="策略代码" key="4">
          <PolicyCode policyText={props.policy.policyText}></PolicyCode>
        </TabPane>
      </Tabs>

    </div>
  );
}
