import { useState, useEffect, useRef } from "react";
import frequest from "@/services/handler";
import user from "@/services/api/modules/user";
import event from "@/services/api/modules/event";
import transaction from "@/services/api/modules/transaction";
import { Popup, Button, Toast, Loading } from "antd-mobile";
import "./pay.scss";
const { getUserInfo } = window.freelogAuth;
interface PayProps {
  isModalVisible: boolean;
  setIsModalVisible: any;
  contractId: string;
  subjectName: string;
  receiver: string;
  contractName: string;
  transactionAmount?: number;
  setModalType: any;
  eventId: any;
  paymentFinish: any;
}

export default function Pay(props: PayProps) {
  const [focus, setFocus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [isAfford, setIsAfford] = useState(true);
  const [isActive, setIsActive] = useState(false);
  // 1: 支付中  2: 支付成功  3: 密码错误   4: 支付失败：需要考虑网络超时
  const [tipType, setTipType] = useState(0);
  const [passwords, setPasswords] = useState<any>(["", "", "", "", "", ""]);
  const [userAccount, setUserAccount] = useState<any>({});
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const input4 = useRef(null);
  const input5 = useRef(null);
  const input0 = useRef(null);
  const inputs = [input0, input1, input2, input3, input4, input5];

  useEffect(() => {
    if (inputVisible) {
      setPasswords(["", "", "", "", "", ""]);
      setTimeout(() => {
        // @ts-ignore
        input0.current.focus();
      }, 100);
    }
  }, [inputVisible]);
  const handleCancel = () => {
    props.setIsModalVisible(false);
  };
  async function getAccount() {
    // @ts-ignore
    const userInfo = await getUserInfo();
    // @ts-ignore
    const res = await frequest(user.getAccount, [userInfo.userId], "");
    setUserAccount(res.data.data);
    // @ts-ignore
    // TODO 需要trycatch  parsefloat
    setIsAfford(res.data.data.balance > props.transactionAmount);
    setIsActive(res.data.data.status === 1);
  }
  useEffect(() => {
    props.isModalVisible && getAccount();
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
        setTimeout(() => {
          // @ts-ignore
          input5.current.focus();
        }, 100);
        return;
      }
      Toast.show({
        icon: "fail",
        content: payResult.data.msg,
        duration: 3000,
      });
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => {
          // @ts-ignore
          input5.current.focus();
        }, 100);
      }, 1500);
      return;
    }
    setTipType(2);
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
        setInputVisible(false);
        setLoading(false);
        setTimeout(() => {
          props.paymentFinish(status);
        }, 10);
      }
    }, 2000);
  }
  return (
    <Popup
      position="bottom"
      bodyClassName="freelog-pay w-100x"
      visible={props.isModalVisible}
    >
      <div className="flex-column px-30">
        {/* 金额 */}
        <div className=" mb-10 flex-row space-between">
          <span className="amount mt-30">
            {props.transactionAmount}
            <span className="type ml-10">羽币</span>
          </span>
          <span
            className="fs-28 mt-10"
            onClick={() => {
              props.setIsModalVisible(false);
            }}
          >
            <i className="iconfont">&#xe637;</i>
          </span>
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
        {loading && tipType < 3 ? (
          <Popup visible={true} className="w-325 h-220 pay-tip">
            {tipType === 1 ? (
              <div className="paying bg-white w-100x h-100x brs-4 flex-column justify-center align-center">
                <div className="loading">
                  支付中
                  <Loading />
                </div>
              </div>
            ) : tipType === 2 ? (
              <div className="paying w-100x h-100x flex-column brs-4  justify-center align-center">
                <div className="pb-15 success flex-row align-center justify-center">
                  <i className="iconfont mr-10">&#xe62d;</i>
                  <span className="mr-10">支付成功</span>
                </div>
                <div className="loading flew-row align-center  pt-15 proccessing">
                  系统处理中请稍后
                  <Loading />
                </div>
              </div>
            ) : null}
          </Popup>
        ) : null}
        {inputVisible && tipType !== 2 ? (
          <Popup
            position="bottom"
            bodyClassName=""
            visible={true}
            className="input-password text-center"
          >
            <div className="password-container bg-white brs-4 px-25 flex-column">
              <div className="pay-title text-center">输入支付密码</div>
              <div
                className="p-absolute  rt-0 pr-24 pt-20"
                onClick={() => setInputVisible(false)}
              >
                <i className="iconfont fs-11">&#xe637;</i>
              </div>
              <div
                className={
                  "flex-row space-between " +
                  (tipType === 3 ? "password-error-input" : "")
                }
              >
                {[0, 0, 0, 0, 0, 0].map((item: any, index: any) => {
                  return (
                    <input
                      type="password"
                      maxLength={1}
                      minLength={1}
                      key={index}
                      className="text-center"
                      ref={inputs[index]}
                      value={passwords[index]}
                      onChange={(e: any) => {}}
                      onClick={(e: any) => {
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
              {tipType === 3 ? (
                <div className="password-error text-align-left mt-8">
                  支付密码错误，请重新输入
                </div>
              ) : null}
              <div
                className="flex-row space-around password-forget my-30 w-100x"
                onClick={() => {
                  props.setModalType(4);
                }}
              >
                忘记支付密码
              </div>
            </div>
          </Popup>
        ) : null}
        <div className=" pt-35 mb-40 text-center">
          <Button
            color="primary"
            size="large"
            disabled={!isAfford && isActive}
            className="w-100x"
            onClick={() => {
              isActive
                ? setInputVisible(true)
                : window.open("http://user." + window.ENV + "/logged/wallet");
            }}
          >
            {loading ? (
              <span>
                支付中...
                {/* <Spin /> */}
              </span>
            ) : isActive ? (
              "立即支付"
            ) : (
              "激活账户"
            )}
          </Button>
        </div>
      </div>
    </Popup>
  );
}
