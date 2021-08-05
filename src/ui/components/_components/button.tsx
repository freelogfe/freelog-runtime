import { useState, useEffect } from "react";
interface buttonProps {
  disabled?: boolean;
  click?(e: any): any;
  children: any;
  className?: string;
  type?: string;
}
const buttonTypes = {
  main: {
    common: "px-10 py-5 brs-4 cur-pointer select-none fw-medium fc-white",
    normal: "bg-main",
    hover: "bg-hover",
    active: "bg-active",
    disabled: "bg-disabled bg-main",
  },
  cancel: {
    common: "px-10 py-5 brs-4 cur-pointer select-none fc-grey",
    normal: "bg-c-main",
    hover: "bg-c-hover",
    active: "bg-c-active",
    disabled: "bg-disabled bg-c-main",
  }
};
export default function (props: buttonProps) {
  const [status, setStatus] = useState(0);
  const [buttonClass, setButtonClass] = useState(buttonTypes.main);
  useEffect(() => {
    console.log(props)
    setStatus(props.disabled ? 3 : 0);
    // @ts-ignore
    setButtonClass(buttonTypes[props.type || 'main'] || buttonClass)
  });
  return (
    <div
      onClick={(e) => {
        props.click && props.click(e);
      }}
      onMouseDown={(e) => {
        !props.disabled && setStatus(2);
      }}
      onMouseUp={(e) => {
        !props.disabled && setStatus(0);
      }}
      onMouseEnter={(e) => {
        !props.disabled && setStatus(1);
      }}
      onMouseLeave={() => {
        !props.disabled && setStatus(0);
      }}
      className={
        props.className +
        " " +
        (status === 0
          ? buttonClass.normal
          : status === 1
          ? buttonClass.hover
          : status === 2
          ? buttonClass.active
          : buttonClass.disabled) +
        " " + buttonClass.common
      }
    >
      {props.children}
    </div>
  );
}
