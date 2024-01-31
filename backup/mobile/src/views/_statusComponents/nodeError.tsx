

interface nodeErrorProps {
  currentExhibit: any;
  setThemeCancel: any;
  children?: any;
}
export default function NodeError({
  currentExhibit,
  setThemeCancel,
}: nodeErrorProps) {
  return (
    <div
      className="w-100x h-100x z-3 flex-column fs-30 fw-regular lh-36 text-align-center"
      style={{
        color: "#666666",
        paddingTop: "30vh",
        position: "absolute",
        background: "#f2f2f2",
      }}
    >
      <div>
        <img src="/failed.svg" alt="" />
      </div>
      <div
        className="fs-20 fw-regular lh-36 mt-40 mb-30"
        style={{
          color: "#666666",
        }}
      >
        节点异常，无法正常访问
      </div>
      <div
        className="fs-16 fw-regular lh-22 "
        style={{
          color: "#666666",
        }}
      >
        异常原因：主题授权链异常
      </div>
      {currentExhibit &&
      currentExhibit.contracts &&
      currentExhibit.contracts.length ? (
        <div className="mt-100">
          <span
            className="fs-14 fw-regular lh-20 "
            style={{
              color: "#666666",
            }}
          >
            已与当前主题签约
          </span>
          <span
            className="ml-5 cur-pointer link fs-14 fw-regular lh-20"
            style={{
              color: "#2784ff",
            }}
            onClick={() => {
              setThemeCancel(false);
            }}
          >
            查看合约
          </span>
        </div>
      ) : null}
    </div>
  );
}
