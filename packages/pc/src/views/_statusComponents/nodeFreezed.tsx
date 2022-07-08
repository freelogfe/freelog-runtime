/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

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
      className="w-100x h-100x z-3 flex-column-center p-absolute "
      css={css`
        background: #ffffff;
      `}
    >
      <div>
        <img src="/failed.svg" alt="" />
      </div>
      <div
        className="fs-30 lh-36 mb-30 mt-40"
        css={css`
          font-weight: 400;
          color: #666666;
        `}
      >
        节点异常，无法正常访问
      </div>
      <div
        className="fs-16 lh-22 mb-30 mt-40"
        css={css`
          font-weight: 400;
          color: #666666;
        `}
      >
        异常原因：主题授权链异常
      </div>
      {currentExhibit &&
      currentExhibit.contracts &&
      currentExhibit.contracts.length ? (
        <div className="mt-100">
          <span
            className="fs-14 lh-20"
            css={css`
              font-weight: 400;
              color: #666666;
            `}
          >
            已与当前主题签约
          </span>
          <span
            className="fs-14 lh-20 ml-5 cur-pointer link"
            css={css`
              font-weight: 400;
            `}
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
