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
        节点主题违规，暂时无法加载内容
      </div>
      <div className="flex-3"></div>
    </div>
  );
}
