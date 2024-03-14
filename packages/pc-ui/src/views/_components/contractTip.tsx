import "./index.scss";
interface contractTipProps {
  currentExhibit: any;
  children?: any;
}

export default function ContractTip({ currentExhibit }: contractTipProps) {
  return (
    <>
      {currentExhibit.contracts.length &&
      currentExhibit.policiesActive.some((item: any) => !item.contracted) ? (
        <div
          className=" flex-row align-center mt-15 px-10 w-100x h-28 brs-4"
          style={{
            background: "rgba(0, 0, 0, 0.02)",
          }}
        >
          <i className="iconfont mr-5 fs-14 mt-2 icon-999">&#xe641;</i>
          <div
            className="tip fs-12 h-18 fw-regular lh-18"
            style={{
              color: "#999999",
            }}
          >
            最下方有可签约的策略
          </div>
        </div>
      ) : null}
      {currentExhibit.contracts.length ? (
        <div
          className="flex-1  shrink-0 mt-15 fs-12 fw-medium"
          style={{
            color: "#7a869a",
          }}
        >
          当前合约
        </div>
      ) : null}
    </>
  );
}
