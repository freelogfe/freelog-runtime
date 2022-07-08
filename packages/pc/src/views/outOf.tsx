/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface nodeErrorProps {
  children?: any;
}
export default function NodeError({}: nodeErrorProps) {
  return (
    <div
      className="w-100x h-100x z-3 flex-column fs-30 lh-36 p-absolute text-align-center"
      css={css`
        font-weight: 400;
        color: #666666;
        padding-top: 30vh;
        background: #f2f2f2;
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
    </div>
  );
}
