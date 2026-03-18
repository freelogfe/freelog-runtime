import FI18n from "@/I18nNext";

interface OutOfProps {
  outData: any;
  children?: any;
}
export default function OutOf({ outData }: OutOfProps) {
  return (
    <div
      className="flex-column align-center w-100x h-100x fs-30 fw-regular lh-36"
      style={{
        textAlign: "center",
        background: "#ffffff",
        color: "#666666",
      }}
    >
      <div className="flex-1"></div>
      <div>
        <i
          className="iconfont fs-100"
          style={{
            color: "red",
          }}
        >
          &#xe62f;
        </i>
      </div>
      {/* <div
        className="fs-30 fw-regular lh-36 mt-34"
        style={{
          color: "#666666",
        }}
      >
        节点已经被封停
      </div> */}
      <div
        className="fs-14 fw-regular lh-2. mt-34"
        style={{
          color: "#666666",
        }}
      >
         {FI18n.i18nNext.tJSXElement('alert_nodedisable01', {
            NodeDomain: outData.nodeName,
            DisableDetails: outData.freezeReason,
          })}
        
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
