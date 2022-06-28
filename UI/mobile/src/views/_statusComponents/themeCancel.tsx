
import { css } from "astroturf";
import { Button } from "antd-mobile"; // Toast, Button

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
    <div className=" h-100x flex-column-center ">
      <div
        css={css`
          font-size: 20px;
          font-weight: 400;
          color: #666666;
        `}
        className="mb-15 flex-column-center"
      >
        当前节点主题未开放授权
      </div>
      <div
        css={css`
          font-size: 20px;
          font-weight: 400;
          color: #666666;
        `}
        className=" mb-30 flex-column-center"
      >
        {currentExhibit &&
        currentExhibit.contracts &&
        currentExhibit.contracts.length
          ? "继续浏览请获取授权"
          : "继续浏览请签约并获取授权"}
      </div>
      <Button
        css={css`
          font-size: 16px;
          width: 132px !important;
          height: 48px !important;
          border-radius: 4px !important;
        `}
        color="primary"
        onClick={() => {
          setThemeCancel(false);
        }}
        size="small"
        className="theme-tip-button "
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
