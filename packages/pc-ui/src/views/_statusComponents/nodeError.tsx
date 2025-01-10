import FI18n from "@/I18nNext";

// interface nodeErrorProps {
//   currentExhibit: any;
//   setThemeCancel: any;
//   children?: any;
// }
export default function NodeError() {
  return (
    <div
      className="w-100x h-100x z-3 flex-column fs-30 lh-36 p-absolute text-align-center"
      style={{
        color: "#666666",
        paddingTop: "30vh",
        background: "#f2f2f2",
        fontWeight: "400",
      }}
    >
      <div>
        <img src="/failed.svg" alt="" />
      </div>
      <div
        className="fs-30 lh-36 mb-30 mt-40"
        style={{
          color: "#666666",
          fontWeight: "400",
        }}
      >
        {FI18n.i18nNext.tJSXElement('alert_visit_node_theme_auth_abnormal')} 
      </div>
      {/* <div
        className="fs-16 lh-22 mb-30 mt-40"
        style={{
          color: "#666666",
          fontWeight: "400",
        }}
      >
        异常原因：主题授权链异常
      </div>
      {currentExhibit &&
      currentExhibit.contracts &&
      currentExhibit.contracts.length ? (
        <div className="mt-100">
          <span
            className="fs-14 lh-20"
            style={{
              color: "#666666",
              fontWeight: "400",
            }}
          >
            已与当前主题签约
          </span>
          <span
            className="fs-14 lh-20 ml-5 cur-pointer link"
            style={{
              fontWeight: "400",
            }}
            onClick={() => {
              setThemeCancel(false);
            }}
          >
            查看合约
          </span>
        </div>
      ) : null} */}
    </div>
  );
}
