interface CodeProps {
  policyText: any;
  children?: any;
} 
export default function PolicyCode(props:CodeProps ) {
   
  return (
    <pre  className="fs-14 lh-24 fw-regular fc-main x-auto pt-15">{props.policyText.trim()}</pre>
    );
}
