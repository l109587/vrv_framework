import React from 'react'
import { Column } from '@ant-design/plots'

export default function DemoColumn(props) {
  const {
    data, //图表数据源
    xField, //x轴对应的字段
    yField, //y轴对应的字段
    seriesField, //分组字段
    isGroup, //是否是分组柱状图
    yAMax, //y轴选择范围的最大值
    clientHeight, //图表高度
    tickInterval, //坐标轴刻度间隔
    legend = true, //是否展示图例
    minHeight = 200, //最小高度
    noUnit,
  } = props
  const config = {
    isAutoCenter:true,
    appendPadding: [12, 150, 12, 150],
    data,
    xField,
    yField,
    seriesField,
    isGroup,
    tooltip:false,
    animation: false,
    label: {position: 'top',offsetY:10},
    yAxis: {
      label: {
        formatter: (v) => {
          if (noUnit) {
            return v
          } else {
            if (v < 1000) return v
            if (v < 1000000) return `${(v / 1000).toFixed(0)} K`
            if (v < 1000000000) return `${(v / 1000000).toFixed(0)} M`
            if (v < 1000000000000) return `${(v / 1000000000).toFixed(0)} G`
          }
        },
      },
      min: 0,
      max: yAMax,
      tickInterval: tickInterval,
    },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
      },
    },
    legend: legend && {
      position: 'bottom',
      offsetY: 8,
      itemHeight: 15,
    },
    minColumnWidth: 20,
    maxColumnWidth: 20,
  }
  return (
    <>
      <div>
        <Column {...config} style={{ height: clientHeight,minHeight:minHeight,minWidth:650 }} />
      </div>
    </>
  )
}
