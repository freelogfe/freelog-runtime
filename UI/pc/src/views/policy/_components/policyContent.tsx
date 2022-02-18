interface CotentProps {
  translateInfo: any;
  children?: any;
}  
export default function PolicyContent(props:CotentProps) {
   
  return (
    <pre className="fs-14 lh-24 fw-regular fc-main x-auto">{props.translateInfo.content.trim()}</pre>
    );
}
