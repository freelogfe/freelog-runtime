import user from "../../../services/api/modules/user";
import frequest from "../../../services/handler";
import { checkPhone, checkEmail, checkPassword } from "../../../utils/utils";
import { Modal, Button, Toast } from "antd-mobile";

import { useState, useEffect } from "react";
import "./forgot.scss";
export const LOGIN_PASSWORD = "login";
export const PAY_PASSWORD = "pay";
interface ForgotProps {
  visible: boolean;
  setModalType: any;
  type: "login" | "pay";
  children?: any;
}
export default function(props: ForgotProps) {
  const [errorTip, setErrorTip] = useState<any>({
    phone: "",
    email: "",
    authCode: "",
    password: "",
    password2: "",
    loginPassword: "",
  });
  // 1 验证登录密码   2 验证码   3 password
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(3);
  const [available, setAvailable] = useState(false);
  const [countDown, setCountDown] = useState(60);
  const [authCode, setAuthCode] = useState("");
  const [authCodeLoading, setAuthCodeLoading] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  // loginName: phone | email
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // 1 phone    2 email
  const [registerType, setRegisterType] = useState(1);
  const verify = (type: any, value: any) => {
    value = value ? value : "";
    const obj: any = {
      [type]: "",
    };
    if (type === "loginPassword") {
      obj[type] = value ? "" : "请输入密码";
    }
    if (type === "phone" && !checkPhone(value)) {
      obj[type] = value ? "手机号格式不正确" : "请输入手机号";
    }
    if (type === "email" && !checkEmail(value)) {
      obj[type] = value ? "无效邮箱地址" : "请输入邮箱地址";
    }
    if (type === "authCode") {
      obj[type] = value ? "" : "请输入验证码";
    }
    if (["password", "password2"].includes(type)) {
      if (value && !checkPassword(value)) {
        obj[type] = "密码长度必须为6-24个字符，必须包含数字和字母";
      } else {
        obj[type] = value ? "" : "请输入密码";
      }
    }
    if (["password", "password2"].includes(type)) {
      if (type === "password") {
        if (password2) {
          obj.password2 = password2 !== value ? "两次密码不一致" : "";
        }
      }
      if (type === "password2" && password) {
        obj[type] = password !== value ? "两次密码不一致" : "";
      }
    }
    const errors = {
      ...errorTip,
      ...obj,
    };
    setErrorTip(errors);
    const values: any = {
      authCode,
      password,
      loginName: registerType === 1 ? phone : email,
    };
    const flag1 = Object.keys(errors).some((key: any) => {
      if (errors[key]) {
        return true;
      }
    });
    const flag2 = Object.keys(values).some((key: any) => {
      if (!values[key]) {
        return true;
      }
    });
    setAvailable(!(flag1 || flag2));
  };
  useEffect(() => {
    if (!authCodeLoading) return;
    const timer = window.setInterval(() => {
      if (countDown <= 0) {
        window.clearInterval(timer);
        setAuthCodeLoading(false);
        setCountDown(60);
        return;
      }
      setCountDown((prevTime) => {
        if (prevTime <= 0) {
          window.clearInterval(timer);
          setAuthCodeLoading(false);
          return 60;
        }
        return prevTime - 1;
      }); // <-- Change this line!
    }, 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, [authCodeLoading]);
  const getAuthCode = async () => {
    setAuthCodeLoading(true);
    setCountDown(60);
    const authCodeRes = await frequest(user.getAuthCode, "", {
      loginName: registerType === 1 ? phone : email,
      authCodeType:
        props.type === PAY_PASSWORD
          ? "updateTransactionAccountPwd"
          : "resetPassword",
    });
    if (authCodeRes.data.errCode !== 0) {
      const obj: any = {};
      obj[registerType === 1 ? "phone" : "email"] = authCodeRes.data.msg;

      setErrorTip({
        ...errorTip,
        ...obj,
      });
      setAuthCodeLoading(false);
    }
  };
  useEffect(() => {
    if (props.type === LOGIN_PASSWORD) {
      setStep(2);
    } else {
      setStep(1);
    }
  }, []);
  useEffect(() => {
    if (!success) {
      return;
    }
    const timer = window.setInterval(() => {
      setCount((prevTime) => {
        if (prevTime <= 0) {
          window.clearInterval(timer);
          setSuccess(false);
          return 3;
        }
        return prevTime - 1;
      }); // <-- Change this line!
    }, 1000);
    return () => {
      props.setModalType(1);
      window.clearInterval(timer);
    };
  }, [success]);
  const loginVerify = async () => {
    setLoading(true);
    let res;
    const values: any = {
      password: loginPassword, 
    };
    res = await frequest(user.loginVerify, "", values);
    if (res.data.errCode === 0 && res.data.data.isVerifySuccessful) {
      const obj: any = { loginPassword: '' };
      setErrorTip({
        ...errorTip,
        ...obj,
      });
      setLoading(false);
      setStep(2);
    } else {
      Toast.fail(res.data.msg, 2);
      const obj: any = { loginPassword: res.data.msg };
      setErrorTip({
        ...errorTip,
        ...obj,
      });
      setTimeout(() => setLoading(false), 2000);
    }
  };
  const authCodeVerify = async () => {
    setLoading(true);
    let res;
    const values: any = {
      authCode,
      authCodeType:
        props.type === LOGIN_PASSWORD
          ? "resetPassword"
          : "updateTransactionAccountPwd",
      address: registerType === 1 ? phone : email,
    };
    res = await frequest(user.putResetPayPassword, "", values);
    if (res.data.errCode === 0) {
      setLoading(false);
      setStep(3);
    } else {
      Toast.fail(res.data.msg, 2);
      const obj: any = { authCode: res.data.msg };
      setErrorTip({
        ...errorTip,
        ...obj,
      });
      setTimeout(() => setLoading(false), 2000);
    }
  };
  const onFinish = async () => {
    setLoading(true);
    let res;
    if (props.type === LOGIN_PASSWORD) {
      const values: any = {
        password,
        authCode,
      };
      res = await frequest(
        user.putResetPassword,
        [registerType === 1 ? phone : email],
        values
      );
    } else {
      const values: any = {
        password,
        authCode,
        loginPassword,
        messageAddress: registerType === 1 ? phone : email,
      };
      res = await frequest(user.putResetPayPassword, "", values);
    }

    if (res.data.errCode === 0) {
      setSuccess(true);
      setLoading(false);
      setCount(3);
    } else {
      Toast.fail(res.data.msg, 2);
      if (res.data.msg.indexOf("未找到有效用户") === 0) {
        const obj: any = { loginName: res.data.msg };
        setErrorTip({
          ...errorTip,
          ...obj,
        });
      }
      if (res.data.msg.indexOf("验证码") === 0) {
        const obj: any = { authCode: res.data.msg };
        setErrorTip({
          ...errorTip,
          ...obj,
        });
      }
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <Modal
      popup
      visible={props.visible}
      maskClosable={false}
      animationType="slide"
      className="w-100x h-100x"
      wrapClassName="user-forgot"
    >
      {step === 1 ? (
        <div className="w-100x h-100x flex-column align-center y-auto">
          <div className="mt-40 mb-40 flex-column px-30 self-start">
            <div className="forgot-title self-start">登录密码验证</div>
            <div className="forgot-tip self-start text-align-left mt-10">
              设置新的支付密码前，首先需要进行登陆密码的验证
            </div>
          </div>
          <div className="forgot-container flex-column justify-center px-30 mt-118">
            <input
              type="password"
              value={loginPassword}
              className="w-100x   mb-5 common-input"
              placeholder="输入新密码"
              onChange={(e) => {
                verify('loginPassword', loginPassword)
                setLoginPassword(e.target.value);
              }}
            />
            {errorTip.password !== "" ? (
              <div className="error-tip  self-start">{errorTip.password}</div>
            ) : null}
            <Button
              loading={loading}
              type="primary"
              className="mt-15"
              onClick={loginVerify}
              disabled={!available}
            >
              {loading ? "验证中" : "下一步"}
            </Button>
          </div>
        </div>
      ) : step === 2 ? (
        <div className="w-100x h-100x flex-column align-center y-auto">
          <div className="flex-1 w-100x flex-column align-center shrink-0">
            <div className="forgot-title  mt-40 mb-87 flex-column px-30 self-start">
              <div className="forgot-title self-start">
                {props.type === LOGIN_PASSWORD ? "身份验证" : "身份验证"}
              </div>
              <div className="forgot-tip self-start text-align-left mt-10">
                {props.type === LOGIN_PASSWORD
                  ? "为了您的登录安全，需要验证手机或邮箱，验证成功后即可设置新的登录密码"
                  : "为了您的支付安全，请进行双重验证，验证成功后即可设置新的支付密码"}
              </div>
            </div>
            <div className="forgot-type mb-20  flex-row px-30 self-start align-center">
              <input
                type="radio"
                id="phone-type"
                name="forgot-type"
                className="mr-4 common-input"
                checked={registerType === 1}
                value="1"
                onChange={(e) => {
                  verify("phone", phone);
                  setRegisterType(parseInt(e.target.value));
                }}
              />{" "}
              <label
                htmlFor="phone-type"
                className={registerType === 1 ? "selected mr-20" : " mr-20"}
              >
                手机号验证
              </label>
              <input
                type="radio"
                id="mail-type"
                name="forgot-type"
                className="mr-4 common-input"
                checked={registerType === 2}
                onChange={(e) => {
                  verify("email", email);
                  setRegisterType(parseInt(e.target.value));
                }}
                value="2"
              />{" "}
              <label
                htmlFor="mail-type"
                className={registerType === 2 ? "selected" : ""}
              >
                邮箱验证
              </label>
            </div>
            <div className="forgot-container flex-column justify-center px-30">
              {registerType === 1 ? (
                <input
                  type="text"
                  value={phone}
                  className="w-100x  mb-5 mt-15 common-input"
                  placeholder={"手机号"}
                  onChange={(e) => {
                    verify("phone", e.target.value);
                    setPhone(e.target.value);
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={email}
                  className="w-100x  mb-5 mt-15 common-input"
                  placeholder={"邮箱地址"}
                  onChange={(e) => {
                    verify("email", e.target.value);
                    setEmail(e.target.value);
                  }}
                />
              )}
              {errorTip[registerType === 1 ? "phone" : "email"] !== "" ? (
                <div className="error-tip self-start">
                  {errorTip[registerType === 1 ? "phone" : "email"]}
                </div>
              ) : null}
              <div className="flex-row mb-5 mt-15">
                <div className="pr-10 flex-1 auth-code">
                  <input
                    type="text"
                    value={authCode}
                    className="w-100x common-input"
                    placeholder="验证码"
                    onChange={(e) => {
                      verify("authCode", e.target.value);
                      setAuthCode(e.target.value);
                    }}
                  />
                </div>
                <div className="shrink-0 fs-16  w-100">
                  <Button
                    loading={loading}
                    type="primary"
                    className="fs-16"
                    disabled={
                      authCodeLoading ||
                      (registerType === 1
                        ? !phone || errorTip.phone
                        : !email || errorTip.email)
                    }
                    onClick={() => {
                      getAuthCode();
                    }}
                  >
                    {authCodeLoading ? <span>{countDown}s</span> : "获取验证码"}
                  </Button>
                </div>
              </div>
              {errorTip.authCode !== "" ? (
                <div className="error-tip self-start">{errorTip.authCode}</div>
              ) : null}
              <Button
                loading={loading}
                type="primary"
                className="mt-15"
                onClick={authCodeVerify}
                disabled={!available}
              >
                {loading ? "验证中" : "下一步"}
              </Button>
            </div>
          </div>
        </div>
      ) : step === 3 ? (
        <div className="w-100x h-100x flex-column align-center y-auto">
          <div className="flex-1 w-100x flex-column align-center shrink-0">
            <div className="forgot-title  mt-40  mb-87 flex-column px-30 self-start">
              <div className="forgot-title self-start">
                {props.type === LOGIN_PASSWORD
                  ? "重置登录密码"
                  : "重置支付密码"}
              </div>
              <div className="forgot-tip self-start text-align-left mt-10">
                {props.type === LOGIN_PASSWORD
                  ? "现在您可以设置新的登录密码"
                  : "现在您可以设置新的支付密码，重置成功后即可进行支付服务"}
              </div>
            </div>
            <div className="forgot-container flex-column justify-center px-30">
              {errorTip.authCode !== "" ? (
                <div className="error-tip self-start">{errorTip.authCode}</div>
              ) : null}
              <input
                type="password"
                value={password}
                className="w-100x  mt-15 mb-5 common-input"
                placeholder="输入新密码"
                onChange={(e) => {
                  verify("password", e.target.value);
                  setPassword(e.target.value);
                }}
              />
              {errorTip.password !== "" ? (
                <div className="error-tip  self-start">{errorTip.password}</div>
              ) : null}
              <input
                type="password"
                value={password2}
                className="w-100x  mt-15 mb-5 common-input"
                placeholder="再次输入新密码"
                onChange={(e) => {
                  verify("password2", e.target.value);
                  setPassword2(e.target.value);
                }}
              />
              {errorTip.password2 !== "" ? (
                <div className="error-tip  self-start">
                  {errorTip.password2}
                </div>
              ) : null}
              <Button
                loading={loading}
                type="primary"
                className="mt-15"
                onClick={onFinish}
                disabled={!available}
              >
                {loading
                  ? props.type === LOGIN_PASSWORD
                    ? "重置登录密码中..."
                    : "重置支付密码中..."
                  : props.type === LOGIN_PASSWORD
                  ? "重置登录密码"
                  : "重置支付密码"}
              </Button>
            </div>
          </div>

          {props.type === LOGIN_PASSWORD ? (
            <div className="flex-row justify-center align-center forgot-bottom mb-40 mt-30">
              <Button
                type="ghost"
                inline
                size="small"
                className="mr-12"
                onClick={() => props.setModalType(1)}
              >
                返回登录页
              </Button>
              <Button
                type="ghost"
                inline
                className="ml-12"
                size="small"
                onClick={() => props.setModalType(2)}
              >
                注册新账号
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
      <Modal
        visible={loading && step === 3}
        transparent
        maskClosable={false}
        title=""
        className="w-325 h-220 modal-tip"
      >
        <div className=" bg-white">
          <Button loading className="loading">
            重置中
          </Button>
        </div>
      </Modal>
      <Modal
        popup
        visible={success}
        maskClosable={false}
        animationType="slide"
        className="w-100x h-100x"
        wrapClassName="forgot-success"
      >
        <div className="w-100x h-100 flex-column justify-center">
          <div className="flex-column align-center ">
            <i className="iconfont ">&#xe62d;</i>
            <span className=" success mb-60 mt-4">
              {props.type === LOGIN_PASSWORD
                ? "登录密码重置成功"
                : "支付密码重置成功"}
            </span>
            <div className="flex-row justify-center align-center">
              <span className="count-back">
                {count}
                {props.type === LOGIN_PASSWORD
                  ? count + "s后返回登陆页"
                  : "正在返回支付订单页" + count + "s…"}
              </span>
              {props.type === LOGIN_PASSWORD ? (
                <Button
                  type="ghost"
                  inline
                  size="small"
                  onClick={() => {
                    setSuccess(false);
                    props.setModalType(1);
                  }}
                >
                  立即登陆
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Modal>
    </Modal>
  );
}
