

interface OutOfProps {
  outData: any;
  children?: any;
}
export default function OutOf({ outData }: OutOfProps) {
  return (
    <div
      className="flex-column align-center text-align-center h-100x"
      style={{
        background: "#ffffff",
      }}
    >
      <div className="flex-2"></div>
      <div>
        <i className="iconfont fc-red fs-76">&#xe62f;</i>
      </div>
      <div
        className="lh-30 mt-40 fs-20 fw-bold"
        style={{
          color: "#222222",
        }}
      >
        节点主题违规，暂时无法加载内容
      </div>
      <div className="flex-3"></div>
    </div>
  );
}
