import user from "../../../services/api/modules/user";
import frequest from "../../../services/handler";
import {
  checkPhone,
  checkEmail,
  checkPassword,
  checkUsername,
} from "../../../utils/utils";
import { Popup, Button, Toast } from "antd-mobile";

import { useState, useEffect } from "react";
import "./register.scss";

interface loginProps {
  visible: boolean;
  setModalType: any;
  children?: any;
}
export default function (props: loginProps) {
  const [errorTip, setErrorTip] = useState<any>({
    username: "",
    loginName: "",
    phone: "",
    email: "",
    password: "",
    authCode: "",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);
  const [countDown, setCountDown] = useState(60);
  const [count, setCount] = useState(3);
  const [authCode, setAuthCode] = useState("");
  const [authCodeLoading, setAuthCodeLoading] = useState(false);
  const [username, setUsername] = useState("");
  // loginName: phone | email
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 1 phone    2 email
  const [registerType, setRegisterType] = useState(1);
  const verify = (type: any, value: any) => {
    value = value ? value : "";
    const obj: any = {
      [type]: "",
    };
    if (type === "username" && !checkUsername(value)) {
      obj[type] = value
        ? "不超过30个字符；只能使用小写字母、数字或短横线（-）；必须以小写字母或数字开头和结尾。"
        : "请输入用户名";
    }
    if (type === "phone" && !checkPhone(value)) {
      obj[type] = value ? "手机号格式不正确" : "请输入手机号";
    }
    if (type === "email" && !checkEmail(value)) {
      obj[type] = value ? "无效邮箱地址" : "请输入邮箱地址";
    }
    if (type === "password" && !checkPassword(value)) {
      obj[type] = value
        ? "密码长度必须为6-24个字符，必须包含数字和字母"
        : "请输入密码";
    }
    if (type === "authCode") {
      obj[type] = value ? "" : "请输入验证码";
    }
    const errors = {
      ...errorTip,
      ...obj,
    };
    setErrorTip({
      ...errorTip,
      ...obj,
    });
    const values = {
      username,
      password,
      authCode,
      [type]: value,
      loginName: registerType === 1 ? phone : email,
    };
    registerType === 1 ? delete errors.email : delete errors.phone;
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
  const getAuthCode = async () => {
    // {
    //     "loginName":"18923803593",
    //     "authCodeType":"register"
    // }
    setAuthCodeLoading(true);
    setCountDown(60);
    const authCodeRes = await frequest(user.getAuthCode, "", {
      loginName: registerType === 1 ? phone : email,
      authCodeType: "register",
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
  const onFinish = async () => {
    setLoading(true);
    const values: any = {
      loginName: registerType === 1 ? phone : email,
      username,
      password,
      authCode,
    };
    //   username: "string",
    //   password: "string",
    //   isRemember: "string",
    //   returnUrl: "string",
    //   jwtType: "string",
    const res = await frequest(user.postRegister, "", values);
    if (res.data.errCode === 0) {
      setSuccess(true);
      setLoading(false);
    } else {
      Toast.show({
        icon: "fail",
        content: res.data.msg,
        duration: 2000,
      });
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
    <Popup
      visible={props.visible}
      position="top"
      bodyClassName="user-register w-100x h-100x"
    >
      <div className="w-100x h-100x flex-column align-center">
        <div className="flex-1 w-100x flex-column align-center">
          <div className="register-title mb-38 mt-45 flex-row px-30 self-start">
            注册
          </div>
          <div className="register-type mb-30  flex-row px-30 self-start align-center w-100x">
            <input
              type="radio"
              id="phone-type"
              name="register-type"
              className="mr-4"
              checked={registerType === 1}
              value="1"
              onChange={(e) => {
                phone && verify("phone", phone);
                setRegisterType(parseInt(e.target.value));
              }}
            />{" "}
            <label
              htmlFor="phone-type"
              className={registerType === 1 ? "selected mr-20" : " mr-20"}
            >
              手机号注册
            </label>
            <input
              type="radio"
              id="mail-type"
              name="register-type"
              className="mr-4"
              checked={registerType === 2}
              onChange={(e) => {
                email && verify("email", email);
                setRegisterType(parseInt(e.target.value));
              }}
              value="2"
            />{" "}
            <label
              htmlFor="mail-type"
              className={registerType === 2 ? "selected" : ""}
            >
              邮箱注册
            </label>
          </div>
          <div className="register-container flex-column justify-center px-30 w-100x">
            <input
              type="text"
              className="w-100x mb-5 common-input"
              value={username}
              placeholder="用户名"
              onChange={(e) => {
                verify("username", e.target.value);
                setUsername(e.target.value);
              }}
            />
            {errorTip.username !== "" ? (
              <div className="error-tip self-start">{errorTip.username}</div>
            ) : null}
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
            <div className="flex-row mb-5 mt-15 space-between">
              <div className="pr-10 flex-1 auth-code">
                <input
                  type="text"
                  value={authCode}
                  className="common-input"
                  placeholder="验证码"
                  onChange={(e) => {
                    verify("authCode", e.target.value);
                    setAuthCode(e.target.value);
                  }}
                />
              </div>

              <div className="shrink-0 fs-16  w-120 flex-row justify-end">
                <Button
                  color="primary"
                  className="fs-16 h-100x w-120"
                  disabled={
                    authCodeLoading ||
                    loading ||
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
            <input
              type="password"
              value={password}
              className="w-100x  mt-15 mb-5 common-input"
              placeholder="密码"
              onChange={(e) => {
                verify("password", e.target.value);
                setPassword(e.target.value);
              }}
            />
            {errorTip.password !== "" ? (
              <div className="error-tip  self-start">{errorTip.password}</div>
            ) : null}
            <Button
              loading={loading}
              color="primary"
              className="mt-15"
              onClick={onFinish}
              disabled={!available}
            >
              {loading ? "注册中" : "注 册"}
            </Button>
          </div>
        </div>

        <div className="flex-row justify-center align-center register-bottom mb-50">
          已有账号？
          <Button
            color="default"
            size="small"
            onClick={() => props.setModalType(1)}
          >
            马上登陆
          </Button>
        </div>
      </div>
      <Popup
        visible={loading}
        position="top"
        bodyClassName="w-325 h-220 modal-tip"
      >
        <div className=" bg-white">
          <Button loading className="loading">
            注册中
          </Button>
        </div>
      </Popup>
      <Popup
        visible={success}
        position="top"
        bodyClassName="w-100x h-100x register-success"
      >
        <div className="w-100x h-100 flex-column justify-center">
          <div className="flex-column align-center ">
            <i className="iconfont ">&#xe62d;</i>
            <span className=" success mb-60 mt-4">注册成功</span>
            <div className="flex-row justify-center align-center">
              <span className="count-back">{count}s后返回登陆页；</span>
              <Button
                color="default"
                size="small"
                onClick={() => {
                  setSuccess(false);
                  props.setModalType(1);
                }}
              >
                立即登陆
              </Button>
            </div>
          </div>
        </div>
      </Popup>
    </Popup>
  );
}
