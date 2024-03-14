interface exhibitOffLineProps {
  length: number;
  type: "offline" | "freezed";
  children?: any;
}
export default function ExhibitOffLine(props: exhibitOffLineProps) {
  return (
    <div
      className="flex-column-center w-100x "
      style={{
        height: props.length > 1 ? "480px" : "390px",
      }}
    >
      <i
        className="iconfont fs-100"
        style={{
          height: "rgb(208 208 209 / 70%)",
        }}
      >
        &#xe62f;
      </i>
    </div>
  );
}
