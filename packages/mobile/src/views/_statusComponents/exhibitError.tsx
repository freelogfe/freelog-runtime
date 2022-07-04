
interface exhibitErrorProps {
  children?: any;
}
export default function ExhibitError(props: exhibitErrorProps) {
  return (
    <div className="flex-row w-100x h-28 brs-4 align-center mt-15 px-10 bg-error-minor">
      <i className="iconfont mr-5 fs-14 fc-error">&#xe62e;</i>
      <div className=" fw-regular fs-12 fc-error ">
        当前展品授权存在异常，请联系节点运营商！
      </div>
    </div>
  );
}
