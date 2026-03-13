import FI18n from "@/I18nNext";
import endSvg from "../../assets/image/end.svg";

export default function OutOf() {
  return (
    <div
      className="flex-column align-center w-100x h-100x"
      style={{
        background: "#FAFBFC",
        justifyContent: "center",
        gap: "30px",
        textAlign: "center",
      }}
    >
      <img
        src={endSvg}
        alt=""
        style={{ width: 160, height: 160, opacity: 0.1 }}
      />
      <div
        className="fw-regular"
        style={{
          fontSize: 20,
          lineHeight: "1.3em",
          color: "#666666",
        }}
      >
        {FI18n.i18nNext.tJSXElement('noderuntime_nodedeleted_msg')}
      </div>
      <div
        className="fw-regular"
        style={{
          fontSize: 12,
          lineHeight: "1.5em",
          color: "#666666",
        }}
      >
        {FI18n.i18nNext.tJSXElement('noderuntime_nodedeleted_msg02')}
      </div>
    </div>
  );
}
