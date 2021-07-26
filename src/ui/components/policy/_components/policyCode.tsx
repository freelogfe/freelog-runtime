 
interface ConfirmProps {
  isModalVisible: boolean;
  currentPresentable: any;
  currentPolicy: any;
  getAuth: any;
  setIsModalVisible: any;
}

export default function (props: ConfirmProps) {
  const handleOk = () => {
    props.setIsModalVisible(false);
  };
  const handleCancel = () => {
    props.setIsModalVisible(false);
  }; 
  return (
     <div></div>
  );
}
