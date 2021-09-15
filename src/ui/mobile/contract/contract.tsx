import { Radio, Input, Space } from "antd";
import { useState, useEffect } from "react";
import Pay from "../event/pay";
import "./contract.scss";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import PolicyGraph from "../policy/_components/policyGraph";
import PolicyCode from "../policy/_components/policyCode";
import PolicyContent from "../policy/_components/policyContent";
import { Tabs, WhiteSpace, Badge, Button } from "antd-mobile";
var moment = require("moment");
/**
 * 事件执行后：分情况，如果是获得授权的事件，那就是---获得授权后
 */
interface ItemProps {
  policy: any;
  contract: any;
  children?: any;
  paymentFinish: any;
  setModalType: any;
  [propName: string]: any;
}
const tabs = [
  { title: <Badge>合约流转记录</Badge> },
  { title: <Badge>策略内容</Badge> },
  { title: <Badge>状态机视图</Badge> },
  { title: <Badge>策略代码</Badge> },
];
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
    setEventIndex(parseInt(e.target.value));
  }
  function payEvent(index?: number) {
    typeof(index) !="undefined" && setEventIndex(index)
    setIsModalVisible(true);
  }
  function paymentFinish(status: number) {
    if (status === 2) {
      setIsModalVisible(false);
    }
    props.paymentFinish();
  }
  return (
    <div className="flex-column brs-10 b-1 mx-10 mt-15 pb-12 contract-card">
      {eventIndex > -1 && (
        <Pay
          contractId={props.contract.contractId}
          subjectName={props.contract.subjectName}
          setModalType={props.setModalType}
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
      <div className="flex-row  p-15">
        <div className="flex-1 text-ellipsis fc-main fs-16 fw-bold lh-33">
          {props.contract.contractName}
        </div>
        {/* <div className="policy-button cur-pointer  shrink-0 select-none">策略内容</div> */}
      </div>
      <Tabs
        tabs={tabs}
        initialPage={0}
        onChange={(tab, index) => {
        }}
        onTabClick={(tab, index) => {
        }}
      >
        <div className="px-15">
          {/* 状态整体 */}
          <div className="status-card p-15 mt-15">
            <div className="flex-row">
              <div
                className={"auth-status text-center select-none " + authClass}
              >
                {authStatus}
              </div>
              <div className="auth-time">
                {moment(props.contract.updateDate).format("YYYY-MM-DD HH:mm")}
              </div>
            </div>
            <div className="flex-row py-10 space-between align-center">
              <div className="contract-tip fs-12">
                当前无授权，请选择执行事件
              </div>

              {
                // @ts-ignore
                currentStatus.tec > 1 && (
                  <Button
                    type="primary"
                    size="small"
                    className="fs-12"
                    disabled={eventIndex === -1}
                    onClick={() => {
                      payEvent();
                    }}
                  >
                    支付
                  </Button>
                )
              }
            </div>
            {/* 可选事件 */}
            <div>
                <div className="flex-column">
                  {
                    // @ts-ignore
                    currentStatus.eventTranslateInfos &&
                      // @ts-ignore
                      currentStatus.eventTranslateInfos.map(
                        (event: any, index: number) => {
                          // origin.id  name
                          return (
                            <div
                              className={
                                "event-card p-10 mt-10 flex-row " +
                                (index !== eventIndex ? "" : "event-selected")
                              }
                              key={index}
                            >
                              <input
                               // @ts-ignore
                                className={currentStatus.tec === 1? "mt-8" : "mt-4"}
                                type="radio"
                                checked={index === eventIndex}
                                onChange={onChange}
                                id={event.origin.id}
                                name={props.contract.contractId}
                                value={index}
                                disabled={
                                  event.origin.name !== "TransactionEvent"
                                }
                              />
                              <label htmlFor={event.origin.id}>
                                <div className="flex-row event flex-wrap align-center  justify-end">
                                  <div className="mx-10 flex-row align-center pe-none flex-wrap flex-1">
                                    <span className="mr-10 ">{event.content}</span>
                                    <span className="auth shrink-0">
                                      {event.nextState && event.nextState.isAuth
                                        ? "获得授权"
                                        : ""}
                                    </span>
                                  </div>
                                  {
                                    // @ts-ignore
                                    currentStatus.tec === 1 &&
                                      event.origin.name ===
                                        "TransactionEvent" && (
                                        <Button
                                          type="primary"
                                          size="small"
                                          // disabled={index !== eventIndex}
                                          className="fs-12  shrink-0 "
                                          onClick={() => {
                                            payEvent(index);
                                          }}
                                        >
                                          支付
                                        </Button>
                                      )
                                  }
                                </div>
                                {/* 执行完成后下一个状态的所有事件 */}
                                <div className="flex-column event-next pt-5 ml-12 pe-none">
                                  {/** 事件执行后：分情况，如果是获得授权的事件，那就是---获得授权后
                                   * event.origin.state
                                   */}
                                  <div className="event-next">
                                    {event.nextState && event.nextState.isAuth
                                      ? "获得授权后"
                                      : "执行成功后:"}
                                  </div>
                                  {event.nextState &&
                                    event.nextState.eventTranslateInfos.map(
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
                              </label>
                            </div>
                          );
                        }
                      )
                  }
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
            <div>合同编号： {props.contract.contractId}</div>
            <div>
              签约时间：
              {moment(props.contract.updateDate).format("YYYY-MM-DD HH:mm")}
            </div>
          </div>
        </div>
        <div className="px-15">
          <PolicyContent
            translateInfo={props.policy.translateInfo}
          ></PolicyContent>
        </div>
        <div className="px-15">
          <PolicyGraph policy={props.policy}></PolicyGraph>
        </div>
        <div className="px-15">
          <PolicyCode policyText={props.policy.policyText}></PolicyCode>
        </div>
      </Tabs>
    </div>
  );
}
