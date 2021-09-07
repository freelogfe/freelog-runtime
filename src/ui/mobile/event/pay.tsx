import { Input, Spin } from "antd";
import { useState, useEffect, useRef } from "react";
import frequest from "../../../services/handler";
import user from "../../../services/api/modules/user";
import event from "../../../services/api/modules/event";
import transaction from "../../../services/api/modules/transaction";
import { Modal, List, Button, WhiteSpace, Toast } from "antd-mobile";
import "./pay.scss";
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
  const [focus, setFocus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [passwords, setPasswords] = useState<any>(['', '', '', '', '', '']);
  const [userAccount, setUserAccount] = useState<any>({});
  const input1 = useRef(null);
  const input2 = useRef(null);
  const input3 = useRef(null);
  const input4 = useRef(null);
  const input5 = useRef(null);
  const input0 = useRef(null);
  const inputs = [input0, input1, input2, input3, input4, input5]
  const handleOk = () => {
    props.setIsModalVisible(false);
  };
  useEffect(()=>{
    if(visible) {
      // @ts-ignore
      input0.current.focus()
      setPasswords(['', '', '', '', '', ''])
    }
  },[visible])
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
  const pay = async function (password: any) {
    // TODO 防止多次点击
    if (loading) return;
    setLoading(true);
    const payResult = await frequest(event.pay, [props.contractId], {
      eventId: props.eventId,
      accountId: userAccount.accountId,
      transactionAmount: props.transactionAmount,
      password: password,
    });
    if (payResult.data.errCode !== 0) {
      Toast.fail(payResult.data.msg, 2);
      setTimeout(() => {
        setLoading(false);
        // @ts-ignore
        input5.current.focus()
      }, 2000);
      return;
    }
    Toast.success(payResult.data.msg, 2);
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
    }, 2000);

    // setLoading(false);
    //   eventId: "string",  contractId
    //   accountId: "int",
    //   transactionAmount: "string",
    //   password: "string"
  }
  return (
    <Modal
      popup
      visible={props.isModalVisible}
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
          <span
            className="fs-28 mt-10"
            onClick={() => {
              props.setIsModalVisible(false);
            }}
          >
            x
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
        <Modal
          visible={visible}
          transparent
          maskClosable={false}
          title="输入支付密码"
          className="w-325  input-password"
        >
          <div
            className="p-absolute fs-20 rt-0 pr-15 pt-5"
            onClick={() => setVisible(false)}
          >
            x
          </div>
          <div className="flex-row space-between">
            {[0, 0, 0, 0, 0, 0].map((item: any, index: any) => {
              return <input
                type="password"
                maxLength={1}
                minLength={1}
                key={index}
                ref={inputs[index]}
                value={passwords[index]}
                onChange={(e: any) => {
                  console.log(e)
                }}
                onClick={(e: any) => {
                  // @ts-ignore
                  inputs[focus].current.focus()
                }}
                onKeyDown={(e: any) => {
                  
                  console.log(e, 'keydown')
                  const p = [...passwords]
                  if (e.keyCode === 8 && index > 0 && !parseInt(p[index])) {
                    // @ts-ignore
                    if(inputs[index - 1]){
                      // @ts-ignore
                     inputs[index - 1].current.focus()
                      setFocus(index - 1)
                    } 
                    p[index - 1] = ''
                    setPasswords(p);
                    return
                  }
                  if (parseInt(e.key)) {
                    p[index] = e.key
                    
                    if(inputs[index + 1]){
                      // @ts-ignore
                     inputs[index + 1].current.focus()
                      setFocus(index + 1)
                    } 
                    if (index === 5) {
                      const password = p.join('')
                      pay(password)
                    }
                  } else {
                    p[index] = ''
                  }
                  setPasswords(p);
                }}
              />
            })}

          </div>
          <div className="flex-row space-around password-forget pb-30">忘记密码</div>
        </Modal>
        <div className=" pt-35 mb-40">
          <Button
            type="primary"
            size="large"
            className=""
            onClick={() => {
              setVisible(true);
              
              // prompt(
              //   "输入密码",
              //   "",
              //   [
              //     { text: "取消" },
              //     { text: "提交", onPress: (password) => pay(password) },
              //   ],
              //   "secure-text"
              // );
            }}
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
