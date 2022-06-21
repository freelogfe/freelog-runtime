/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface policyTipProps {
  currentExhibit: any;
  children?: any;
}

export default function PolicyTip({ currentExhibit }: policyTipProps) {
  return (
    <>
      {currentExhibit._contracts.length > currentExhibit.contracts.length && (
        <div className="flex-row mt-10 ">
          <div className="fs-14 fc-less">查看已终止的合约请移至</div>
          <div
            onClick={() => {
              window.open("http://user.testfreelog.com/logged/contract");
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
            font-size: 12px;
            font-weight: 600;
            color: #7a869a;
          `}
          className="flex-1  mt-20 "
        >
          可签约的策略
        </div>
      ) : null}
    </>
  );
}
