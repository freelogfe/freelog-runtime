
import { css } from "astroturf";

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
      className="w-100x h-100x"
      css={css`
        width: 100%;
        height: 100%;
        z-index: 3;
        display: flex;
        flex-flow: column;
        font-size: 30px;
        font-weight: 400;
        color: #666666;
        line-height: 36px;
        text-align: center;
        padding-top: 30vh;
        position: absolute;
        background: #f2f2f2;
      `}
    >
      <div>
        <img src="/failed.svg" alt="" />
      </div>
      <div
        css={css`
          font-size: 20px;
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
        异常原因：主题授权链异常
      </div>
      {currentExhibit &&
      currentExhibit.contracts &&
      currentExhibit.contracts.length ? (
        <div className="mt-100">
          <span
            css={css`
              font-size: 14px;
              font-weight: 400;
              color: #666666;
              line-height: 20px;
            `}
          >
            已与当前主题签约
          </span>
          <span
            className="ml-5 cur-pointer link"
            css={css`
              font-size: 14px;
              font-weight: 400;
              color: #2784ff;
              line-height: 20px;
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
