import "./contractTip.scss";
interface contractTipProps {
  currentExhibit: any;
  children?: any;
}

export default function ContractTip({ currentExhibit }: contractTipProps) {
  return (
    <>
      {!currentExhibit.isAvailable ? (
        <div 
          className="flex-row align-center mt-15 mx-15 px-10 bg-error-minor   contractTip-container         "
        >
          <i className="iconfont mr-5 fs-14 fc-error">&#xe62e;</i>
          <div className="fs-12 fc-error ">该展品授权链异常，请谨慎签约。</div>
        </div>
      ) : null}
      <div className="flex-row ml-15 mr-5 space-between align-center mt-15 contractTip-container2">
        {currentExhibit.contracts.length ? (
          <div 
            className="flex-1 fw-bold shrink-0 contractTip-div1"
          >
            当前合约
          </div>
        ) : null}
        {currentExhibit.contracts.length &&
        currentExhibit.policiesActive.some((item: any) => !item.contracted) ? (
          <div 
            className="flex-row align-center  px-10 contractTip-div2"
          >
            <i className="iconfont mr-5 fs-14 mt-2">&#xe641;</i>
            <div 
              className="fs-12"
            >
              最下方有可签约的策略
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
