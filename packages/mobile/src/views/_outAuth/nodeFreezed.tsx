interface OutOfProps {
  outData: any;
  children?: any;
}
export default function OutOf({ outData }: OutOfProps) {
  return (
    <div
      className="flex-column align-center h-100 text-align-center px-40"
      style={{
        background: "#ffffff",
      }}
    >
      <div className="flex-2"></div>
      <div>
        <i className="iconfont fc-red fs-76">&#xe62f;</i>
      </div>
      <div
        className="lh-30 fw-bold fs-20 mt-40"
        style={{
          color: "#222222",
        }}
      >
        节点已经被封停
      </div>
      <div
        className="lh-20 fw-regular fs-14 mt-40"
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
      <div className="flex-3"></div>
    </div>
  );
}
