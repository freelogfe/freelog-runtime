import { Modal, Input, Spin } from "antd";
import Button from "../_components/button";
import "./pay.scss";
import { useState, useEffect, useRef } from "react";
import frequest from "@/services/handler";
import user from "@/services/api/modules/user";
import event from "@/services/api/modules/event";
import transaction from "@/services/api/modules/transaction";
import { LoadingOutlined } from "@ant-design/icons";
import Tip from "../_components/tip";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { getUserInfo } = window.freelogAuth;
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

export default function Pay(props: PayProps) {
  const [passwords, setPasswords] = useState<any>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  // 1: 支付中  2: 支付成功  3: 密码错误   4: 支付失败：需要考虑网络超时
  const [tipType, setTipType] = useState(0);
  const [focus, setFocus] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isTipVisible, setIsTipVisible] = useState(false);
  const [tipConfig, setTipConfig] = useState({
    content: "",
    type: "success",
    mask: false,
  });
  const [userAccount, setUserAccount] = useState<any>({});
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const input4 = useRef(null);
  const input5 = useRef(null);
  const input0 = useRef(null);
  const inputs = [input0, input1, input2, input3, input4, input5];
  const handleOk = () => {
    props.setIsModalVisible(false);
  };
  const handleCancel = () => {
    // TODO 提示支付中
    !loading && props.setIsModalVisible(false);
  };
  async function getAccount() {
    // @ts-ignore
    const userInfo = await getUserInfo();
    // @ts-ignore
    const res = await frequest(user.getAccount, [userInfo.userId], "");
    setUserAccount(res.data.data);
    setIsActive(res.data.data.status === 1)
  }
  useEffect(() => {
    setVisible(props.isModalVisible);
    if (props.isModalVisible) {
      setPasswords(["", "", "", "", "", ""]);
      setTimeout(() => {
        // @ts-ignore
        input0.current.focus();
      }, 200);
      setIsTipVisible(false);
      getAccount();
    }
  }, [props.isModalVisible]);
  async function pay(password: any) {
    // TODO 防止多次点击
    if (loading) return;
    setTipType(1);
    setLoading(true);
    const payResult = await frequest(event.pay, [props.contractId], {
      eventId: props.eventId,
      accountId: userAccount.accountId,
      transactionAmount: props.transactionAmount,
      password: password,
    });
    // 这里考虑支付超时
    if (payResult.data.errCode !== 0) {
      if (payResult.data.data && payResult.data.data.code === "E1010") {
        setTipType(3);
        // setPasswords(["", "", "", "", "", ""]);
        setLoading(false);
        // setFocus(0)
        setTimeout(() => {
          // @ts-ignore
          input5.current.focus();
        }, 100);
        return;
      }
      setIsTipVisible(true);
      setTipConfig({
        content: payResult.data.msg,
        type: "error",
        mask: false,
      });
      setTimeout(() => {
        // setPasswords(["", "", "", "", "", ""]);
        // setFocus(0)
        setLoading(false);
        setTimeout(() => {
          // @ts-ignore
          input5.current.focus();
        }, 100);
      }, 1500);
      return;
    }
    setIsTipVisible(true);
    setTipType(2);
    setTipConfig({
      content: "支付成功, 系统处理中...",
      type: "success",
      mask: true,
    });
    // TODO 查交易状态, flag应该设为状态，在关闭弹窗时清除
    const flag = setInterval(async () => {
      const res: any = await frequest(
        transaction.getRecord,
        [payResult.data.data.transactionRecordId],
        ""
      );
      const status = res.data.data.status;
      if ([2, 3, 4].includes(status)) {
        window.clearInterval(flag);
        setIsTipVisible(false);
        setLoading(false);
        setTimeout(() => {
          props.paymentFinish(status);
        }, 10);
      }
    }, 2000);
  }
  return (
    <Modal
      title="支付"
      zIndex={1201}
      centered
      footer={null}
      visible={visible}
      className="w-600 "
      maskClosable={false}
      onOk={handleOk}
      onCancel={handleCancel}
      wrapClassName="freelog-pay"
    >
      <Tip
        {...tipConfig}
        isModalVisible={isTipVisible}
        setIsModalVisible={setIsTipVisible}
      />
      <div className="flex-column ">
        {/* 金额 */}
        <div className="amount text-center my-40 px-80">
          <span className="ml-30">
            {props.transactionAmount}
            <span className="type ml-10">羽币</span>
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
            <div className="right-item text-ellipsis">
              <span className="">羽币账户</span>
              <span className="balance">（余额{userAccount.balance}枚）</span>
            </div>
          </div>
        </div>
        {!isActive ? (
          <div className={"text-center my-40"}>
            <div className="enter-tip mb-20">如需支付请先激活羽币账户</div>
            <Button className="w-184 h-38 text-center" type="primary brs-10" click={()=>{
              window.open("http://user." + window.ENV + "/logged/wallet");
            }}>激活羽币账户</Button>
          </div>
        ) : null}
        <div className={"text-center mt-40 " + (!isActive ? "d-none" : "")}>
          {tipType === 0 ? (
            <div className="enter-tip mb-20">输入支付密码进行支付</div>
          ) : tipType === 1 ? (
            <div className="mb-20">
              <Spin
                indicator={antIcon}
                style={{ fontSize: "12px !important" }}
              />
              <span className="paying flex-1 ml-5">正在支付中...</span>
            </div>
          ) : null}
          {tipType === 3 ? (
            <div className="password-error mt-5 mb-20">
              支付密码错误，请重新输入
            </div>
          ) : null}
          <div className={"" + (tipType === 3 ? "password-error-input" : "")}>
            {[0, 0, 0, 0, 0, 0].map((item: any, index: any) => {
              return (
                <input
                  type="password"
                  maxLength={1}
                  minLength={1}
                  key={index}
                  ref={inputs[index]}
                  value={passwords[index]}
                  onChange={(e: any) => {}}
                  onClick={(e: any) => {
                    setTipType(0);
                    // @ts-ignore
                    inputs[focus].current.focus();
                  }}
                  onKeyDown={(e: any) => {
                    setTipType(0);
                    // alert(e.keyCode)
                    const p = [...passwords];
                    if (
                      [46, 8, 229].includes(e.keyCode) &&
                      index > 0 &&
                      isNaN(parseInt(p[index]))
                    ) {
                      // @ts-ignore
                      if (inputs[index - 1]) {
                        // @ts-ignore
                        inputs[index - 1].current.focus();
                        setFocus(index - 1);
                      }
                      p[index - 1] = "";
                      setPasswords(p);
                      return;
                    }
                    if (!isNaN(parseInt(e.key))) {
                      p[index] = e.key;

                      if (inputs[index + 1]) {
                        // @ts-ignore
                        inputs[index + 1].current.focus();
                        setFocus(index + 1);
                      }
                      if (index === 5) {
                        const password = p.join("");
                        pay(password);
                      }
                    } else {
                      p[index] = "";
                    }
                    setPasswords(p);
                  }}
                />
              );
            })}
          </div>
          <div
            className="forgot-p cur-pointer"
            onClick={() => {
              window.open("http://user." + window.ENV + "/retrievePayPassword");
            }}
          >
            忘记密码
          </div>
        </div>

        {/* <div className="px-80 pt-5">
          <Input.Password
            size="large"
            ref={inputP}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            maxLength={6}
            value={password}
            placeholder="输入6位支付密码"
          />
        </div> */}
        {/* <div className="px-80 pt-20">
          <Button
            click={pay}
            disabled={password.length !== 6 || loading}
            className="py-9"
          >
            {loading ? (
              <span>
                支付中...
                <Spin />
              </span>
            ) : (
              "确认支付"
            )}
          </Button>
        </div> */}
      </div>
    </Modal>
  );
}
