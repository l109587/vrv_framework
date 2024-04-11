import { Bar } from "@ant-design/plots";
const DemoBar = (props) => {
  const { data=[], xField, yField } = props;
  const barHeight = data.length>0?data.length*26 + 62 :0
  const config = {
    isAutoCenter: true,
    appendPadding: [12, 64, 12, 64],
    height:barHeight,
    data,
    xField,
    yField,
    tooltip: false,
    meta: {
      type: {
        alias: "类型",
      },
      value: {
        alias: "数量",
      },
    },
    legend: false,
    minBarWidth: 16,
    maxBarWidth: 16,
    label: {
      position: "right", // 或 'right'，根据需要选择合适的位置
      offset: 10,
      style: {
        fill: "#6394f9", // 设置文本颜色
      },
    },
    xAxis: {
      grid: {
        line: {
          style: {
            lineDash: [4, 3],
          }
        }
      }
    }
  };
  return <Bar {...config} />;
};

export default DemoBar;
