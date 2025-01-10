import FI18n from "@/I18nNext";

export default function OutOf() {
  return (
    <div
      className="flex-column align-center w-100x h-100x fs-30 fw-regular lh-36"
      style={{
        color: "#666666",
        background: "#ffffff",
        textAlign: "center",
      }}
    >
      <div className="flex-1"></div>
      <div>
        <i className="iconfont fs-100 fc-red">&#xe62f;</i>
      </div>
      <div
        className=" fs-30 fw-regular lh-36 mt-40 "
        style={{
          color: "#666666",
        }}
      >
        {FI18n.i18nNext.t("alert_visit_node_theme_auth_abnormal")}
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
