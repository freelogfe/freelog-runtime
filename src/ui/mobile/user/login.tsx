import user from "../../../services/api/modules/user";
import frequest from "../../../services/handler";
import { SUCCESS } from "../../../bridge/event";
import { Tabs, Badge, Modal, Button, Toast } from "antd-mobile";

import { useState } from "react";
import "./login.scss";

interface loginProps {
  loginFinished: any;
  visible: boolean;
  setModalType: any;
  children?: any;
}
export default function (props: loginProps) {
  const [errorTip, setErrorTip] = useState<any>({
    loginName: "",
    password: "",
  });
  const [logging, setLogging] = useState(false);
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const onFinish = async () => {
    setLogging(true);
    const values: any = {
      loginName,
      password,
    };
    // loginName: "string",
    //   password: "string",
    //   isRemember: "string",
    //   returnUrl: "string",
    //   jwtType: "string",
    values.isRemember = values.isRemember ? 1 : 0;
    const res = await frequest(user.login, "", values);
    if (res.data.errCode === 0) {
      setLogging(false);
      props.loginFinished(SUCCESS, res.data.data);
    } else {
      setLogging(false);
      Toast.fail(res.data.msg, 2);
    }
  };

  return (
    <Modal
      popup
      visible={props.visible}
      maskClosable={false}
      animationType="slide"
      className="w-100x h-100x"
      wrapClassName="user-login"
    >
      <div className="w-100x h-100x flex-column align-center">
        <div className="flex-1 w-100x flex-column align-center">
          <i className="iconfont  mt-50 mb-20 logo">&#xe614;</i>

          <div className="login-title mb-46 flex-row justify-center">
            免费专业的资源发行和运营平台
          </div>
          <div className="login-container flex-column justify-center">
            <input
              type="text"
              value={loginName}
              placeholder="用户名/手机号/邮箱"
              onChange={(e) => {
                setLoginName(e.target.value);
              }}
            />
            <input
              type="password"
              value={password}
              placeholder="密码"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Button
              loading={logging}
              type="primary"
              className="mb-15"
              onClick={onFinish}
              disabled={!loginName || !password}
            >
              {logging ? "登陆中" : "登 录"}
            </Button>
            <Button className="registry" onClick={() => props.setModalType(2)}>
              注 册
            </Button>
          </div>
        </div>

        <div className="text-center login-forgot mb-50">
          <Button
            type="ghost"
            inline
            size="small"
            onClick={() => props.setModalType(3)}
          >
            忘记密码
          </Button>
        </div>
      </div>
    </Modal>
  );
}
