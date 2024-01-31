interface exhibitOffLineProps {
  length: number;
  type: "offline" | "freezed";
  children?: any;
}
export default function ExhibitOffLine(props: exhibitOffLineProps) {
  return (
    <div
      className="flex-column-center w-100x flex-1 "
      // css={css`
      //   height: ${props.length > 1 ? "531px" : "441px"};
      // `}
    >
      <div className="flex-2"></div>
      <i
        className="iconfont"
        style={{
          color: "rgb(208 208 209 / 70%)",
          fontSize: "128px !important",
        }}
      >
        &#xe62f;
      </i>
      {props.type === "offline" && (
        <div
          className="mt-30 fs-30 fw-regular lh-42"
          style={{
            color: "#666666",
          }}
        >
          该展品未上架，无法获取授权
        </div>
      )}
      {props.type === "freezed" && (
        <div
          className="mt-30 fs-30 fw-regular lh-42"
          style={{
            color: "#666666",
          }} 
        >
          该展品已冻结，无法获取授权
        </div>
      )}
      <div className="flex-3"></div>
    </div>
  );
}
