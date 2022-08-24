
import { css } from "astroturf";

interface policyTipProps {
  currentExhibit: any;
  children?: any;
}

export default function PolicyTip({ currentExhibit }: policyTipProps) {
  return (
    <>
      {currentExhibit._contracts.length > currentExhibit.contracts.length && (
        <div className="flex-row mt-10 ml-15 ">
          <div className="fs-14 fc-less">查看已终止的合约请移至</div>
          <div
            onClick={() => {
              if (window.baseURL.indexOf("testfreelog") > -1) {
                window.open("http://user.testfreelog.com/logged/contract");
                return
              }
              window.open("https://user.freelog.com/logged/contract");
            }}
            className="ml-10 fs-14 fc-blue cur-pointer link"
          >
            合约管理
          </div>
        </div>
      )}
      {currentExhibit.policiesActive.some((item: any) => !item.contracted) ? (
        <div
          css={css`
            color: #7a869a;
            font-size: 12px;
            font-weight: 600;
          `}
          className="flex-1 fw-bold mt-20 ml-15"
        >
          可签约的策略
        </div>
      ) : null}
    </>
  );
}
