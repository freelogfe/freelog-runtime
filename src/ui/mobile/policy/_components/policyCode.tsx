interface CodeProps {
  policyText: any;
  children?: any;
} 
export default function (props:CodeProps ) {
   
  return (
     <div  className="fs-14 lh-24 fw-regular fc-main py-10">{props.policyText}</div>
  );
}
