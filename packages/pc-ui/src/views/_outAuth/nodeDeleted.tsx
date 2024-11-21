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
      <div className="w-100">
        <img src="/failed.svg" alt="" className="w-100x" />
      </div>
      <div
        className=" fs-30 fw-regular lh-36 mt-40 mb-30"
        style={{
          color: "#666666",
        }}
      >
        节点异常，无法正常访问
      </div>
      <div
        className=" fs-16 fw-regular lh-22"
        style={{
          color: "#666666",
        }}
      >
        异常原因：当前节点已注销
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
