import React, { useRef, useState, useEffect, useReducer } from 'react'
import ReactDOM from 'react-dom'
import {
  Button,
  Modal,
  Descriptions,
  Table,
  Space,
  Popover,
  Menu,
  Dropdown,
  Spin,
} from 'antd'
import styles from './index.less'
import classNames from 'classnames'
import moment from 'moment'
import {
  ModalForm,
  ProFormDateTimeRangePicker,
} from '@ant-design/pro-components'
import { post } from '@/services/https'
import DemoPie from './pdfCharts/Pie'
import DemoBar from './pdfCharts/Bar'
import ColumnP from './pdfCharts/Column'
import { language } from '@/utils/language'
import Reports from '@/assets/common/reportForm/reports_export.svg'
import Assets from '@/assets/common/reportForm/assets.svg' //资产
import Illinline from '@/assets/common/reportForm/illinline.svg' //违规内联
import Illoutline from '@/assets/common/reportForm/illoutline.svg' //违规外联
import Portopen from '@/assets/common/reportForm/portopen.svg' //端口开放
import Sysvbe from '@/assets/common/reportForm/sysvbe.svg' //系统漏洞
import Weakpwd from '@/assets/common/reportForm/weakpwd.svg' //弱命令
import Illservice from '@/assets/common/reportForm/illservice.svg' //违规服务

import reportDocx from './ReportDocx'

