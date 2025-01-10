import FI18n from "@/I18nNext";

export default function OutOf() {
  return (
    <div
      className="flex-column align-center text-align-center h-100x"
      style={{
        background: "#ffffff",
      }}
    >
      <div className="flex-2"></div>
      <div>
        <i className="iconfont fc-red fs-76">&#xe62f;</i>
      </div>
      <div
        className="lh-30 mt-40 fs-20 fw-bold"
        style={{
          color: "#222222",
        }}
      >
        {FI18n.i18nNext.t("alert_visit_node_theme_auth_abnormal")}
      </div>
      <div className="flex-3"></div>
    </div>
  );
}
