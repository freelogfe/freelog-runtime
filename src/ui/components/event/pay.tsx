import { Modal, Input } from "antd";
import Button from "../_components/button";
import "./pay.scss";
import { useState, useEffect } from "react";
import frequest from "../../../services/handler";
import getAccount from "../../../services/api/modules/user";

interface PayProps {
  isModalVisible: boolean;
  setIsModalVisible: any;
  contractId?: string;
  subjectName?: string;
  receiver: string;
  contractName?: string;
  transactionAmount?: number;
  eventId?: any;
}

export default function (props: PayProps) {
  const [password, setPassword] = useState('');

  const handleOk = () => {
    props.setIsModalVisible(false);
  };
  const handleCancel = () => {
    props.setIsModalVisible(false);
  };
  useEffect(()=>{
    if(props.isModalVisible){
      // 请求付款账户信息
    }
  },[props.isModalVisible])
  function pay(){
    // eventId: "string",  contractId
    //   accountId: "int",
    //   transactionAmount: "string",
    //   password: "string" 
  }
  return (
    <Modal
      title="支付"
      zIndex={1201}
      centered
      footer={null}
      visible={props.isModalVisible}
      className="w-600 "
      onOk={handleOk}
      onCancel={handleCancel}
      wrapClassName="freelog-pay"
      getContainer={document.getElementById("runtime-root")}
    >
      <div className="flex-column ">
        {/* 金额 */}
        <div className="amount text-center my-40 px-80">
          <span>
            100<span className="type ml-10">羽币</span>
          </span>
        </div>
        <div className="flex-row px-80 over-h">
          <div className="flex-column shrink-0">
            <div className="left-item">标的物</div>
            <div className="left-item">授权合约</div>
            <div className="left-item">收款方</div>
            <div className="left-item">支付方式</div>
          </div>
          <div className="flex-column flex-1">
            <div className="right-item text-ellipsis">{props.subjectName}</div>
            <div className="right-item text-ellipsis">{props.contractName}</div>
            <div className="right-item text-ellipsis">{props.receiver}</div>
            <div className="right-item text-ellipsis">支付方式</div>
          </div>
        </div>
        <div className="forgot-p text-align-right px-80 mt-18 cur-pointer">忘记密码</div>
        <div className="px-80 pt-5"><Input.Password size="large" onChange={(e)=>{setPassword(e.target.value)}} maxLength={6} value={password} placeholder="输入6位支付密码" /></div>
        <div className="px-80 pt-20"><Button click={pay} disabled={password.length!==6} className="py-9">确认支付</Button></div>
      </div>
    </Modal>
  );
}
