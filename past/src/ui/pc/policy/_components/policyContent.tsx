interface CotentProps {
  translateInfo: any;
  children?: any;
}  
export default function (props:CotentProps) {
   
  return (
    <pre className="fs-14 lh-24 fw-regular fc-main">{props.translateInfo.content}</pre>
    );
}