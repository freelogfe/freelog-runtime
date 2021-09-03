import { Input, Spin } from "antd";
import { useState, useEffect } from "react";
import frequest from "../../../services/handler";
import user from "../../../services/api/modules/user";
import event from "../../../services/api/modules/event";
import transaction from "../../../services/api/modules/transaction";
import { Modal, List, Button, WhiteSpace, WingBlank } from "antd-mobile";
import './pay.scss'
import { getUserInfo } from "../../../platform/structure/utils";
const prompt = Modal.prompt;

interface PayProps {
  isModalVisible: boolean;
  setIsModalVisible: any;
  contractId: string;
  subjectName: string;
  receiver: string;
  contractName: string;
  transactionAmount?: number;
  eventId: any;
  paymentFinish: any;
}

export default function (props: PayProps) {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userAccount, setUserAccount] = useState<any>({});
  const handleOk = () => {
    props.setIsModalVisible(false);
  };
  const handleCancel = () => {
    props.setIsModalVisible(false);
  };
  async function getAccount() {
    // @ts-ignore
    const userInfo = await getUserInfo();
    // @ts-ignore
    const res = await frequest(user.getAccount, [userInfo.userId], "");
    setUserAccount(res.data.data);
  }
  useEffect(() => {
    setVisible(props.isModalVisible);
    props.isModalVisible && getAccount();
  }, [props.isModalVisible]);
  async function pay(password: any) {
    // TODO 防止多次点击
    if (loading) return;
    setLoading(true);
    const payResult = await frequest(event.pay, [props.contractId], {
      eventId: props.eventId,
      accountId: userAccount.accountId,
      transactionAmount: props.transactionAmount,
      password: password,
    });
    console.log(payResult);
    // TODO 查交易状态, flag应该设为状态，在关闭弹窗时清除
    const flag = setInterval(async () => {
      const res: any = await frequest(
        transaction.getRecord,
        [payResult.data.data.transactionRecordId],
        ""
      );
      const status = res.data.data.status;
      console.log(res);
      if ([2, 3, 4].includes(status)) {
        props.paymentFinish(status);
        setLoading(false);
        window.clearInterval(flag);
      }
    }, 1000);

    // setLoading(false);
    //   eventId: "string",  contractId
    //   accountId: "int",
    //   transactionAmount: "string",
    //   password: "string"
  }
  return (
    <Modal
      popup
      visible={visible}
      maskClosable={false}
      onClose={handleCancel}
      animationType="slide-up"
      wrapClassName="freelog-pay"
    >
      <div className="flex-column px-30">
        {/* 金额 */}
        <div className=" mb-10 flex-row space-between">
          <span className="amount mt-30">
            {props.transactionAmount}
            <span className="type ml-10">羽币</span>
          </span>
          <span className="fs-28 mt-10" onClick={()=>{props.setIsModalVisible(false)}}>x</span>
        </div>
        <div className="flex-column over-h">
            <div className="title-item">标的物</div>
            <div className="content-item text-ellipsis">{props.subjectName}</div>

            <div className="title-item">授权合约</div>
            <div className="content-item text-ellipsis">{props.contractName}</div>

            <div className="title-item">收款方</div>
            <div className="content-item text-ellipsis">{props.receiver}</div>

            <div className="title-item">支付方式</div>
            <div className="content-item">
              <span className="">羽币账户</span>
              <span className="balance">（余额{userAccount.balance}枚）</span>
            </div>
        </div>
        {/* <div className="forgot-p text-align-right px-80 mt-18 cur-pointer">
          忘记密码
        </div> */}
        {/* <div className="px-80 pt-5">
          <Input.Password
            size="large"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            maxLength={6}
            value={password}
            placeholder="输入6位支付密码"
          />
        </div> */}
        <div className=" pt-35 mb-40">
          <Button
            type="primary"
            size="large"
            className=""
            onClick={() => prompt(
              '输入密码',
              '',
              [
                { text: '取消' },
                { text: '提交', onPress: password => pay(password) },
              ],
              'secure-text',
            )}
          >
            {loading ? (
              <span>
                支付中...
                <Spin />
              </span>
            ) : (
              "立即支付"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
