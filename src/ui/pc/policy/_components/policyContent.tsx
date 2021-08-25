interface CotentProps {
  translateInfo: any;
  children?: any;
}  
export default function (props:CotentProps) {
   
  return (
     <pre>{props.translateInfo.content}</pre>
  );
}
