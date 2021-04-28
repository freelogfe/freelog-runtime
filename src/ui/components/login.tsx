import { Form, Input,Modal, Button, Checkbox } from "antd";
import user from "../../services/api/modules/user";
import frequest from "../../services/handler";
import { SUCCESS, FAILED, USER_CANCEL } from "../../bridge/event";
import React, { useState } from 'react';


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function(props: any) {
  const onFinish = async (values: any) => {
    // loginName: "string",
    //   password: "string",
    //   isRemember: "string",
    //   returnUrl: "string",
    //   jwtType: "string",
    values.isRemember = values.isRemember ? 1 : 0;
    const res = await frequest(user.login, "", values);
    if (res.data.errCode === 0) {
      props.eventFinished(SUCCESS);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <Modal
      title="登录"
      zIndex={1200}
      centered
      footer={null}
      visible={true}
      closable={false}
      className="w-400 h-400"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        {...layout}
        name="basic"
        className=""
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          className="mr-40"
          name="loginName"
          rules={[{ required: true, message: "请输入用户名!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          className="mr-40"
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="isRemember" valuePropName="checked" className="ml-40">
          <Checkbox>记住我</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout} className="ml-40">
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
