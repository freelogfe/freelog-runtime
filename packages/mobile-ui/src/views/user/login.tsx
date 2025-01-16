import { freelogAuth } from "freelog-runtime-core";
import FI18n from "@/I18nNext";

import { Popup, Button, Toast, SpinLoading,  } from "antd-mobile";

import { useState } from "react";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";

import "./login.scss";
// import logoImage from "../../assets/image/logo-feather.png" Checkbox;

const { SUCCESS, USER_CANCEL } = freelogAuth.resultType;

interface loginProps {
  loginFinished: any;
  visible?: boolean;
  setModalType?: any;
  children?: any;
  onlyLogin?: boolean;
}
export default function Login(props: loginProps) {
  const [logging, setLogging] = useState(false);
  const [loginName, setLoginName] = useState("");
  // const [isRemember, setIsRemember] = useState(false);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const onFinish = async () => {
    setLogging(true);
    const values: any = {
      loginName,
      password,
    };
    values.isRemember = values.isRemember ? 1 : 0;
    const res = await freelogAuth.login(values);
    if (res.data.errCode === 0) {
      setTimeout(() => {
        setLogging(false);
        setTimeout(() => {
          props.loginFinished(SUCCESS, res.data.data);
        }, 600);
      }, 100);
    } else {
      setTimeout(() => setLogging(false), 2000);
      Toast.show({
        icon: "fail",
        content: res.data.msg,
        duration: 2000,
      });
    }
  };

  return (
    <Popup
      visible={true}
      position="top"
      getContainer={() => document.getElementById("ui-root") as HTMLElement}
      bodyClassName="user-login w-100x h-100x"
    >
      {/* <Popup
        visible={logging}
        position="top"
        bodyClassName="w-325 h-220 modal-tip"
      >
        <div className=" bg-white">
          <Button loading className="loading">
            登录中
          </Button>
        </div>
      </Popup> */}
      <div className="w-100x h-100x flex-column align-center">
        <i
          className="iconfont login-back"
          onClick={() => {
            props.loginFinished(USER_CANCEL);
          }}
        >
          &#xe637;
        </i>
        <div className="flex-1 w-100x flex-column align-center">
          <div className="flex-column align-center w-100x flex-1 justify-center">
            {/* <i className="iconfont  mt-50 mb-20 logo">&#xe614;</i> */}
            <div className="login-logo flex-column-center h-36 w-100x mt-57 mb-20">
              <i className="iconfont fs-36">&#xe65c;</i>
              {/* <img src={logoImage} className="h-100x" alt="" /> */}
            </div>
            <div className="login-title mb-46 flex-row justify-center px-20">
              {FI18n.i18nNext.t("noderuntime_login_subtitle")}
            </div>
          </div>
          <div className="login-container flex-column justify-center">
            <input
              type="text"
              className="w-100x common-input  mb-15"
              value={loginName}
              placeholder={FI18n.i18nNext.t("noderuntime_login_account_hint")}
              onChange={(e) => {
                setLoginName(e.target.value);
              }}
            />
            <div className="w-100x flex-row">
              <input
                type={visible ? "" : "password"}
                className="w-100x common-input mb-15"
                value={password}
                placeholder={FI18n.i18nNext.t("noderuntime_login_pw_hint")}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <div className="eye">
                {!visible ? (
                  <EyeInvisibleOutline onClick={() => setVisible(true)} />
                ) : (
                  <EyeOutline onClick={() => setVisible(false)} />
                )}
              </div>
            </div>
            {/* <div className="mb-15 flex-row justify-end login-remember">
              <Checkbox
                checked={isRemember}
                onChange={(e) => {
                  setIsRemember(e);
                }}
              >
                记住我
              </Checkbox>
            </div> */}

            <Button
              loading={logging}
              color="primary"
              className="mb-15"
              onClick={onFinish}
              disabled={!loginName || !password}
              loadingIcon={<SpinLoading color="white" />}
              loadingText={FI18n.i18nNext.t("noderuntime_login_msg_processing")}
            >
              {FI18n.i18nNext.t("noderuntime_login_btn_submit")}
            </Button>
            {props.onlyLogin || (
              <Button
                className="registry"
                onClick={() => {
                  !logging && props.setModalType(2);
                }}
              >
                {FI18n.i18nNext.t("noderuntime_signup_btn_signup")}
              </Button>
            )}
          </div>
          <div className="flex-1">
            <div className="flex-column-center login-forgot mt-125">
              {props.onlyLogin || (
                <Button
                  color="default"
                  size="small"
                  onClick={() => {
                    !logging && props.setModalType(3);
                  }}
                >
                  {FI18n.i18nNext.t("noderuntime_login_forgetpw_mobile")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}
