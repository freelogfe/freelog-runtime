import FI18n from "@/I18nNext";

interface OutOfProps {
  outData: any;
  children?: any;
}
export default function OutOf({ outData }: OutOfProps) {
  return (
    <div
      className="flex-column align-center h-100x text-align-center px-40"
      style={{
        background: "#ffffff",
      }}
    >
      <div className="flex-2"></div>
      <div>
        <i className="iconfont fc-red fs-76">&#xe62f;</i>
      </div>
      <div
        className="lh-20 fw-regular fs-14 mt-40"
        style={{
          color: "#666666",
        }}
      >
        {FI18n.i18nNext.tJSXElement("alert_nodedisable01", {
          NodeDomain: outData.nodeName,
          DisableDetails: outData.freezeReason,
        })}
      </div>
      <div className="flex-3"></div>
    </div>
  );
}