const Text = (info) => {
  const { data } = info
  return (
    <>
      {data.map((item) => {
        return (
          <div
            style={{ fontSize: 14, textIndent: 24, marginTop: 16 }}
          >
            {item}
          </div>
        )
      })}
    </>
  )
}
const HTable = (info) => {
  return (
    <div className={styles.hTable}>
      <Descriptions
        bordered
        column={1}
        size="small"
        className={styles.descriptions}
      >
        <Descriptions.Item label="任务名称">
          扫描任务[https://192.168.12.165/admin]
        </Descriptions.Item>
        <Descriptions.Item label="任务名称">
          扫描任务[https://192.168.12.165/admin]
        </Descriptions.Item>
        <Descriptions.Item label="任务名称">
          扫描任务[https://192.168.12.165/admin]
        </Descriptions.Item>
        <Descriptions.Item label="任务名称">
          扫描任务[https://192.168.12.165/admin]
        </Descriptions.Item>
        <Descriptions.Item label="任务名称">
          扫描任务[https://192.168.12.165/admin]
        </Descriptions.Item>
        <Descriptions.Item label="任务名称">
          扫描任务[https://192.168.12.165/admin]
        </Descriptions.Item>
        <Descriptions.Item label="任务名称">
          扫描任务[https://192.168.12.165/admin]
        </Descriptions.Item>
        <Descriptions.Item label="任务名称">
          扫描任务[https://192.168.12.165/admin]
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}
const ZTable = (info) => {
  const { dataSource, columns } = info.data
  const newArr = dataSource.slice(0, 25)

  return (
    <div className={styles.zTable}>
      <Table
        dataSource={newArr}
        columns={columns}
        pagination={false}
        className={styles.detailTable}
        bordered
        size="small"
      />
    </div>
  )
}
const DynamicTable = (info) => {
  const { dataSource, columns } = info.data
  return (
    <table
      style={{tableLayout: 'auto', borderCollapse: 'collapse', width: '100%'}}
    >
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              style={{
                textAlign: 'left',
                fontFamily: '黑体',
                padding: '8px 0',
                fontWeight: 'bold',
                backgroundColor: '#0070c0',
                color: '#fff',
                fontSize: 14,
                border: '0.5px dashed #c8c8c8',
                whiteSpace: 'nowrap',
              }}
              key={index}
            >
              <div style={{ margin: '0 8px' }}>{column.title}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            style={{ backgroundColor: rowIndex % 2 == 0 ? '#fff' : '#f1f1f1' }}
          >
            {columns.map((column, index) => {
              const text = row[column.dataIndex]
              let isWrap = false
              
              const textRender =() => {
                if (typeof text == 'string'&&text.indexOf('\n')>=0) {
                  isWrap=true
                  const arr = text.split('\n')
                  return arr.map((item)=>{
                    return <div>{item}</div>
                  })
                  
                }else{
                  return text
                }
              }
              const isSpace = isWrap?'pre':''
              return (
                <td
                key={index}
                style={{
                  fontFamily: '黑体',
                  padding: '8px 0',
                  fontSize: 14,
                  border: '0.5px dashed #c8c8c8',
                  wordBreak:(column?.wrap =='Y'||isWrap)?'break-all':'normal',
                  whiteSpace:(column?.wrap =='Y' ||isWrap)?isSpace:'nowrap',
                }}
              >
                <div style={{ margin: '0 8px' }}>{textRender()}</div>
              </td>
              )
              
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
const Pie = (info) => {
  const { data = [], name = '' } = info
  return (
    <div style={{ paddingLeft: 48,maxWidth:680 }} id="clone">
      <DemoPie
        data={data}
        clientHeight={250}
        angleField="value"
        colorField="name"
        noUnit={true}
        legend={true}
        legendPos="left"
        innerRadius={0.6}
        showStatistic={true}
        defaultstaName={name}
      />
    </div>
  )
}
const Column = (info) => {
  const { data = [] } = info
  return (
    <div style={{ maxWidth:680 }}>
      <ColumnP
        data={data}
        xField="name"
        yField="value"
        clientHeight={250}
        noUnit={true}
        legend={false}
        ColumnWidth={20}
      />
    </div>
  )
}
const Bar = (info) => {
  const { data = [] } = info
  return (
    <div style={{ maxWidth:680 }}>
      <DemoBar data={data} xField="value" yField="name" />
    </div>
  )
}
const StatsPanel = (info) => {
  const { data = [] } = info
  const iconMap = {
    资产总数: Assets,
    漏洞: Sysvbe,
    弱口令: Weakpwd,
    端口开放: Portopen,
    违规外联: Illoutline,
    违规内联: Illinline,
    违规服务: Illservice,
  }
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', marginTop: 16,height:106, maxWidth:680 }}
      id="clone"
    >
      <div className={styles.panelBox}>
        {data.map((item) => {
          return (
            <div className={styles.itemContainer}>
              <div className={styles.panelItem}>
                <div className={styles.num}>{item.value}</div>
                <div className={styles.name}>
                  <img src={iconMap[item.name]} className={styles.img} />
                  <span>{item.name}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default () => {
  const listRef = useRef()
  const dateFormat = 'YYYY-MM-DD HH:mm:ss'

  const [modalVisible, setModalVisible] = useState(false)
  const [reportFormData, setReportFormData] = useState([])
  const [timeModalVisible, setTimeModalVisible] = useState(false)
  const [reportName, setReportName] = useState('')
  const [retypeName, setRetypeName] = useState('')

  const Mulu = (props) => {
    //计算目录页码
    const CountPageSize = (props) => {
      const { id } = props
      const [num, setNum] = useState(3)
      setTimeout(() => {
        const nums = Math.ceil(
          listRef.current.querySelector(`#${id}`)?.offsetTop / 950
        )
        console.log(
          listRef.current.querySelector(`#${id}`)?.offsetTop,
          'offsetTop'
        )
        setNum(nums)
      }, 0)
      return <span>{num}</span>
    }
    const { mululist } = props
    return (
      <div className={styles.mulu} id="clone">
        <div className={styles.title}>目录</div>
        <div className={styles.muluList}>
          <ul style={{ paddingLeft: 0 }}>
            {mululist.map((item) => {
              return (
                <li className={styles.muluListItem} key={item.name}>
                  <span
                    className={classNames(styles.itName, {
                      [styles.secondItName]: item.type === 2,
                      [styles.thirdItName]: item.type === 3,
                    })}
                  >
                    {item.num}
                    {item.name}
                  </span>
                  <span className={styles.itLine}></span>
                  <span className={styles.itpageNum}>
                    <CountPageSize id={item.key} />
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
  const RenderDesc = (props) => {
    const { desc = [] } = props
    return (
      <>
        {desc.length > 0 &&
          desc.map((item,index) => {
            return (
              <div
                style={{
                  fontSize: item.textType==='title'?18:16,
                  textIndent: item.textType==='title'?40:32,
                  lineHeight:'150%',
                  marginBottom:6,
                  marginTop:index==0?10:0,
                  fontWeight:item.textType==='title'?'bold':'normal',
                  fontFamily:item.textType==='title'?'黑体':'宋体'
                }}
              >
                {item.info}
              </div>
            )
          })}
      </>
    )           
  }
  const FirstTitle = (info) => {
    const { number, title, id, desc = [] } = info
    return (
      <div>
        <h1
          style={{
            margin:'22px 0',
            fontSize: 24,
            fontWeight: 'bold',
            fontFamily: '黑体',
          }}
          id={id}
        >{`${number}.${title}`}</h1>
      </div>
    )
  }

  const SecondTitle = (info) => {
    const { upNumber, number, title, id, desc = [] } = info
    return (
      <div>
        <h2
          style={{
            margin:'12px 0',
            fontSize: 22,
            fontWeight: 'bold',
            marginLeft: '16px',
            fontFamily: '黑体',
          }}
          id={id}
        >{`${upNumber}.${number}.${title}`}</h2>
      </div>
    )
  }
  const ThirdTitle = (info) => {
    const { firstNumber, secNumber, number, title, id, desc = [] } = info
    return (
      <div>
        <h3
          style={{
            margin:'12px 0',
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: '32px',
            fontFamily: '黑体',
          }}
          id={id}
        >{`${firstNumber}.${secNumber}.${number}.${title}`}</h3>
      </div>
    )
  }

  const contentRender = (type, data, name) => {
    let content
    switch (type) {
      case 'table':
        content = <DynamicTable data={data} />
        break
      case 'column':
        content = <Column data={data} />
        break
      case 'pie':
        content = <Pie data={data} name={name} />
        break
      case 'panel':
        content = <StatsPanel data={data} />
        break
      case 'bar':
        content = <Bar data={data} />
        break
      case 'text':
        content = <RenderDesc desc={data} />
        break
      default:
        break
    }
    return content
  }
  const HomePage = (props) => {
    const { name, time, typeName } = props
    return (
      <div className={styles.firPage}>
        <div 
          style={{
            fontSize: 42,
            textAlign: 'center',
            fontFamily: '黑体',
            fontWeight: 'bold',
          }}>
          <div style={{marginTop:120,marginBottom:30}}>
            {name}
          </div>
          <div>
            {typeName}
          </div>
        </div>
        
        <div
          style={{
            fontSize: 26,
            textAlign: 'center',
            height: 50,
            marginTop: 500,
            marginBottom: 150,
            borderBottom: '2px solid #000',
            fontFamily: '黑体',
          }}
        >{`报表生成时间 ${time}`}</div>
      </div>
    )
  }

  const fetchData = (startTime, endTime) => {
    const params = { startTime: startTime, endTime: endTime }
    setTimeModalVisible(false)
    //加载loading
    var dom = document.createElement('div')
    dom.setAttribute('class', styles.loading)
    dom.setAttribute('id', 'loading')
    document.body.appendChild(dom)
    ReactDOM.render(<Spin tip="报表生成中..." size="large" />, dom)
    post('/cfg.php?controller=reportForms&action=showReportFormData', params)
      .then((res) => {
        if (res.success) {
          setReportName(res.name)
          setRetypeName(res.typeName)
          const Content = []
          res.data.map((item, index) => {
            Content.push(
              <FirstTitle
                number={index + 1}
                title={item.title}
                desc={item.desc}
                id={`${item.title}${index + 1}`}
              />
            )
            if (item.charts && item.charts.length > 0) {
              item.charts.map((firstContent) => {
                Content.push(
                  contentRender(
                    firstContent.type,
                    firstContent.data,
                    firstContent.name
                  )
                )
              })
            }
            if (item.children && item.children.length > 0) {
              item.children.map((secItem, secIndex) => {
                Content.push(
                  <SecondTitle
                    upNumber={index + 1}
                    number={secIndex + 1}
                    title={secItem.title}
                    id={`${secItem.title}${index + 1}${secIndex + 1}`}
                    desc={secItem.desc}
                  />
                )
                if (secItem.charts && secItem.charts.length > 0) {
                  secItem.charts.map((secContent) => {
                    Content.push(
                      contentRender(
                        secContent.type,
                        secContent.data,
                        secContent.name
                      )
                    )
                  })
                }
                if (secItem.children && secItem.children.length > 0) {
                  secItem.children.map((thirdItem, thirdIndex) => {
                    Content.push(
                      <ThirdTitle
                        firstNumber={index + 1}
                        secNumber={secIndex + 1}
                        number={thirdIndex + 1}
                        title={thirdItem.title}
                        id={`${thirdItem.title}${index + 1}${secIndex + 1}${
                          thirdIndex + 1
                        }`}
                        desc={thirdItem.desc}
                      />
                    )
                    if (thirdItem.charts && thirdItem.charts.length > 0) {
                      thirdItem.charts.map((thirdContent) => {
                        Content.push(
                          contentRender(
                            thirdContent.type,
                            thirdContent.data,
                            thirdContent.name
                          )
                        )
                      })
                    }
                  })
                }
              })
            }
          })
          Content.unshift(
            <HomePage name={res.name} time={res.date} typeName={res.typeName} />,
            // <Mulu mululist={mululist} />
          )
          setReportFormData(Content)
          document.body.removeChild(document.getElementById('loading'))
          setModalVisible(true)
        }
      })
      .catch((error) => {
        console.log(error)
        document.body.removeChild(document.getElementById("loading"));
        message.success('导出失败')
      })
  }
  const InvoicePDF = () => {
    return (
      <div ref={listRef} id="exportBox">
        {reportFormData}
      </div>
    )
  }
  const handleClickMenu = (value) => {
    const { key } = value
    let startTime
    let endTime
    switch (key) {
      case 'custom':
        setTimeModalVisible(true)
        break
      case 'today':
        startTime = moment().format('YYYY-MM-DD 00:00:00')
        endTime = moment().format(dateFormat)
        fetchData(startTime, endTime)
        break
      case 'week':
        startTime = moment().subtract(1, 'week').format(dateFormat)
        endTime = moment().format(dateFormat)
        fetchData(startTime, endTime)
        break
      case 'month':
        startTime = moment().subtract(1, 'months').format(dateFormat)
        endTime = moment().format(dateFormat)
        fetchData(startTime, endTime)
        break
      default:
        break
    }
  }

  const handelTimeForm = (values) => {
    const startTime = values.time[0]
    const endTime = values.time[1]
    fetchData(startTime, endTime)
  }

  const timeRender = (
    <div>
      <Menu
        onClick={handleClickMenu}
      >
        <Menu.Item key="title">
          <span style={{ fontWeight: 600 }}>生成报表</span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="today">当日</Menu.Item>
        <Menu.Item key="week">最近一周</Menu.Item>
        <Menu.Item key="month">最近一月</Menu.Item>
        <Menu.Item key="custom">自定义</Menu.Item>
      </Menu>
    </div>
  )

  //加载loading
  const showLoading = (text) => {
    var dom = document.createElement('div')
    dom.setAttribute('class', styles.loading)
    dom.setAttribute('id', 'loading')
    document.body.appendChild(dom)
    ReactDOM.render(<Spin tip={text} size="large" />, dom)
  }
  return (
    <div className={styles.main}>
      <Dropdown
        overlay={timeRender}
        placement="bottomRight"
        trigger="click"
        overlayClassName={styles.timeContainer}
      >
        <div>
          <img src={Reports} alt="" style={{ width: 16, height: 16 }} />
        </div>
      </Dropdown>

      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>分析报告预览</span>
            {/* <Space> */}
            <Button
              type="primary"
              onClick={() => {
                const close = new Promise((res, rej) => {
                  showLoading('导出报表中...')
                  setTimeout(() => {
                    res()
                  }, 100)
                })
                close.then(() => {
                  reportDocx(`${reportName}${retypeName}`)
                  setModalVisible(false)
                })
              }}
              style={{ position: 'absolute', top: 11, right: 56 }}
            >
              导出
            </Button>
            {/* <Button
                type="primary"
                onClick={()=>{
                  const close = new Promise((res,rej)=>{
                    setModalVisible(false);
                    showLoading('导出报表中...')
                    setTimeout(() => {
                      res()
                    }, 200);
                  })
                  close.then(()=>{
                    downloadPdf()
                  })
                }}
                style={{ position: "absolute", top: 11, right: 56 }}
              >
                导出pdf
              </Button> */}
            {/* </Space> */}
          </div>
        }
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false)
        }}
        wrapClassName={styles.pdfView}
        footer={null}
        width={778}
        destroyOnClose
      >
        <InvoicePDF />
      </Modal>

      <ModalForm
        visible={timeModalVisible}
        title="自定义导出报告"
        onFinish={handelTimeForm}
        modalProps={{
          onCancel: () => {
            setTimeModalVisible(false)
          },
          mask: false,
          getContainer: false,
          wrapClassName: styles.timeModal,
        }}
        width={400}
      >
        <ProFormDateTimeRangePicker
          label="选择时间"
          name="time"
          allowClear
          format={dateFormat}
          rules={[
            {
              required: true,
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        />
      </ModalForm>
    </div>
  )
}
