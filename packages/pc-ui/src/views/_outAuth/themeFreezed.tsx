export default function OutOf() {
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
        <i className="iconfont fs-100 fc-red">&#xe62f;</i>
      </div>
      <div
        className=" fs-30 fw-regular lh-36 mt-40 "
        style={{
          color: "#666666",
        }}
      >
        节点主题违规，暂时无法加载内容
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
