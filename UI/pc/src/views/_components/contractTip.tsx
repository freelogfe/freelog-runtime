/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

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
          className=" flex-row align-center mt-15 px-10"
          css={css`
            width: 100%;
            height: 28px;
            background: rgba(0, 0, 0, 0.02);
            border-radius: 4px;
          `}
        >
          <i
            className="iconfont mr-5 fs-14 mt-2"
            css={css`
              color: #999999 !important;
            `}
          >
            &#xe641;
          </i>
          <div
            className="tip fs-12"
            css={css`
              height: 18px;
              font-size: 12px;
              font-weight: 400;
              color: #999999;
              line-height: 18px;
            `}
          >
            最下方有可签约的策略
          </div>
        </div>
      ) : null}
      {currentExhibit.contracts.length ? (
        <div
          className="flex-1  shrink-0 mt-15"
          css={css`
            font-size: 12px;
            font-weight: 600;
            color: #7a869a;
          `}
        >
          当前合约
        </div>
      ) : null}
    </>
  );
}
