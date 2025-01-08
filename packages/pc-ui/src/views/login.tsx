import { Form, Input, Modal, Checkbox } from "antd";

import Button from "./_commons/button";
import { freelogAuth } from "freelog-runtime-core";
import wechatPng from "@/assets/wechat.png";

import { useState } from "react";
import "./login.scss";
import FI18n from "@/I18nNext";
const { SUCCESS, USER_CANCEL } = freelogAuth.resultType;
const { setHref, getHref } = freelogAuth;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface loginProps {
  loginFinished: any;
  children?: any;
}
export default function Login(props: loginProps) {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  function onValuesChange(_changedValues: any, allValues: any) {
    setDisabled(!allValues.loginName || !allValues.password);
  }

  const onFinish = async () => {
    setLoading(true);
    const values: any = form.getFieldsValue();

    values.isRemember = isRemember ? 1 : 0;
    const res = await freelogAuth.login(values);
    if (res.data.errCode === 0) {
      setLoading(false);
      props.loginFinished(SUCCESS, res.data.data);
    } else {
      const modal = Modal.error({
        title: "登录失败",
        content: res.data.msg,
        zIndex: 9999,
      });
      setTimeout(() => {
        setLoading(false);
        modal && modal.destroy();
      }, 2000);
    }
  };

  const onFinishFailed = () => {};

  const handleCancel = () => {
    props.loginFinished(USER_CANCEL);
  };
  return (
    <Modal
      title={FI18n.i18nNext.t('event_2024monthlyeditorspick_awards_date')}
      zIndex={1200}
      centered
      footer={null}
      open={true}
      closable={true}
      className=""
      getContainer={() => document.getElementById("ui-root")!}
      onCancel={handleCancel}
      maskClosable={false}
      wrapClassName="freelog-login"
    >
      <div className="w-100x h-100x flex-column align-center">
        <div className="login-title py-55">登录freelog</div>
        <Form
          {...layout}
          onValuesChange={onValuesChange}
          name="basic"
          form={form}
          className=""
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className="login-label">用户名/手机号/邮箱</div>
          <Form.Item
            name="loginName"
            rules={[{ required: true, message: "请输入用户名!" }]}
          >
            <Input />
          </Form.Item>
          <div className="flex-row space-between login-label mt-10">
            <div className="">密码</div>
            <div
              className="login-forgot select-none cur-pointer"
              onClick={() => {
                if (window.baseURL.indexOf("testfreelog") > -1) {
                  window.open("https://user.testfreelog.com/retrieve");
                  return;
                }
                window.open("https://user.freelog.com/retrieve");
              }}
            >
              忘记密码？
            </div>
          </div>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 10, span: 16 }}
          >
            {/* <div className="mb-15 flex-row justify-end login-remember">
              <Checkbox checked={isRemember} onChange={(e)=>{setIsRemember(e)}}>记住我</Checkbox>
            </div> */}
            <div className="mb-15 flex-row justify-end login-remember">
              <Checkbox
                className="login-remember"
                checked={isRemember}
                onChange={(e) => {
                  setIsRemember(e.target.checked);
                }}
              >
                记住我
              </Checkbox>
            </div>
          </Form.Item>
          <Form.Item className="pt-">
            <Button
              className="py-9"
              click={onFinish}
              disabled={disabled || loading}
            >
              {" "}
              {loading ? "登录中..." : "登录"}
            </Button>
          </Form.Item>
        </Form>

        <div className="flex-1 flex-column align-center">
          <div className={"openTitle mt-10 mb-20"}>第三方账号登录</div>
          <div
            className={"wechat flex-column-center"}
            onClick={() => {
              setHref(
                `https://open.weixin.qq.com/connect/qrconnect?appid=wx25a849d14dd44177&redirect_uri=${encodeURIComponent(
                  `https://api.freelog.com/${
                    window.location.host.includes("testfreelog.com")
                      ? "test/"
                      : ""
                  }v2/thirdParty/weChat/codeHandle?returnUrl=` + getHref()
                )}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`
              );
            }}
          >
            <img src={wechatPng} className="w-26" />
          </div>
        </div>
        <div className="flex-row  mt-30 mb-15">
          <span className="login-new">freelog新用户？</span>
          <span
            className="regist-now cur-pointer"
            onClick={() => {
              if (window.baseURL.indexOf("testfreelog") > -1) {
                window.open("https://user.testfreelog.com/logon");
                return;
              }
              window.open("https://user.freelog.com/logon");
            }}
          >
            立即注册
          </span>
        </div>
      </div>
    </Modal>
  );
}
