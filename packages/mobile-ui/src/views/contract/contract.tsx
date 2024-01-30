import { useState, useEffect } from "react";
import Pay from "../event/pay";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
// import PolicyGraph from "../policy/_components/policyGraph";
import PolicyCode from "../policy/_components/policyCode";
import PolicyContent from "../policy/_components/policyContent";
import { Tabs, Button, Toast } from "antd-mobile";
import { freelogAuthApi } from "freelog-runtime-api";
import "./contract.scss";
import moment from 'moment';
/**
 * 事件执行后：分情况，如果是获得授权的事件，那就是---获得授权后
 */
interface ItemProps {
  policy: any;
  contract: any;
  children?: any;
  isAvailable: boolean;
  paymentFinish: any;
  setModalType: any;
  [propName: string]: any;
}
// const tabs = [
//   { title: <Badge>合约流转记录</Badge> },
//   { title: <Badge>策略内容</Badge> },
//   { title: <Badge>状态机视图</Badge> },
//   { title: <Badge>策略代码</Badge> },
// ];

export default function Contract(props: ItemProps) {
  const [eventIndex, setEventIndex] = useState(-1);
  const [unfold, setUnFold] = useState(false);
  const [records, setRecords] = useState<any>([]);
  const [totalItem, setTotalItem] = useState<any>(-1);
  const [argsMap, setArgsMap] = useState<Map<any, any>>(new Map());
  const [authClass, setAuthClass] = useState("bg-auth-none");
  const [authStatus, setAuthStatus] = useState("未授权");
  const [currentStatus, setCurrentStatus] = useState<any>({
    tec: 0,
    eventSectionEntities: [{ origin: { args: { amount: "" } } }],
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    const argsMap = new Map();
    props.contract.fsmDeclarations.envArgs?.forEach((item: any) => {
      argsMap.set(item.name, item);
      argsMap.set(item.accountId, item);
    });
    setArgsMap(argsMap);
    let authClass = "bg-auth-end";
    let authStatus = "已终止";
    if (props.contract.status !== 1) {
      authStatus = "未授权";
      authClass = "bg-auth-none";
      if (window.isTest) {
        if (props.contract.isTestAuth) {
          authStatus = "已授权";
          authClass = "bg-auth";
        }
      } else if (props.contract.isAuth) {
        authStatus = "已授权";
        authClass = "bg-auth";
      }
    }
    setAuthStatus(authStatus);
    setAuthClass(authClass);
    getRecords(true);
  }, [props.contract]);
  async function getRecords(init?: boolean) {
    if (records.length >= totalItem && totalItem > -1 && !init) {
      !init && setUnFold(true);
      return;
    }
    const res = await freelogAuthApi.getTransitionRecords(
      [props.contract.contractId],
      {
        skip: records.length,
        limit: 25,
        isTranslate: 1,
      }
    );
    if (res.data.errCode !== 0) {
      Toast.show({
        icon: "fail",
        content: res.data.msg,
        duration: 2000,
      });
      return;
    }
    let recordsArr: any = [];
    res.data.data.dataList.forEach((record: any) => {
      record.commonAuth = window.isTest
        ? [2, 3].includes(record.serviceStates)
        : [1, 3].includes(record.serviceStates);
      let authStatus = "未授权";
      let authClass = "bg-auth-none";
      if (record.commonAuth) {
        authStatus = "已授权";
        authClass = "bg-auth";
      }
      recordsArr.push({
        ...record,
        authClass,
        authStatus,
      });
    });
    setTotalItem(res.data.data.totalItem);
    setRecords([...records, ...recordsArr]);
    const item = res.data.data.dataList[0];
    let tec = 0; // TransactionEventCount
    let firstPayEvent = -1;
    let currentContent = { ...item };
    currentContent.eventSectionEntities.forEach((event: any, index: number) => {
      if (event.origin.name === "TransactionEvent") {
        firstPayEvent = firstPayEvent > -1 ? firstPayEvent : index;
        tec++;
      }
      const stateInfo =
        props.contract.policyInfo.fsmDescriptionInfo[event.origin.toState];
      stateInfo.commonAuth = window.isTest
        ? stateInfo.isTestAuth
        : stateInfo.isAuth;
      event.nextState = {
        ...stateInfo,
      };
    });
    const currentStatus = {
      tec,
      status: props.contract.fsmCurrentState,
      ...currentContent,
    };
    setCurrentStatus(currentStatus);
    tec === 1 && setEventIndex(firstPayEvent);
    !init && setUnFold(true);
  }
  function onChange(e: any) {
    setEventIndex(parseInt(e.target.value));
  }
  function payEvent(index?: number) {
    typeof index != "undefined" && setEventIndex(index);
    setIsModalVisible(true);
  }
  function paymentFinish(status: number) {
    if (status === 2) {
      setIsModalVisible(false);
      setTimeout(() => {
        props.paymentFinish();
      }, 10);
      return;
    }
    props.paymentFinish();
  }
  return (
    <div className="flex-column brs-10 b-1 mx-10 mt-15 pb-12 contract-container">
      {eventIndex > -1 && isModalVisible && (
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
              currentStatus.eventSectionEntities[eventIndex].origin.args.account
            ).ownerName
          }
          // @ts-ignore
          eventId={currentStatus.eventSectionEntities[eventIndex].origin.id}
          // @ts-ignore
          transactionAmount={
            currentStatus.eventSectionEntities[eventIndex].origin.args.amount
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
      <Tabs defaultActiveKey="contract">
        <Tabs.Tab title="合约流转记录" key="contract">
          <div className="contract-flow-container">
            {/* 状态整体 */}
            <div className="p-15 contract-flow-top">
              <div className="flex-row align-center">
                <div
                  className={
                    "authStatusCss flex-column-center select-none " + authClass
                  }
                >
                  {authStatus}
                </div>
                <div className="authTime">
                  {moment(props.contract.updateDate).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                </div>
              </div>
              <div className="flex-row pt-15 pb-5 space-between align-center">
                <div className="flex-column contract-flow-tip">
                  <div>{records[0] && records[0].stateInfoStr}</div>
                  <div className="mt-5">
                    {currentStatus.tec > 1 &&
                      records[0] &&
                      records[0].eventSelectStr}
                  </div>
                </div>
                {currentStatus.tec > 1 && (
                  <Button
                    color="primary"
                    size="small"
                    className="fs-14 shrink-0"
                    disabled={eventIndex === -1}
                    onClick={() => {
                      payEvent();
                    }}
                  >
                    支付
                  </Button>
                )}
              </div>
              {/* 可选事件 */}
              <div>
                <div className="flex-column">
                  {
                    // @ts-ignore
                    currentStatus.eventSectionEntities &&
                      // @ts-ignore
                      currentStatus.eventSectionEntities.map(
                        (event: any, index: number) => {
                          // origin.eventId  name
                          return (
                            <div
                              className={
                                "flex-row contract-flow-event" +
                                (index !== eventIndex || currentStatus.tec === 1
                                  ? ""
                                  : "contract-flow-event-tec") +
                                (currentStatus.tec === 1 ||
                                event.origin.name !== "TransactionEvent"
                                  ? "contract-flow-TransactionEvent"
                                  : "contract-flow-TransactionEvent2")
                              }
                              key={index}
                              // onClick={()=>setEventIndex()}
                            >
                              <input
                                // @ts-ignore
                                className={
                                  currentStatus.tec === 1 ? "mt-8" : "mt-4"
                                }
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
                                <div className="flex-row align-center contract-flow-tip2  ">
                                  <div className="mx-10 flex-row align-center pe-none ">
                                    <span
                                      className={event.content ? "mr-10 " : ""}
                                    >
                                      {event.content}
                                    </span>
                                    {/* <span
                                       
                                      className="shrink-0"
                                    >
                                      {event.nextState && event.nextState.isAuth
                                        ? "获得授权"
                                        : ""}
                                    </span> */}
                                  </div>
                                  {
                                    // @ts-ignore
                                    currentStatus.tec === 1 &&
                                      event.origin.name ===
                                        "TransactionEvent" && (
                                        <Button
                                          color="primary"
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
                                <div className="flex-column pt-5 ml-12 pe-none contract-flow-tip3">
                                  {/** 事件执行后：分情况，如果是获得授权的事件，那就是---获得授权后
                                   * event.origin.toState
                                   */}
                                  {/* <div
                                    
                                  >
                                    {event.nextState && event.nextState.isAuth
                                      ? "获得授权后"
                                      : "执行成功后:"}
                                  </div> */}
                                  {event.nextState &&
                                    event.nextState.eventSectionEntities &&
                                    event.nextState.eventSectionEntities.map(
                                      (nextEvent: any, index: number) => {
                                        return (
                                          <div
                                            key={index}
                                            className="flex-row align-center"
                                          >
                                            <div className="mr-5 contract-flow-tip4"></div>
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
              {/* 流转记录 */}
              {unfold &&
                records.slice(1).map((item: any, index: number) => {
                  return (
                    <div className=" mt-15 contract-flow-history" key={index}>
                      <div className="flex-row">
                        <div
                          className={
                            "authStatusCss flex-column-center select-none " +
                            item.authClass
                          }
                        >
                          {item.authStatus}
                        </div>
                        <div className="authTime">
                          {moment(item.time).format("YYYY-MM-DD HH:mm:ss")}
                        </div>
                      </div>
                      <div className="flex-row py-10 space-between align-center">
                        <div>{item.stateInfoStr}</div>
                      </div>
                    </div>
                  );
                })}
              {totalItem > 1 && (
                <div className="contract-flow-history1 text-align-center cur-pointer select-none mt-20">
                  {!unfold ? (
                    <div
                      onClick={() => {
                        getRecords();
                      }}
                    >
                      展开完整流转记录
                      <DownOutlined />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setUnFold(false);
                      }}
                    >
                      收起流转记录 <UpOutlined />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="contract-code pt-12 contract-flow-foot">
              <div>合同编号： {props.contract.contractId}</div>
              <div>
                签约时间：
                {moment(props.contract.updateDate).format("YYYY-MM-DD HH:mm")}
              </div>
            </div>
          </div>
        </Tabs.Tab>
        <Tabs.Tab title="策略内容" key="policy">
          <div className="">
            <PolicyContent
              translateInfo={props.policy.translateInfo}
            ></PolicyContent>
          </div>
        </Tabs.Tab>
        {/* <Tabs.Tab title="状态机视图" key="statusDAG">
          <div className="">
            <PolicyGraph policy={props.policy}></PolicyGraph>
          </div>
        </Tabs.Tab> */}
        <Tabs.Tab title="策略代码" key="policyCode">
          <div className="">
            <PolicyCode policyText={props.policy.policyText}></PolicyCode>
          </div>
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}
