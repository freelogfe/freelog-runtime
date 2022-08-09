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
        background: #ffffff;
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
        经核实，节点{outData.nodeName}，严重违反平台规范&nbsp;{" "}查看
        <a
          className="link cur-pointer"
          target="_blank"
          rel="noreferrer"
          href="https://freelog2.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62cce8f2456ff0002e328eb2"
        >
          Freelog服务协议
        </a>{" "}
        ，涉嫌
        {outData.freezeReason}，已经被封停。
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
