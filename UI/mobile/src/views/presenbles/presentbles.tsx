 
interface ContractType {
  status: string;
  name: string;
}
interface ItemProps {
  exhibitName: string;
  contracts: Array<ContractType>;
  children: any;
}
export default function (props:ItemProps) {
   
  return (
     <div></div>
  );
}
