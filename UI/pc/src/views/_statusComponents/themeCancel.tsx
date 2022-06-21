/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Button from "../_commons/button";

interface ThemeCancelProps {
  currentExhibit: any;
  setThemeCancel: any;
  children?: any;
}
export default function ThemeCancel({
  currentExhibit,
  setThemeCancel,
}: ThemeCancelProps) {
  return (
    <div
      className="w-100x h-100x text-center"
      css={css`
        background: #f2f2f2;
      `}
    >
      <div
        className="mb-30 fs-30"
        css={css`
          font-weight: 400;
          color: #666666;
        `}
      >
        {currentExhibit &&
        currentExhibit.contracts &&
        currentExhibit.contracts.length
          ? "节点主题授权未完成，继续浏览请获取授权"
          : "当前节点主题未开放授权，继续浏览请签约并获取授权"}
      </div>
      <Button
        click={() => {
          setThemeCancel(false);
        }}
        className="px-50 py-15"
      >
        {currentExhibit &&
        currentExhibit.contracts &&
        currentExhibit.contracts.length
          ? "获取授权"
          : "签约"}
      </Button>
    </div>
  );
}
