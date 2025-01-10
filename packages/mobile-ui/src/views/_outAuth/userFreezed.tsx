// import { Toast } from "antd-mobile";
// import copy from "copy-to-clipboard";
import FI18n from "@/I18nNext";

interface OutOfProps {
  outData: any;
  children?: any;
}
export default function OutOf({ outData }: OutOfProps) {
  return (
    <div
      className="flex-column align-center mx-20 h-100x fs-30 fw-regular lh-36 text-align-center"
      style={{
        color: "#666666",
        background: "#ffffff",
        width: "calc(100% - 40px)",
      }}
    >
      <div className="flex-1"></div>
      <div>
        <i
          className="iconfont fc-red"
          style={{
            fontSize: "100px !important",
          }}
        >
          &#xe62f;
        </i>
      </div>
      <div
        className="fs-30 fw-regular lh-36 mt-34"
        style={{
          color: "#666666",
        }}
      >
        {FI18n.i18nNext.tJSXElement("alert_login_useraccountdisable", {
          UserName: outData.username,
          DisableDetails: outData.userDetail.reason,
        })}
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
