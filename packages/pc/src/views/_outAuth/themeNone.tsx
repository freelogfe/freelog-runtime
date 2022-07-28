/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface OutOfProps {
  outData: any;
  children?: any;
}
export default function OutOf({ outData }: OutOfProps) {
  return (
    <div
      className="flex-column align-center"
      css={css`
        width: 100%;
        height: 100%;
        font-size: 30px;
        font-weight: 400;
        color: #666666;
        line-height: 36px;
        text-align: center;
        background: #FFFFFF;
      `}
    >
      <div className="flex-1"></div>
      <div
        css={css`
          width: 100px  !important;
        `}
      >
        <img
          src="/failed.svg"
          alt=""
          css={css`
            width: 100%;
          `}
        />
      </div>
      <div
        css={css`
          font-size: 30px;
          font-weight: 400;
          color: #666666;
          line-height: 36px;
          margin-bottom: 30px;
          margin-top: 40px;
        `}
      >
        节点异常，无法正常访问
      </div>
      <div
        css={css`
          font-size: 16px;
          font-weight: 400;
          color: #666666;
          line-height: 22px;
        `}
      >
        异常原因：未设置主题
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
