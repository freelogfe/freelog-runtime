interface OutOfProps {
  outData: any;
  children?: any;
}
export default function OutOf({ outData }: OutOfProps) {
  return (
    <div
      className="flex-column align-center w-100x h-100x fs-30 fw-regular lh-36"
      style={{
        textAlign: "center",
        background: "#ffffff",
        color: "#666666",
      }}
    >
      <div className="flex-1"></div>
      <div>
        <i
          className="iconfont fs-100"
          style={{
            color: "red",
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
        节点已经被封停
      </div>
      <div
        className="fs-14 fw-regular lh-2. mt-80"
        style={{
          color: "#666666",
        }}
      >
        经核实，节点{outData.nodeName}，严重违反平台规范&nbsp;
        <a
          className="link cur-pointer"
          target="_blank"
          rel="noreferrer"
          href="https://freelog2.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62cce8f2456ff0002e328eb2"
        >
          （Freelog服务协议）
        </a>{" "}
        ，涉嫌
        {outData.freezeReason}，已经被封停。
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
