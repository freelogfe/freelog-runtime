interface CodeProps {
  policyText: any;
  children?: any;
} 
export default function (props:CodeProps ) {
   
  return (
     <div>{props.policyText}</div>
  );
}
