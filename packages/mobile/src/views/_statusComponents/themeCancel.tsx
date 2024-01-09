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
        style={{
          color: "#666666",
        }}
        className="mb-15 flex-column-center fs-20 fw-regular"
      >
        当前节点主题未开放授权
      </div>
      <div
        style={{
          color: "#666666",
        }}
        className=" mb-30 flex-column-center fs-20 fw-regular"
      >
        {currentExhibit &&
        currentExhibit.contracts &&
        currentExhibit.contracts.length
          ? "继续浏览请获取授权"
          : "继续浏览请签约并获取授权"}
      </div>
      <Button
        style={{
          width: "132px !important",
          height: "48px !important",
          borderRadius: "4px !important",
        }}
        color="primary"
        onClick={() => {
          setThemeCancel(false);
        }}
        size="small"
        className="theme-tip-button fs-16"
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
