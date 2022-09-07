import { css } from "astroturf";
import { useState, useEffect, useRef } from "react";
import frequest from "@/services/handler";
import user from "@/services/api/modules/user";
import event from "@/services/api/modules/event";
import transaction from "@/services/api/modules/transaction";
import { Popup, Button, Toast, Loading } from "antd-mobile";
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
  const titleItem = css`
    padding: 20px 0 5px 0;
    font-size: 14px;
    font-weight: 400;
    color: #222222;
    line-height: 20px;
  `;
  const contentItem = css`
    font-size: 16px;
    font-weight: 600;
    color: #222222;
    line-height: 22px;
  `;
  const [focus, setFocus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [isAfford, setIsAfford] = useState(true);
  const [isActive, setIsActive] = useState(false);
  // 1: 支付中  2: 支付成功  3: 密码错误   4: 支付失败：需要考虑网络超时
  const [tipType, setTipType] = useState(0);
  const [errorTip, setErrorTip] = useState('');
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
      if (payResult.data.data && ['E1013',"E1010"].includes(payResult.data.data.code)){
        setTipType(3);
        // setPasswords(["", "", "", "", "", ""]);
        setErrorTip(payResult.data.data.code=== "E1010"? '支付密码错误，请重新输入' : '不支持向自己付款')
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
    <>
      <Popup
        position="bottom"
        bodyClassName=" w-100x"
        css={css`
          text-align: left !important;
          border-radius: 10px 10px 0px 0px;
        `}
        visible={props.isModalVisible}
      >
        <div className="flex-column px-30">
          {/* 金额 */}
          <div className=" mb-10 flex-row space-between">
            <span
              css={css`
                font-size: 50px;
                font-weight: 600;
                color: #222222;
                line-height: 56px;
              `}
              className=" mt-30"
            >
              {props.transactionAmount}
              <span
                css={css`
                  font-size: 14px;
                  font-weight: 400;
                  color: #666666;
                  line-height: 20px;
                `}
                className=" ml-10"
              >
                羽币
              </span>
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
            <div className={titleItem}>标的物</div>
            <div className={contentItem + " text-ellipsis"}>
              {props.subjectName}
            </div>

            <div className={titleItem}>授权合约</div>
            <div className={contentItem + " text-ellipsis"}>
              {props.contractName}
            </div>

            <div className={titleItem}>收款方</div>
            <div className={contentItem + " text-ellipsis"}>
              {props.receiver}
            </div>

            <div className={titleItem}>支付方式</div>
            <div className={contentItem}>
              <span className="">羽币账户</span>
              <span
                css={css`
                  font-size: 16px;
                  font-weight: 600;
                  color: #999999;
                  line-height: 22px;
                `}
              >
                （余额{userAccount.balance}枚）
              </span>
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

          <div className=" pt-35 mb-40 flex-column-center">
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
      {loading && tipType < 3 ? (
        <Popup visible={true} className="w-325 h-220 pop-body-center1">
          {tipType === 1 ? (
            <div className="paying bg-white w-100x h-100x brs-4 flex-column justify-center align-center">
              <div
                css={css`
                  border: none !important;
                  font-size: 20px;
                  font-weight: 400;
                  color: #2784ff;

                  &::before {
                    border: none !important;
                  }
                `}
              >
                支付中
                <Loading />
              </div>
            </div>
          ) : tipType === 2 ? (
            <div className="paying w-100x h-100x flex-column brs-4  justify-center align-center">
              <div
                className="pb-15 flex-row align-center justify-center"
                css={css`
                  font-size: 16px;
                  font-weight: 400;
                  color: #222222;
                `}
              >
                <i
                  className="iconfont mr-10"
                  css={css`
                    color: #44c28c;
                    font-size: 24px;
                  `}
                >
                  &#xe62d;
                </i>
                <span className="mr-10">支付成功</span>
              </div>
              <div
                css={css`
                  font-size: 20px;
                  font-weight: 400;
                  color: #222222;
                `}
                className="loading flew-row align-center  pt-15 proccessing"
              >
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
          className="flex-column-center pop-body-center"
        >
          <div className="password-container bg-white brs-4 px-25 flex-column">
            <div
              css={css`
                font-size: 16px;
                font-weight: 600;
                color: #222222;
                padding: 30px 0 40px 0;
              `}
              className="flex-column-center"
            >
              输入支付密码
            </div>
            <div
              className="p-absolute  rt-0 pr-24 pt-20"
              onClick={() => setInputVisible(false)}
            >
              <i className="iconfont fs-11">&#xe637;</i>
            </div>
            <div className={"flex-row space-between "}>
              {[0, 0, 0, 0, 0, 0].map((item: any, index: any) => {
                return (
                  <input
                    type="password"
                    maxLength={1}
                    minLength={1}
                    css={css`
                      font-size: 14px !important;
                      font-weight: 400 !important;
                      width: 40px;
                      height: 48px;
                      caret-color: transparent;
                      overflow: hidden;
                      box-sizing: border-box;
                      line-height: 48px;
                      font-size: 42px;
                      background: #ffffff;
                      text-align: center;
                      border-radius: 4px;
                      border: ${tipType === 3
                        ? "1px solid #EE4040"
                        : "1px solid #d4d4d4"};
                      outline: none;

                      &:focus {
                        border: 1px solid #2784ff !important;
                      }
                    `}
                    key={index}
                    className="flex-column-center"
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
              <div
                css={css`
                  font-size: 14px;
                  font-weight: 400;
                  color: #ee4040;
                `}
                className=" text-align-left mt-8"
              >
                {errorTip}
              </div>
            ) : null}
            <span
              css={css`
                font-size: 14px;
                font-weight: 400;
                color: #999999;
              `}
              className="flex-row space-around my-30 w-100x"
              onClick={() => {
                props.setModalType(4);
              }}
            >
              忘记支付密码
            </span>
          </div>
        </Popup>
      ) : null}
    </>
  );
}
