import { Radio, Input, Space } from "antd";
import { useState, useEffect } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import "./contract.scss";
var moment = require("moment");

interface ItemProps {
  contract: any;
  children?: any;
}
interface CurrentStatus {
  status: string;
  transitions: Array<any>;
  [propName: string]: any
}
export default function (props: ItemProps) {
  const [value, setValue] = useState(0);
  const [unfold, setUnFold] = useState(false);
  const [authClass, setAuthClass] = useState("bg-auth-non");
  const [authStatus, setAuthStatus] = useState("未授权");
  const [currentStatus, setCurrentStatus] = useState({})
  useEffect(() => {
    console.log(props.contract);
    setAuthStatus(
      props.contract.status === 1
        ? "已终止"
        : props.contract.status === 128
          ? "未授权"
          : "已授权"
    );
    setAuthClass(
      props.contract.status === 1
        ? "bg-auth-end"
        : props.contract.status === 128
          ? "bg-auth-non"
          : "bg-auth"
    );
    props.contract.policyInfo.translateInfo.fsmInfos.forEach((item: any) => {
      if (item.stateInfo.origin === props.contract.fsmCurrentState) {
        const data = { status: props.contract.fsmCurrentState, ...item, ...props.contract.policyInfo.fsmDescriptionInfo[props.contract.fsmCurrentState] }
        console.log(data)
        // @ts-ignore
        setCurrentStatus(data)
      }
    })

  }, [props.contract]);
  function onChange(e: any) {
    console.log(e)
    setValue(e.target.value)
  }
  return (
    <div className="contract-card px-20 py-15 mt-15 w-100x">
      <div className="flex-row w-100x">
        <div className="contract-name  text-ellipsis">
          {props.contract.contractName}
        </div>
        <div className="policy-button cur-pointer  shrink-0">策略内容</div>
      </div>
      {/* 状态整体 */}
      <div className="status-card p-15 mt-15">
        <div className="flex-row">
          <div className={"auth-status text-center " + authClass}>
            {authStatus}
          </div>
          <div className="auth-time">
            {moment(props.contract.updateDate).format("YYYY-MM-DD HH:mm")}
          </div>
        </div>
        <div className="flex-row py-10">
          <div>当前无授权，请选择执行事件</div>
          <div>支付</div>
        </div>
        {/* 可选事件 */}
        <div>
          <div className="flex-row">
            <Radio.Group onChange={onChange} value={value}>
              <div className="flex-column">
                {
                  // @ts-ignore
                  currentStatus.eventTranslateInfos && currentStatus.eventTranslateInfos.map((event: any) => {
                    // origin.id  name 
                    return <Radio value={event.origin.id} disabled={event.origin.name !== "TransactionEvent"}>{event.content}</Radio>
                  })
                }

              </div>
            </Radio.Group>
          </div>
        </div>
        <div className="fluent-record text-align-center cur-pointer select-none mt-20">
          {" "}
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
    </div>
  );
}
