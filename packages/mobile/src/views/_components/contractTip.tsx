
import { css } from "astroturf";

interface contractTipProps {
  currentExhibit: any;
  children?: any;
}

export default function ContractTip({ currentExhibit }: contractTipProps) {
  return (
    <>
      {!currentExhibit.isAvailable ? (
        <div
          css={`
            width: calc(100% - 30px);
            height: 28px;
            border-radius: 4px;
          `}
          className="flex-row align-center mt-15 mx-15 px-10 bg-error-minor"
        >
          <i className="iconfont mr-5 fs-14 fc-error">&#xe62e;</i>
          <div className="fs-12 fc-error ">
            该展品授权链异常，请谨慎签约。
          </div>
        </div>
      ) : null}
      <div className="flex-row ml-15 mr-5 space-between align-center mt-15">
        {currentExhibit.contracts.length ? (
          <div
            css={css`
              color: rgb(122, 134, 154);
              font-size: 12px;
              font-weight: 600;
            `}
            className="flex-1 fw-bold shrink-0"
          >
            当前合约
          </div>
        ) : null}
        {currentExhibit.contracts.length &&
        currentExhibit.policiesActive.some((item: any) => !item.contracted) ? (
          <div
            css={css`
              height: 28px;
              border-radius: 4px;
              margin: 0 10px;

              i {
                color: #999999 !important;
              }
            `}
            className="flex-row align-center  px-10"
          >
            <i className="iconfont mr-5 fs-14 mt-2">&#xe641;</i>
            <div
              css={css`
                height: 18px;
                font-size: 12px;
                font-weight: 400;
                color: #999999;
                line-height: 18px;
              `}
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
