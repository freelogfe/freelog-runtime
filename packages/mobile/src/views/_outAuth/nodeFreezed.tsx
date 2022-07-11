import { css } from "astroturf";

interface OutOfProps {
  outData: any;
  children?: any;
}
export default function OutOf({ outData }: OutOfProps) {
  return (
    <div
      className="flex-column align-center"
      css={css`
        height: 100%;
        text-align: center;
        background: #ffffff;
        padding: 0 40px;
      `}
    >
      <div className="flex-2"></div>
      <div>
        <i
          className="iconfont"
          css={css`
            color: red;
            font-size: 76px;
          `}
        >
          &#xe62f;
        </i>
      </div>
      <div
        css={css`
          font-size: 20px;
          font-weight: 600;
          color: #222222;
          line-height: 30px;
          margin-top: 40px;
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
          margin-top: 40px;
        `}
      >
        经核实，节点{outData.nodeName}，严重违反平台规范&nbsp;{" "}
        <span className="link cur-pointer">查看服务协议</span> ，涉嫌
        {outData.freezeReason}，已经被封停。
      </div>
      <div className="flex-3"></div>
    </div>
  );
}