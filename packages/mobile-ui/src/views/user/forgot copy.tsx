import { freelogAuth } from "freelog-runtime-core";

import {
  checkPhone,
  checkEmail,
  checkPassword,
  checkPayPassword,
} from "@/utils/utils";
import { Popup, Button, Toast, SpinLoading } from "antd-mobile";
import FI18n from "@/I18nNext";

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
export default function Forgot(props: ForgotProps) {
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
  function passwordCheck(value: any) {
    if (props.type === PAY_PASSWORD) {
      return checkPayPassword(value);
    }
    return checkPassword(value);
  }
  const verify = (type: any, value: any) => {
    value = value ? value : "";
    const obj: any = {
      [type]: "",
    };
    if (type === "loginPassword") {
      obj[type] = value
        ? ""
        : FI18n.i18nNext.t("noderuntime_login_alert_pw_required");
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
    if (type === "authCode") {
      obj[type] = value
        ? ""
        : FI18n.i18nNext.t("noderuntime_signup_alert_code_required");
    }
    if (["password", "password2"].includes(type)) {
      if (value && !passwordCheck(value)) {
        obj[type] =
          props.type === PAY_PASSWORD
            ? FI18n.i18nNext.t("naming_resetpymtpw")
            : FI18n.i18nNext.t("namingrules_password");
      } else {
        obj[type] = value ? "" : FI18n.i18nNext.t("namingrules_pw_required");
      }
    }
    if (["password", "password2"].includes(type)) {
      if (type === "password") {
        if (password2) {
          obj.password2 =
            password2 !== value
              ? FI18n.i18nNext.t("noderuntime_resetpw_alert_notmatch")
              : "";
        }
      }
      if (type === "password2" && password) {
        obj[type] =
          password !== value
            ? FI18n.i18nNext.t("noderuntime_resetpw_alert_notmatch")
            : "";
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
      return errors[key];
    });
    const flag2 = Object.keys(values).some((key: any) => {
      return !values[key];
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
    const authCodeRes = await freelogAuth.getAuthCode({
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
      props.type === PAY_PASSWORD
        ? props.setModalType(0)
        : props.setModalType(1);
      window.clearInterval(timer);
    };
  }, [success]);
  const loginVerify = async () => {
    setLoading(true);
    const values: any = {
      password: loginPassword,
    };
    const res: any = await freelogAuth.loginVerify(values);
    if (res.data.errCode === 0 && res.data.data.isVerifySuccessful) {
      const obj: any = { loginPassword: "" };
      setErrorTip({
        ...errorTip,
        ...obj,
      });
      setLoading(false);
      setStep(2);
    } else {
      Toast.show({
        icon: "fail",
        content: res.data.msg,
        duration: 2000,
      });
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
    const values: any = {
      authCode,
      authCodeType:
        props.type === LOGIN_PASSWORD
          ? "resetPassword"
          : "updateTransactionAccountPwd",
      address: registerType === 1 ? phone : email,
    };
    const res: any = await freelogAuth.verifyAuthCode(values);
    if (res.data.errCode === 0) {
      setLoading(false);
      setStep(3);
    } else {
      Toast.show({
        icon: "fail",
        content: res.data.msg,
        duration: 2000,
      });
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
      res = await freelogAuth.putResetPassword(
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
      res = await freelogAuth.putResetPayPassword(values);
    }

    if (res.data.errCode === 0) {
      setSuccess(true);
      setLoading(false);
      setCount(3);
    } else {
      Toast.show({
        icon: "fail",
        content: res.data.msg,
        duration: 2000,
      });
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
    <Popup
      visible={true}
      position="top"
      getContainer={() => document.getElementById("ui-root") as HTMLElement}
      bodyClassName="user-forgot w-100x h-100x"
    >
      {/* <i className="iconfont forgot-back" onClick={()=>{
          props.setModalType(0);
        }}>&#xe6ff;</i> */}
      {step === 1 ? (
        <div className="w-100x h-100x flex-column align-center y-auto">
          <div className="mt-40 mb-40 flex-column px-30 self-start">
            <div className="forgot-title self-start">
              {FI18n.i18nNext.t("noderuntime_verifypw_title")}
            </div>
            <div className="forgot-tip self-start text-align-left mt-10">
              {FI18n.i18nNext.t("msg_verify_password")}
            </div>
          </div>
          <div className="forgot-container flex-column px-30 mt-118 flex-1">
            <input
              type="password"
              value={loginPassword}
              className="w-100x   mb-5 common-input"
              placeholder={FI18n.i18nNext.t("title_verify_password")}
              onChange={(e) => {
                verify("loginPassword", loginPassword);
                setLoginPassword(e.target.value);
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
              loadingText={FI18n.i18nNext.t(
                "noderuntime_verify_identity_msg_processing"
              )}
              onClick={loginVerify}
              disabled={loading || errorTip.loginPassword}
            >
              {FI18n.i18nNext.t("noderuntime_resetpw_btn_continue")}
            </Button>
          </div>
          <div className="flex-row justify-center align-center forgot-bottom mb-40 mt-30">
            <div className="forgot-tip">
              {" "}
              {FI18n.i18nNext.t("noderuntime_resetpw_msg_backtopayment")}
            </div>
            <Button
              color="default"
              className=""
              size="small"
              onClick={() => props.setModalType(0)}
            >
              {FI18n.i18nNext.t("noderuntime_resetpw_btn_backtopayment")}
            </Button>
          </div>
        </div>
      ) : step === 2 ? (
        <div className="w-100x h-100x flex-column align-center y-auto">
          <div className="flex-1 w-100x flex-column align-center shrink-0">
            <div className="forgot-title  mt-40 mb-87 flex-column px-30 self-start">
              <div className="forgot-title self-start">
                {FI18n.i18nNext.t("title_verify_identity")}
              </div>
              <div className="forgot-tip self-start text-align-left mt-10">
                {props.type === LOGIN_PASSWORD
                  ? FI18n.i18nNext.t("noderuntime_resetpw_subtitle")
                  : FI18n.i18nNext.t("noderuntime_verify_identity_subtitle")}
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
              />
              <label
                htmlFor="phone-type"
                className={registerType === 1 ? "selected mr-20" : " mr-20"}
              >
                {FI18n.i18nNext.t("noderuntime_resetpw_withphonenumber")}
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
              />
              <label
                htmlFor="mail-type"
                className={registerType === 2 ? "selected" : ""}
              >
                {FI18n.i18nNext.t("noderuntime_resetpw_withemail")}
              </label>
            </div>
            <div className="forgot-container flex-column justify-center px-30 w-100x">
              {registerType === 1 ? (
                <input
                  type="text"
                  value={phone}
                  className="w-100x  mb-5 mt-15 common-input"
                  placeholder={FI18n.i18nNext.t(
                    "noderuntime_signup_input_phonenumber_hint"
                  )}
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
                    className="w-100x common-input"
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
              <Button
                loading={loading}
                color="primary"
                className="mt-15"
                onClick={authCodeVerify}
                loadingIcon={<SpinLoading color="white" />}
                loadingText={FI18n.i18nNext.t(
                  "noderuntime_verify_identity_msg_processing"
                )}
                disabled={
                  loading ||
                  !authCode ||
                  (registerType === 1
                    ? !phone || errorTip.phone
                    : !email || errorTip.email)
                }
              >
                {FI18n.i18nNext.t("noderuntime_resetpw_btn_continue")}
              </Button>
            </div>
          </div>
          {props.type === LOGIN_PASSWORD ? (
            <div className="flex-row justify-center align-center forgot-bottom mb-40 mt-30">
              <Button
                color="default"
                size="small"
                className="mr-12"
                onClick={() => props.setModalType(1)}
              >
                {FI18n.i18nNext.t("noderuntime_resetpw_btn_backtologin")}
              </Button>
              <Button
                color="default"
                className="ml-12"
                size="small"
                onClick={() => props.setModalType(2)}
              >
                {FI18n.i18nNext.t("noderuntime_resetpw_btn_signup")}
              </Button>
            </div>
          ) : (
            <div className="flex-row justify-center align-center forgot-bottom mb-40 mt-30">
              <div className="forgot-tip">
                {FI18n.i18nNext.t("noderuntime_resetpw_msg_backtopayment")}
              </div>
              <Button
                color="default"
                className=""
                size="small"
                onClick={() => props.setModalType(0)}
              >
                {FI18n.i18nNext.t("noderuntime_resetpw_btn_backtopayment")}
              </Button>
            </div>
          )}
        </div>
      ) : step === 3 ? (
        <div className="w-100x h-100x flex-column align-center y-auto">
          <div className="flex-1 w-100x flex-column align-center shrink-0">
            <div className="forgot-title  mt-40  mb-87 flex-column px-30 self-start">
              <div className="forgot-title self-start">
                {props.type === LOGIN_PASSWORD
                  ? FI18n.i18nNext.t("noderuntime_resetpw_btn_resetpw")
                  : FI18n.i18nNext.t("noderuntime_resetpymtpw_title")}
              </div>
              <div className="forgot-tip self-start text-align-left mt-10">
                {props.type === LOGIN_PASSWORD
                  ? FI18n.i18nNext.t("noderuntime_resetpw_subtitle2")
                  : FI18n.i18nNext.t("noderuntime_verifypw_subtitle")}
              </div>
            </div>
            <div className="forgot-container flex-column justify-center px-30 w-100x">
              {errorTip.authCode !== "" ? (
                <div className="error-tip self-start">{errorTip.authCode}</div>
              ) : null}
              <input
                type="password"
                value={password}
                className="w-100x  mt-15 mb-5 common-input"
                placeholder={FI18n.i18nNext.t("noderuntime_resetpw_input_pw")}
                maxLength={props.type === PAY_PASSWORD ? 6 : 24}
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
                maxLength={props.type === PAY_PASSWORD ? 6 : 24}
                className="w-100x  mt-15 mb-5 common-input"
                placeholder={FI18n.i18nNext.t(
                  "noderuntime_resetpw_input_reenter_pw"
                )}
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
                color="primary"
                className="mt-15"
                onClick={onFinish}
                loadingIcon={<SpinLoading color="white" />}
                loadingText={
                  props.type === LOGIN_PASSWORD
                    ? FI18n.i18nNext.t("noderuntime_resetpw_msg_processing")
                    : FI18n.i18nNext.t("noderuntime_resetpymtpw_msg_processing")
                }
                disabled={!available}
              >
                {props.type === LOGIN_PASSWORD
                  ? FI18n.i18nNext.t("noderuntime_resetpw_btn_resetpw")
                  : FI18n.i18nNext.t("noderuntime_resetpymtpw_btn_resetpmtypw")}
              </Button>
            </div>
          </div>

          {props.type === LOGIN_PASSWORD ? (
            <div className="flex-row justify-center align-center forgot-bottom mb-40 mt-30">
              <Button
                color="default"
                size="small"
                className="mr-12"
                onClick={() => props.setModalType(1)}
              >
                {FI18n.i18nNext.t("noderuntime_resetpw_btn_backtologin")}
              </Button>
              <Button
                color="default"
                className="ml-12"
                size="small"
                onClick={() => props.setModalType(2)}
              >
                {FI18n.i18nNext.t("noderuntime_resetpw_btn_signup")}
              </Button>
            </div>
          ) : (
            <div className="flex-row justify-center align-center forgot-bottom mb-40 mt-30">
              <div className="forgot-tip">
                {FI18n.i18nNext.t("noderuntime_resetpw_msg_backtopayment")}
              </div>
              <Button
                color="default"
                className=""
                size="small"
                onClick={() => props.setModalType(0)}
              >
                {FI18n.i18nNext.t("noderuntime_resetpw_btn_backtopayment")}
              </Button>
            </div>
          )}
        </div>
      ) : null}
      <Popup
        visible={loading && step === 3}
        position="top"
        bodyClassName="w-325 h-220 modal-tip"
        className=""
      >
        <div className=" bg-white">
          <Button loading className="loading">
            {props.type === LOGIN_PASSWORD
              ? FI18n.i18nNext.t("noderuntime_resetpw_msg_processing")
              : FI18n.i18nNext.t("noderuntime_resetpymtpw_msg_processing")}
          </Button>
        </div>
      </Popup>
      <Popup
        visible={success}
        position="top"
        bodyClassName="forgot-success w-100x h-100x"
      >
        <div className="w-100x h-100 flex-column justify-center">
          <div className="flex-column align-center ">
            <i className="iconfont ">&#xe62d;</i>
            <span className=" success mb-60 mt-4">
              {props.type === LOGIN_PASSWORD
                ? FI18n.i18nNext.t("noderuntime_resetpw_msg_done")
                : FI18n.i18nNext.t("noderuntime_resetpymtpw_msg_done")}
            </span>
            <div className="flex-row justify-center align-center">
              <span className="count-back">
                {props.type === LOGIN_PASSWORD
                  ? FI18n.i18nNext.tJSXElement(
                      "noderuntime_signup_backtologin_msg",
                      {
                        timer: count + "s",
                      }
                    )
                  : FI18n.i18nNext.t(
                      "noderuntime_resetpymtpw_msg_backtopayment"
                    ) +
                    count +
                    "s…"}
              </span>
              {props.type === LOGIN_PASSWORD ? (
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
              ) : null}
            </div>
          </div>
        </div>
      </Popup>
    </Popup>
  );
}
