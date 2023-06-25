import { Slider } from 'antd';

const marks = {
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>100°C</strong>,
  },
};

export default function Sliders(props) {
 return <>
    <Slider range marks={marks} defaultValue={[26, 37]} />

  </>
 }