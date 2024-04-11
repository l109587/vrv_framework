import React from 'react'
import { Pie } from '@ant-design/plots'
import { Skeleton } from 'antd'

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
    showLabel = true
  } = props
  const config = {
    appendPadding: [12, 12, 0, 12],
    data,
    angleField,
    colorField,
    radius: 0.9,
    innerRadius,
    animation: false,
    label: showLabel && {
      formatter: (v) => {
        if (noUnit) {
          return v[angleField]
        } else {
          if (v[angleField] < 1000) return v[angleField]
          if (v[angleField] < 1000000)
            return (v[angleField] / 1000).toFixed(0) + ' KB'
          if (v[angleField] < 1000000000)
            return `${(v[angleField] / 1000000).toFixed(0)} MB`
          if (v[angleField] < 1000000000000)
            return `${(v[angleField] / 1000000000).toFixed(0)} GB`
        }
      },
    },
    //图表交互
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
      {
        type: showStatistic ? 'pie-statistic-active' : '',
      },
    ],
    legend: legend && {
      layout: 'horizontal',
      position: legendPos,
      itemHeight: 15,
      itemSpacing: 5,
    },
    tooltip: {
      formatter: (v) => {
        if (noUnit) {
          return { name: v[colorField], value: v[angleField] }
        } else {
          if (v[angleField] < 1000)
            return { name: v[colorField], value: v[angleField] }
          if (v[angleField] < 1000000)
            return {
              name: v[colorField],
              value: (v[angleField] / 1000).toFixed(0) + ' KB',
            }
          if (v[angleField] < 1000000000)
            return {
              name: v[colorField],
              value: `${(v[angleField] / 1000000).toFixed(0)} MB`,
            }
          if (v[angleField] < 1000000000000)
            return {
              name: v[colorField],
              value: `${(v[angleField] / 1000000000).toFixed(0)} GB`,
            }
        }
      },
    },
    statistic: {
      title: showStatistic && {
        offsetY: -4,
        style: {
          fontSize: '13px',
          whiteSpace: 'wrap',
          overflow: 'unset'
        },
        customHtml: (container, view, datum) => {
          const text = datum ? datum.name : ''
          return text
        },
      },
      content: showStatistic && {
        offsetY: 4,
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '13px',
        },
        content: '',
      },
    },
  }

  return (
    <>
      {data.length == 0 ? (
        <div>
          <Skeleton.Avatar
            style={{
              height: clientHeight,
              width: clientHeight,
              minHeight: minHeight,
              minWidth: minHeight,
            }}
            active
          />
        </div>
      ) : (
        <Pie
          {...config}
          style={{ height: clientHeight, minHeight: minHeight }}
        />
      )}
    </>
  )
}
