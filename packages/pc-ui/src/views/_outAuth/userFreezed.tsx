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
      {/* <div
        className=" fs-30 fw-regular lh-36 mt-34"
        style={{
          color: "#666666",
        }}
      >
        你的账号已经被冻结
      </div> */}
      {/* <div
        className=" fs-14 fw-regular lh-20 mt-80"
        style={{
          color: "#666666",
        }}
      >
        经核实，你的账号{outData.username}，严重违反平台规范&nbsp;
        <a
          className="link cur-pointer"
          target="_blank"
          rel="noreferrer"
          href="https://freelog2.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62cce8f2456ff0002e328eb2"
        >
          查看服务协议
        </a>{" "}
        ，涉嫌
        {outData.userDetail.reason}，已经被冻结。
      </div> */}
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
      {/* <div
        className=" fs-14 fw-regular lh-20 mt-20"
        style={{
          color: "#666666",
        }}
      >
        联系邮箱：service@freelog.com{" "}
        <span
          className="link cur-pointer"
          onClick={() => {
            copy("service@freelog.com");
            message.success("复制成功！");
          }}
        >
          复制
        </span>
      </div> */}
      <div className="flex-1"></div>
    </div>
  );
}
