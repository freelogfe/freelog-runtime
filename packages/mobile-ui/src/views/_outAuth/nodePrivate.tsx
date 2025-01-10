import { useState } from "react";

import nodePrivate from "../../assets/image/nodePrivate.png";
import Login from "../user/login";
import { freelogAuth } from "freelog-runtime-core";
import FI18n from "@/I18nNext";

import { Button } from "antd-mobile";
const { SUCCESS, USER_CANCEL } = freelogAuth.resultType;

export default function NodePrivate() {
  const [loginVisible, setLoginVisible] = useState(false);
  function loginFinished(type: number) {
    if (type === SUCCESS) {
      freelogAuth.reload();
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
        {freelogAuth.getUserInfoForAuth()
          ? FI18n.i18nNext.tJSXElement(
              "noderuntime_node_visibility_private_msg_noaccess"
            )
          : FI18n.i18nNext.tJSXElement(
              "noderuntime_node_visibility_private_msg_notlogged"
            )}
      </div>
      {freelogAuth.getUserInfoForAuth() ? null : (
        <Button
          className="fs-14 px-40"
          color="primary"
          onClick={() => {
            setLoginVisible(true);
          }}
        >
          {FI18n.i18nNext.t(
            "noderuntime_node_visibility_private_btn__notlogged"
          )}
        </Button>
      )}
      <div className="flex-1"></div>
    </div>
  );
}
