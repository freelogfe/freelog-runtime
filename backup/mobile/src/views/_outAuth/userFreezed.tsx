import { Button, Space, Toast } from "antd-mobile";
import copy from "copy-to-clipboard";

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
        你的账号已经被冻结
      </div>
      <div
        className="fs-14 fw-regular lh-20 mt-80"
        style={{
          color: "#666666",
        }}
      >
        经核实，你的账号{outData.username}，严重违反平台规范&nbsp;
        <br />
        <a
          className="link cur-pointer shrink-0"
          target="_blank"
          rel="noreferrer"
          href="https://freelog2.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62cce8f2456ff0002e328eb2"
        >
          查看服务协议
        </a>{" "}
        ，涉嫌
        {outData.userDetail.reason}，已经被冻结。
      </div>
      <div
        className="fs-14 fw-regular lh-20 mt-20"
        style={{
          color: "#666666",
        }}
      >
        如果你对此存在异议，可向Freelog提交相关证明材料进行申诉。
      </div>
      <div
        className="fs-14 fw-regular lh-20 mt-20"
        style={{
          color: "#666666",
        }}
      >
        联系邮箱：service@freelog.com{" "}
        <span
          className="link cur-pointer"
          onClick={() => {
            copy("service@freelog.com");
            Toast.show({
              icon: "success",
              content: "复制成功！",
            });
          }}
        >
          复制
        </span>
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
