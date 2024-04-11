import React from 'react'
import { Pie,measureTextWidth } from '@ant-design/plots'

export default function DemoPie(props) {
  const {
    clientHeight,
    data, //图表数据源
    angleField, //扇形切片大小（弧度）所对应的数据字段名
    colorField, //扇形颜色映射对应的数据字段名
    innerRadius = 0, //内环的半径，如果是饼图不用传
    legend = true, //是否显示图例
    minHeight = 200,
    noUnit, // 数据回显是否添加流量单位
    showStatistic = false, // 是否显示环图中心统计
    legendPos = 'bottom', // 图例位置
    defaultstaName //圆心默认名称
  } = props
  const config = {
    appendPadding: [12, 12, 0, 12],
    data,
    angleField,
    colorField,
    radius: 0.9,
    innerRadius,
    animation: false,
    label:{
      type: 'outer',
      content: '{name}\n{value}',
      labelHeight:28
      // formatter: (v)=>{
      //   console.log(v,'value');
      //   return `${v.name}${v.value}`
      // },
    },
    legend: legend && {
      // layout: 'horizontal',
      position: legendPos,
      itemHeight: 15,
      itemSpacing: 5,
    },
    tooltip:false,
    statistic: {
      title: showStatistic && {
        offsetY: -4,
        style: {
          fontSize: '13px',
          whiteSpace: 'wrap',
          overflow: 'unset'
        },
        customHtml: (container, view, datum) => {
          const text = datum ? datum.name : defaultstaName
          return text
        },
      },
      content: showStatistic && {
        offsetY: 4,
        style: {
          // whiteSpace: 'pre-wrap',
          overflow: 'visible',
          // textOverflow: 'ellipsis',
          // fontSize: '13px',
        },
        customHtml: (container, view, datum, data) => {
          const { width } = container.getBoundingClientRect();
          const text = datum ? `${datum.value}` : `${data.reduce((r, d) => r + d.value, 0)}`;
          return `<div style="width:${width}px;font-size:18px;line-height:'inherit';">${text}</div>`
        },
      },
    },
  }

  return (
    <>
        <Pie
          {...config}
          style={{ height: clientHeight, minHeight: minHeight }}
        />
    </>
  )
}
