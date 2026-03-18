// import { message } from "antd";
// import copy from "copy-to-clipboard";
import FI18n from "@/I18nNext";

interface OutOfProps {
  outData: any;
  children?: any;
}
export default function OutOf({ outData }: OutOfProps) {
  return (
    <div
      className="flex-column align-center w-100x h-100x fs-30 fw-regular lh-36"
      style={{
        color: "#666666",
        background: "#ffffff",
        textAlign: "center",
      }}
    >
      <div className="flex-1"></div>
      <div>
        <i className="iconfont fc-red fs-100">&#xe62f;</i>
      </div>
      
      <div
        className=" fs-14 fw-regular lh-20 mt-80"
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
