/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Radio, Modal } from "antd";
import { useState, useEffect } from "react";
import Button from "../_commons/button";
import Pay from "../event/pay";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import "./contract.scss";
import PolicyGraph from "../policy/_components/policyGraph";
import PolicyCode from "../policy/_components/policyCode";
import PolicyContent from "../policy/_components/policyContent";
import frequest from "@/services/handler";
import contract from "@/services/api/modules/contract";
import { Tabs } from "antd";
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

export default function Contract(props: ItemProps) {
  const [eventIndex, setEventIndex] = useState(-1);
  const [unfold, setUnFold] = useState(false);
  const [records, setRecords] = useState<any>([]);
  const [totalItem, setTotalItem] = useState<any>(-1);
  const [argsMap, setArgsMap] = useState<Map<any, any>>(new Map());
  const [authClass, setAuthClass] = useState("bg-auth-none");
  const [authStatus, setAuthStatus] = useState("未授权");
  const [currentStatus, setCurrentStatus] = useState({
    tec: 0,
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
      authClass = "bg-auth-none";
      if ([2, 3].includes(props.contract.authStatus) && window.isTest) {
        authStatus = "已授权";
        authClass = "bg-auth";
      } else if ([1, 3].includes(props.contract.authStatus)) {
        authStatus = "已授权";
        authClass = "bg-auth";
      }
    }
    setAuthStatus(authStatus);
    setAuthClass(authClass);
    console.log(props.contract);
    props.contract.policyInfo.translateInfo.fsmInfos.some((item: any) => {
      if (item.stateInfo.origin === props.contract.fsmCurrentState) {
        let tec = 0; // TransactionEventCount
        let currentContent = { ...item };
        currentContent.eventTranslateInfos.forEach((event: any) => {
          if (event.origin.name === "TransactionEvent") tec++;
          props.contract.policyInfo.translateInfo.fsmInfos.some(
            (state: any) => {
              if (state.stateInfo.origin === event.origin.toState) {
                const stateInfo =
                  props.contract.policyInfo.fsmDescriptionInfo[
                    event.origin.toState
                  ];
                stateInfo.commonAuth = window.isTest
                  ? stateInfo.isTestAuth
                  : stateInfo.isAuth;
                event.nextState = {
                  ...state,
                  ...stateInfo,
                };
                return true;
              }
              return false;
            }
          );
        });
        const stateInfo =
          props.contract.policyInfo.fsmDescriptionInfo[
            props.contract.fsmCurrentState
          ];
        stateInfo.commonAuth = window.isTest
          ? stateInfo.isTestAuth
          : stateInfo.isAuth;
        const currentSatus = {
          tec,
          status: props.contract.fsmCurrentState,
          ...currentContent,
          ...stateInfo,
        };
        tec === 1 && setEventIndex(0);
        console.log(currentSatus);
        // @ts-ignore
        setCurrentStatus(currentSatus);
        return true;
      }
      return false;
    });
    getRecords(true);
  }, [props.contract]);
  async function getRecords(init?: boolean) {
    if (records.length >= totalItem && totalItem > -1) {
      !init && setUnFold(true);
      return;
    }

    /**
     * contractId: "6141c41dcef4d5002ed4dcc5"
     * createDate: "2021-09-17T07:55:00.886Z"
     * eventId: "47a53396dcc9403a969c72e267b31e63"
     * fromState: "initial"
     * toState: "a"
     *
     * 数据整合差异：使用同样数据，需要注意避免发生冲突
     *   1.找到执行了哪个事件并标记
     *   2.授权状态需要在内部判断出来
     */
    const res = await frequest(
      contract.getTransitionRecords,
      [props.contract.contractId],
      {
        skip: records.length,
        limit: 25,
        isTranslate: 1,
      }
    );
    if (res.data.errCode !== 0) {
      Modal.error({
        title: "查询失败",
        content: res.data.msg,
        zIndex: 9999,
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
        status: props.contract.fsmCurrentState,
        ...record,
        authClass,
        authStatus,
      });
    });
    setTotalItem(res.data.data.totalItem);
    setRecords([...records, ...recordsArr]);
    !init && setUnFold(true);
  }
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
    props.paymentFinish();
  }
  return (
    <div
      className="contract-card px-20 py-15 mt-15 w-100x brs-10"
      css={css`
        background: #ffffff;
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
      `}
    >
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
          eventId={currentStatus.eventTranslateInfos[eventIndex].origin.eventId}
          // @ts-ignore
          transactionAmount={
            currentStatus.eventTranslateInfos[eventIndex].origin.args.amount
          }
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        ></Pay>
      )}
      <div className="flex-row w-100x">
        <div
          className="fs-14 lh-20 text-ellipsis"
          css={css`
            font-weight: 600;
            color: #333333;
          `}
        >
          {props.contract.contractName}
        </div>
        {/* <div className="policy-button cur-pointer  shrink-0 select-none">策略内容</div> */}
      </div>
      <Tabs defaultActiveKey="1" className="select-none">
        <TabPane tab="合约流转记录" key="1">
          {/* 状态整体 */}
          <div
            className="p-15 brs-6"
            css={css`
              background: #fafbfc;
            `}
          >
            <div className="flex-row">
              {/* <div className="status-dot"></div> */}
              <div
                className={
                  "px-10 mr-5 brs-10 fs-11 h-20 lh-16 text-center select-none " +
                  authClass
                }
                css={css`
                  font-weight: 500;
                  color: #ffffff;
                `}
              >
                {authStatus}
              </div>
              <div
                className="fs-12 lh-18"
                css={css`
                  font-weight: 400;
                  color: rgb(34, 34, 34);
                `}
              >
                {moment(props.contract.updateDate).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}
              </div>
            </div>
            <div className="flex-row pt-15 pb-5 space-between align-center">
              <div
                className="fs-12 lh-20"
                css={css`
                  font-weight: 600;
                  color: #222222;
                `}
              >
                {records[0] && records[0].stateInfoStr} &nbsp; &nbsp; &nbsp;{" "}
                {currentStatus.tec > 1 &&
                  records[0] &&
                  records[0].eventSelectStr}
              </div>
              {
                // @ts-ignore
                currentStatus.tec > 1 && (
                  <Button
                    className="fs-14"
                    disabled={eventIndex === -1}
                    click={payEvent}
                  >
                    支付
                  </Button>
                )
              }
            </div>
            {/* 可选事件 */}
            <div className="flex-row">
              <Radio.Group onChange={onChange} value={eventIndex}>
                <div className="flex-column">
                  {
                    // @ts-ignore
                    currentStatus.eventTranslateInfos &&
                      // @ts-ignore
                      currentStatus.eventTranslateInfos.map(
                        (event: any, index: number) => {
                          // origin.eventId  name
                          return (
                            <div
                              className={
                                "event-card flex-row " +
                                (currentStatus.tec === 1 ||
                                event.origin.name !== "TransactionEvent"
                                  ? "event-card-one "
                                  : "p-10 event-card-more mt-10 ") +
                                (index !== eventIndex || currentStatus.tec === 1
                                  ? ""
                                  : "event-selected")
                              }
                              key={index}
                            >
                              <Radio
                                className=""
                                value={index}
                                disabled={
                                  event.origin.name !== "TransactionEvent"
                                }
                              >
                                <div
                                  className="flex-row fs-14 lh-20 align-center "
                                  css={css`
                                    font-weight: 600;
                                    color: #222222;
                                  `}
                                >
                                  <div className="mr-10 flex-row align-center">
                                    <span>{event.content}</span>
                                    <span
                                      className="ml-10 shrink-0"
                                      css={css`
                                        color: #42c28c;
                                      `}
                                    >
                                      {event.nextState &&
                                      event.nextState.commonAuth
                                        ? "获得授权"
                                        : ""}
                                    </span>
                                  </div>
                                  {currentStatus.tec === 1 &&
                                    event.origin.name ===
                                      "TransactionEvent" && (
                                      <Button
                                        // disabled={index !== eventIndex}
                                        className="fs-12 shrink-0"
                                        click={payEvent}
                                      >
                                        支付
                                      </Button>
                                    )}
                                </div>
                                {/* 执行完成后下一个状态的所有事件 */}
                                <div
                                  className="flex-column  pt-5  fs-12 lh-20"
                                  css={css`
                                    font-weight: 600;
                                    color: #7a869a;
                                  `}
                                >
                                  {/** 事件执行后：分情况，如果是获得授权的事件，那就是---获得授权后
                                   * event.origin.toState
                                   */}
                                  <div className="">
                                    {event.nextState &&
                                    event.nextState.commonAuth
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
                                            <div
                                              className="mr-5 w-4 h-4"
                                              css={css`
                                                background: #7a869a;
                                                border-radius: 50%;
                                              `}
                                            ></div>
                                            <span>{nextEvent.content}</span>
                                          </div>
                                        );
                                      }
                                    )}
                                </div>
                              </Radio>
                            </div>
                          );
                        }
                      )
                  }
                </div>
              </Radio.Group>
            </div>
            {/* 流转记录 */}
            {unfold &&
              records.slice(1).map((item: any, index: number) => {
                return (
                  <div
                    className="brs-6 mt-15 contract-records"
                    css={css`
                      background: #fafbfc;
                      opacity: 0.4;
                    `}
                    key={index}
                  >
                    <div className="flex-row">
                      <div
                        className={
                          "px-10 mr-5 brs-10 fs-11 h-20 lh-16 text-center select-none " +
                          item.authClass
                        }
                        css={css`
                          font-weight: 500;
                          color: #ffffff;
                        `}
                      >
                        {item.authStatus}
                      </div>
                      <div
                        className="fs-12 lh-18"
                        css={css`
                          font-weight: 400;
                          color: #222222;
                        `}
                      >
                        {moment(item.time).format("YYYY-MM-DD HH:mm:ss")}
                      </div>
                    </div>
                    {/* <div className="text-break">{item.sateInfoStr}</div> */}
                    <div className="flex-row py-10 space-between align-center">
                      <div>{item.stateInfoStr}</div>
                    </div>
                  </div>
                );
              })}
            {totalItem > 1 && (
              <div
                className="fs-12 lh-18 text-align-center cur-pointer select-none mt-20"
                css={css`
                  font-weight: 400;
                  color: #7a869a;
                `}
              >
                {!unfold ? (
                  <div
                    onClick={(e) => {
                      getRecords();
                    }}
                  >
                    展开完整流转记录
                    <DownOutlined />
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
            )}
          </div>
          <div
            className="contract-code pt-12 fs-12 lh-18"
            css={css`
              font-weight: 400;
              color: #999999;
            `}
          >
            合同编号 {props.contract.contractId} | 签约时间{" "}
            {moment(props.contract.updateDate).format("YYYY-MM-DD HH:mm")}
          </div>
        </TabPane>
        <TabPane tab="策略内容" key="2">
          <PolicyContent
            translateInfo={props.policy.translateInfo}
          ></PolicyContent>
        </TabPane>
        {/* <TabPane tab="状态机视图" key="3">
          <PolicyGraph policy={props.policy}></PolicyGraph>
        </TabPane> */}
        <TabPane tab="策略代码" key="4">
          <PolicyCode policyText={props.policy.policyText}></PolicyCode>
        </TabPane>
      </Tabs>
    </div>
  );
}
