interface CodeProps {
  policyText: any;
  children?: any;
} 
export default function PolicyCode(props:CodeProps ) {  
  return (
     <pre  className="fs-14 lh-24 fw-regular fc-main py-10 ">{props.policyText.trim()}</pre>
  );
}
