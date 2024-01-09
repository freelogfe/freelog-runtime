import { useState } from "react";

import nodePrivate from "../../assets/image/nodePrivate.png";
import Login from "../user/login";

import { Popup, Button, Toast, SpinLoading } from "antd-mobile";
//@ts-ignore
const props = window.$wujie?.props;
const { SUCCESS, USER_CANCEL } = props.freelogAuth.resultType;

interface OutOfProps {
  outData: any;
  children?: any;
}
export default function NodePrivate({ outData }: OutOfProps) {
  const [loginVisible, setLoginVisible] = useState(false);
  function loginFinished(type: number, data?: any) {
    if (type === SUCCESS) {
      props.freelogAuth.reload();
    }
    if (type === USER_CANCEL) {
      setLoginVisible(false);
    }
  }
  return (
    <div
      className="flex-column align-center w-100x h-100x fs-30 fw-regular lh-36 text-align-center"
      style={{
        background: "#ffffff",
        color: "#666666",
      }}
    >
      {loginVisible && (
        <Login onlyLogin={true} loginFinished={loginFinished}></Login>
      )}
      <div className="flex-1"></div>

      <div className="w-280">
        <img src={nodePrivate} alt="" className="w-100x" />
      </div>
      <div 
        className="fs-18 fw-regular lh-36 mt-10 mb-80"
        style={{
          color: "#666666",
        }}
      >
        {props.freelogApp.getCurrentUser()
          ? "此节点未开放访问"
          : "此节点未开放访问，如果你是节点所有者，请登录后继续访问。"}
      </div>
      {props.freelogApp.getCurrentUser() ? null : (
        <Button
          className="fs-14 px-40"
          color="primary"
          onClick={() => {
            setLoginVisible(true);
          }}
        >
          立即登录
        </Button>
      )}
      <div className="flex-1"></div>
    </div>
  );
}
