import PolicyGraph from './_components/policyGraph'
 

interface ItemProps {
  policy: any;
  children?: any;
} 
export default function (props:ItemProps) {
  console.log(props.policy)
  return (
     <div><PolicyGraph policy={props.policy}></PolicyGraph></div>
  );
}
