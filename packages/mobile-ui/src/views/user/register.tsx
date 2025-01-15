import { freelogAuth } from "freelog-runtime-core";
import FI18n from "@/I18nNext";

import {
  checkPhone,
  checkEmail,
  checkPassword,
  checkUsername,
} from "../../utils/utils";
import { Popup, Button, Toast, SpinLoading } from "antd-mobile";

import { useState, useEffect } from "react";
import "./register.scss";
import { DownOutline } from "antd-mobile-icons";

interface loginProps {
  visible: boolean;
  setModalType: any;
  children?: any;
}
export default function Register(props: loginProps) {
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
        ? FI18n.i18nNext.t("namingrules_username")
        : FI18n.i18nNext.t("namingrules_username_required");
    }
    if (type === "phone" && !checkPhone(value)) {
      obj[type] = value
        ? FI18n.i18nNext.t("noderuntime_signup_alert_phonenumber_invalid")
        : FI18n.i18nNext.t("namingrules_phonenumber_required");
    }
    if (type === "email" && !checkEmail(value)) {
      obj[type] = value
        ? FI18n.i18nNext.t("noderuntime_signup_alert_email_invalid")
        : FI18n.i18nNext.t("namingrules_email_required");
    }
    if (type === "password" && !checkPassword(value)) {
      obj[type] = value
        ? FI18n.i18nNext.t("namingrules_password")
        : FI18n.i18nNext.t("namingrules_pw_required");
    }
    if (type === "authCode") {
      obj[type] = value
        ? ""
        : FI18n.i18nNext.t("noderuntime_signup_alert_code_required");
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
    const flag1 = Object.keys(errors).some((key: any) => errors[key]);

    const flag2 = Object.keys(values).some((key: any) => !values[key]);
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
    const authCodeRes = await freelogAuth.getAuthCode({
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
    const res = await freelogAuth.postRegister(values);
    if (res.data.errCode === 0) {
      setSuccess(true);
      setLoading(false);
    } else {
      Toast.show({
        icon: "fail",
        content: res.data.msg,
        duration: 2000,
      });
      // if (res.data.msg.indexOf("验证码") === 0) {
      //   const obj: any = { authCode: res.data.msg };
      //   setErrorTip({
      //     ...errorTip,
      //     ...obj,
      //   });
      // }
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <>
      <Popup
        visible={true}
        position="top"
        getContainer={() => document.getElementById("ui-root") as HTMLElement}
        bodyClassName="user-register w-100x h-100x"
      >
        <div className="w-100x h-100x flex-column align-center">
          <div className="flex-1 w-100x flex-column align-center">
            <div className="register-title mb-38 mt-45 flex-row px-30 self-start">
              {FI18n.i18nNext.t("noderuntime_signup_title")}
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
              />
              <label
                htmlFor="phone-type"
                className={registerType === 1 ? "selected mr-20" : " mr-20"}
              >
                {FI18n.i18nNext.t("noderuntime_signup_btn_signup")}
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
                {FI18n.i18nNext.t("noderuntime_signup_withemail")}
              </label>
            </div>
            <div className="register-container flex-column justify-center px-30 ">
              <input
                type="text"
                className="w-100x mb-5 common-input"
                value={username}
                placeholder={FI18n.i18nNext.t(
                  "noderuntime_signup_input_username_hint"
                )}
                onChange={(e) => {
                  verify("username", e.target.value);
                  setUsername(e.target.value);
                }}
              />
              {errorTip.username !== "" ? (
                <div className="error-tip self-start">{errorTip.username}</div>
              ) : null}
              {registerType === 1 ? (
                <div className="flex-row align-center mb-5 mt-15">
                  <div className="flex-row  align-center common-input s-input-left fs-16">
                    +86
                    <DownOutline className="ml-4 fs-16" />
                  </div>

                  <input
                    type="text"
                    value={phone}
                    className="w-100x  common-input s-input"
                    placeholder={FI18n.i18nNext.t(
                      "noderuntime_signup_input_phonenumber_hint"
                    )}
                    onChange={(e) => {
                      verify("phone", e.target.value);
                      setPhone(e.target.value);
                    }}
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={email}
                  className="w-100x  mb-5 mt-15 common-input"
                  placeholder={FI18n.i18nNext.t(
                    "noderuntime_signup_input_address_hint"
                  )}
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
                    placeholder={FI18n.i18nNext.t(
                      "noderuntime_signup_input_verificationcode_hint"
                    )}
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
                    {authCodeLoading ? (
                      <span>{countDown}s</span>
                    ) : (
                      FI18n.i18nNext.t("noderuntime_signup_btn_sendcode")
                    )}
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
                placeholder={FI18n.i18nNext.t("noderuntime_login_pw_hint")}
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
                loadingIcon={<SpinLoading color="white" />}
                onClick={onFinish}
                disabled={!available}
                loadingText={FI18n.i18nNext.t("noderuntime_signup_proecessing")}
              >
                {FI18n.i18nNext.t("noderuntime_signup_btn_signup")}
              </Button>
            </div>
          </div>

          <div className="flex-row justify-center align-center register-bottom mb-50">
            {FI18n.i18nNext.t("noderuntime_signup_login_msg")}
            <Button
              color="default"
              size="small"
              onClick={() => props.setModalType(1)}
            >
              {FI18n.i18nNext.t("noderuntime_signup_login")}
            </Button>
          </div>
        </div>
        {/* <Popup
        visible={loading}
        position="top"
        bodyClassName="w-325 h-220 modal-tip"
      >
        <div className=" bg-white">
          <Button loading className="loading">
            注册中
          </Button>
        </div>
      </Popup> */}
        <Popup
          visible={success}
          position="top"
          bodyClassName="w-100x h-100x register-success"
        >
          <div className="w-100x h-100x flex-column justify-center">
            <div className="flex-column align-center ">
              <i className="iconfont ">&#xe62d;</i>
              <span className=" success mb-60 mt-4">
                {FI18n.i18nNext.t("noderuntime_signup_msg_done")}
              </span>
              <div className="flex-row justify-center align-center">
                <span className="count-back">
                  {FI18n.i18nNext.tJSXElement("noderuntime_signup_msg_done", {
                    timer: count + "s",
                  })}
                </span>
                <Button
                  color="default"
                  size="small"
                  onClick={() => {
                    setSuccess(false);
                    props.setModalType(1);
                  }}
                >
                  {FI18n.i18nNext.t("noderuntime_signup_backtologin_btn_login")}
                </Button>
              </div>
            </div>
          </div>
        </Popup>
      </Popup>
    </>
  );
}
