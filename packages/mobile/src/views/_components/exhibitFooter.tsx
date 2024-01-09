
import { Button } from "antd-mobile"; // Toast, Button
interface exhibitFooterProps {
  setModalType: any;
  children?: any;
}
export default function ExhibitFooter({ setModalType }: exhibitFooterProps) {
  return (
    <div className="h-74 w-100x flex-row justify-center align-center jself-end bt-1  ">
      <span 
        style={{
          fontWeight: 400, 
          color: "#999999" 
        }}
        className="please-login mr-20 fs-14"
      >
        进行签约及授权管理，请先登录
      </span>
      <Button
        onClick={() => {
          setModalType(1);
        }}
        color="primary"
        size="small"
        className=" flex-column-center"
      >
        登录
      </Button>
    </div>
  );
}
