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
        width: 100%;
        height: 100%;
        text-align: center;
        background: #ffffff;
      `}
    >
      <div className="flex-2"></div>
      <div
        css={css`
          width: 76px;
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
          font-size: 20px;
          font-weight: 600;
          color: #222222;
          line-height: 30px;
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
          line-height: 26px;
          margin-top: 40px;
        `}
      >
        异常原因：未设置主题
      </div>
      <div className="flex-3"></div>
    </div>
  );
}
