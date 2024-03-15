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
      <div>
        <i
          className="iconfont"
          css={css`
            color: red;
            font-size: 100px !important;
          `}
        >
          &#xe62f;
        </i>
      </div>
      <div
        css={css`
          font-size: 30px;
          font-weight: 400;
          color: #666666;
          line-height: 36px;
          margin-top: 40px;
        `}
      >
        节点主题违规，暂时无法加载内容
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
