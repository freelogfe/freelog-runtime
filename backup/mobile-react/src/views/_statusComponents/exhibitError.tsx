export default function ExhibitError() {
  return (
    <div className="flex-row w-100x h-28 brs-4 align-center mt-15 px-10 bg-error-minor">
      <i className="iconfont mr-5 fs-14 fc-error">&#xe62e;</i>
      <div className=" fw-regular fs-12 fc-error ">
        该展品授权链异常，请谨慎签约。
      </div>
    </div>
  );
}
