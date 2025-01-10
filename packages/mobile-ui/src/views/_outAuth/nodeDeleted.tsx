import FI18n from "@/I18nNext";

export default function OutOf() {
  return (
    <div
      className="flex-column align-center text-align-center w-100x h-100x "
      style={{
        background: "#ffffff",
      }}
    >
      <div className="flex-2"></div>
      <div className="w-76">
        <img
          src="/failed.svg"
          alt="" 
          className="w-100x"
        />
      </div>
      <div 
        style={{
          color: "#222222",
        }}
        className="fs-20 fw-bold lh-30 mt-40"
      >
       {FI18n.i18nNext.tJSXElement('noderuntime_nodedeleted_msg')} {/*  节点异常，无法正常访问 */}
       </div>
      <div 
        style={{
          color: "#666666",
        }}
        className="fs-16 fw-regular lh-26 mt-40"
      >
       {FI18n.i18nNext.t('noderuntime_nodedeleted_msg02')}   {/*异常原因：所有者删除了此节点  {FI18n.i18nNext.t('noderuntime_nodedeleted_msg02')} */}
       </div>
      <div className="flex-3"></div>
    </div>
  );
}
