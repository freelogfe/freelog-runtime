import FI18n from "@/I18nNext";
import failedSvg from "../../assets/image/failed.svg";

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
      <div className="w-100">
        <img src={failedSvg} alt="" className="w-100x" />
      </div>
      <div
        className=" fs-30 fw-regular lh-36 mt-40 mb-30"
        style={{
          color: "#666666",
        }}
      >
       {FI18n.i18nNext.tJSXElement('noderuntime_nodedeleted_msg')} {/*  节点异常，无法正常访问 */}
      </div>
      <div
        className=" fs-16 fw-regular lh-22"
        style={{
          color: "#666666",
        }}
      >
       {FI18n.i18nNext.tJSXElement('noderuntime_nodedeleted_msg02')}   {/*异常原因：所有者删除了此节点  {FI18n.i18nNext.tJSXElement('noderuntime_nodedeleted_msg02')} */}
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
