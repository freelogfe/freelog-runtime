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
            font-size: 100px;
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
          margin-top: 34px;
        `}
      >
        节点已经被封停
      </div>
      <div
        css={css`
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
          margin-top: 80px;
        `}
      >
        经核实，节点{outData.nodeName}，严重违反平台规范&nbsp;{" "}
        <span className="link cur-pointer">查看服务协议</span> ，涉嫌
        {outData.freezeReason}，已经被封停。
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
