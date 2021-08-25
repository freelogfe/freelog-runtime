import { Form, Input, Modal, Checkbox } from "antd";
import user from "../../services/api/modules/user";
import frequest from "../../services/handler";
import { SUCCESS } from "../../bridge/event";
import Button from "./_components/button";

import { useState } from "react";
import "./login.scss";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface loginProps {
  loginFinished: any;
  setIsLoginVisible: any;
  children?: any;
}
export default function (props: loginProps) {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  function onValuesChange(changedValues:any,allValues:any){
    console.log(changedValues, allValues)
    setDisabled(!allValues.loginName || !allValues.password)
  }
  
  const onFinish = async () => {
    console.log(form.getFieldsValue())
    const values: any = form.getFieldsValue()
    // loginName: "string",
    //   password: "string",
    //   isRemember: "string",
    //   returnUrl: "string",
    //   jwtType: "string",
    values.isRemember = values.isRemember ? 1 : 0;
    const res = await frequest(user.login, "", values);
    if (res.data.errCode === 0) {
      props.loginFinished(SUCCESS, res.data.data);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleOk = () => {
    props.setIsLoginVisible(false);
  };
 
  const handleCancel = () => {
    props.setIsLoginVisible(false);
  };
  return (
    <Modal
      title="登录"
      zIndex={1200}
      centered
      footer={null}
      visible={true}
      closable={false}
      className=""
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      wrapClassName="freelog-login"
      getContainer={document.getElementById("runtime-root")}
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
            <div className="login-forgot select-none cur-pointer">忘记密码？</div>
          </div>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password />
          </Form.Item>

          {/* <Form.Item {...tailLayout} name="isRemember" valuePropName="checked" className="ml-40">
          <Checkbox>记住我</Checkbox>
        </Form.Item> */}

          <Form.Item className="pt-30">
            <Button className="py-9" click={onFinish} disabled={disabled}>登录</Button>
          </Form.Item>
        </Form>
        <div className="flex-row  mt-30">
          <span className="login-new">freelog新用户？</span>
          <span className="regist-now">立即注册</span>
        </div>
      </div>
    </Modal>
  );
}
