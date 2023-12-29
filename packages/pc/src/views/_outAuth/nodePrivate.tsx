/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import nodePrivate from "../../assets/image/nodePrivate.png";
import Button from "../_commons/button";
import Login from "../login";
//@ts-ignore
const props = window.$wujie?.props;
const { SUCCESS, USER_CANCEL } = props.freelogAuth.resultType;

interface OutOfProps {
  outData: any;
  children?: any;
}
export default function OutOf({ outData }: OutOfProps) {
  const [loginVisible, setLoginVisible] = useState(false);
  function loginFinished(type: number, data?: any) {
    if (type === SUCCESS) {
      props.freelogAuth.reload();
    }
    if(type === USER_CANCEL){
      setLoginVisible(false)
    }
  }
  return (
    <div
      className="flex-column align-center"
      css={css`
        width: 100%;
        height: 100%;
        font-size: 30px;
        font-weight: 400;
        color: #666666;
        line-height: 36px;
        text-align: center;
        background: #ffffff;
      `}
    >
      {loginVisible && (
        <Login
          loginFinished={loginFinished}
          setIsLoginVisible={setLoginVisible}
        ></Login>
      )}
      <div className="flex-1"></div>

      <div className="w-360">
        <img src={nodePrivate} alt="" className="w-100x" />
      </div>
      <div
        css={css`
          font-size: 30px;
          font-weight: 400;
          color: #666666;
          line-height: 36px;
          margin-top: 10px;
          margin-bottom: 80px;
        `}
      >
        {props.freelogApp.getCurrentUser()
          ? "此节点未开放访问"
          : "此节点未开放访问，如果你是节点所有者，请登录后继续访问。"}
      </div>
      {props.freelogApp.getCurrentUser() ? null : (
        <Button
          className="fs-14 px-40"
          click={() => {
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
