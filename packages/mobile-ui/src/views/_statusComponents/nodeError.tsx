import FI18n from "@/I18nNext";
import failedSvg from "../../assets/image/failed.svg";

// interface nodeErrorProps {
//   currentExhibit: any;
//   setThemeCancel: any;
//   children?: any;
// }
export default function NodeError() {
  return (
    <div
      className="w-100x h-100x z-3 flex-column fs-30 fw-regular lh-36 text-align-center"
      style={{
        color: "#666666",
        paddingTop: "30vh",
        position: "absolute",
        background: "#f2f2f2",
      }}
    >
      <div>
        <img src={failedSvg} alt="" />
      </div>
      <div
        className="fs-20 fw-regular lh-36 mt-40 mb-30"
        style={{
          color: "#666666",
        }}
      >
        {FI18n.i18nNext.tJSXElement("alert_visit_node_theme_auth_abnormal")}
      </div>
    </div>
  );
}
