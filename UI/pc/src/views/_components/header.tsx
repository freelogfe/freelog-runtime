/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";


interface headerProps {
  currentExhibit: any;
  children?: any;
}
export default function Header({ currentExhibit }: headerProps) {
  return (
    <div className="flex-column py-20 align-center bb-1">
      <div
        css={css`
          font-size: 18px;
          font-weight: 600;
          color: #222222;
        `}
      >
        {currentExhibit.isTheme ? "节点主题授权" : "展品授权"}
      </div>
      {currentExhibit.isTheme ? (
        <div
          className="mt-15"
          css={css`
            font-size: 14px;
            font-weight: 400;
            color: #999999;
          `}
        >
          {currentExhibit &&
          currentExhibit.contracts &&
          currentExhibit.contracts.length
            ? "节点主题授权未完成，继续浏览请获取授权"
            : "当前节点主题未开放授权，继续浏览请选择策略签约并获取授权"}
        </div>
      ) : null}
    </div>
  );
}
