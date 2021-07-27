 
interface ItemProps {
  policy: any;
  children?: any;
} 
export default function (props:ItemProps) {
  console.log(props.policy)
  return (
     <div></div>
  );
}
