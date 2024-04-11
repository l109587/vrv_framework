import React, { useRef, useState, useEffect } from 'react'
import {
  ProTable,
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormSwitch,
} from '@ant-design/pro-components'
import {
  Button,
  Tooltip,
  Switch,
  Input,
  Modal,
  message,
  Popconfirm,
} from 'antd'
import { InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { post, postAsync } from '@/services/https'
import store from 'store'
import { modalFormLayout } from '@/utils/helper'
import { formatMessage, getIntl, useIntl, FormattedMessage } from 'umi'
import '@/utils/index.less'
import { language } from '@/utils/language'
import './index.less'
import { TableLayout } from '@/components'
import { fetchAuth } from '@/utils/common'
import { useSelector } from 'umi'
import { regIpList, regMacList, regList } from '@/utils/regExp'
const { ProtableModule } = TableLayout

const trans = (msg) => {
  return getIntl().formatMessage(msg)
}

const Nicset = (props) => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 194
  const writable = fetchAuth()
  const formRef = useRef()
  const actionRef = useRef()
  const [queryVal, setQueryVal] = useState('') //搜索值
  const [initialValue, setInitialValue] = useState()
  const [totalPage, setTotalPage] = useState(0) //总条数
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) //选中id数组
  const [nowPage, setNowPage] = useState(1) //当前页码
  const [tabledata, setTabledata] = useState([])
  const [requestNum, setRequestNum] = useState('')
  const [loading, setLoading] = useState(true) //加载
  const [typeList, setTypeList] = useState([])
  const { confirm } = Modal
  const [showmodal, setShowmodal] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [switchCheck, setSwitchCheck] = useState()
  const [modalStatus, setModalStatus] = useState(false) //model 添加弹框状态
  const [sta, setSta] = useState(true)
  const [densitySize, setDensitySize] = useState('middle')
  const startVal = 1
  const limitVal = store.get('pageSize') ? store.get('pageSize') : 10 //默认每页条数
  const [columnsHide, setColumnsHide] = useState({
    id: { show: false },
    gwv6: { show: false },
    mkv6: { show: false },
    ipv6: { show: false },
  }) //设置默认列

  let concealColumnList = {
    id: { show: false },
    gwv6: { show: false },
    mkv6: { show: false },
    ipv6: { show: false },
  }

  let allFields = [
    {
      key: 'ipv4',
      label: language('project.sysconf.network.ipv4address'),
      suffix: language('project.sysconf.network.tipv4'),
      rules: [
        {
          required: true,
          message: language('project.sysconf.network.ipv4addressinput'),
        },
        {
          pattern: regIpList.ipv4.regex,
          message: regIpList.ipv4.alertText,
        },
      ],
    },
    {
      key: 'mkv4',
      label: language('project.sysconf.network.ipv4mask'),
      suffix: language('project.sysconf.network.tipv4mask'),
      rules: [
        {
          required: true,
          message: language('project.sysconf.network.ipv4maskinput'),
        },
        {
          pattern: regIpList.ipv4.regex,
          message: language('sysconf.network.mask.regexMsg'),
        },
      ],
    },
    {
      key: 'gwv4',
      label: language('project.sysconf.network.ipv4geteway'),
      suffix: language('project.sysconf.network.tipv4geteway'),
      rules: [
        {
          required: true,
        },
        {
          pattern: regIpList.ipv4.regex,
          message: regIpList.ipv4.alertText,
        },
      ],
    },
    {
      key: 'gwmacv4',
      label: language('project.sysconf.network.ipv4getewaymac'),
      suffix: language('project.sysconf.network.tipv4mac'),
      rules: [
        {
          pattern: regMacList.mac.regex,
          message: regMacList.mac.alertText,
        },
      ],
      after: (
        <Button
          type="primary"
          onClick={() => {
            getMac()
          }}
        >
          {language('project.sysconf.network.obtain')}
        </Button>
      ),
    },
    {
      key: 'ipv6',
      label: language('project.sysconf.network.ipv6address'),
      suffix: language('project.sysconf.network.tipv6'),
      rules: [
        {
          pattern: regIpList.ipv6.regex,
          message: regIpList.ipv6.alertText,
        },
      ],
    },
    {
      key: 'mkv6',
      label: language('project.sysconf.network.ipv6mask'),
      suffix: language('project.sysconf.network.tipv6mask'),
      rules: [
        {
          pattern: regList.onlyNum.regex,
          message: language('sysconf.network.mkv6Msg'),
        },
        {
          validator: (rule, value) => {
            if (Number(value) > 128 || Number(value) < 0) {
              return Promise.reject(
                new Error(language('sysconf.network.mkv6Msg'))
              )
            } else {
              return Promise.resolve()
            }
          },
        },
      ],
    },
    {
      key: 'gwv6',
      label: language('project.sysconf.network.ipv6getewaymac'),
      suffix: language('project.sysconf.network.tipv6geteway'),
      rules: [
        {
          pattern: regIpList.ipv6.regex,
          message: regIpList.ipv6.alertText,
        },
      ],
    },
  ]

  const [fields, setFields] = useState(allFields)

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      align: 'center',
    },
    {
      title: language('project.sysconf.network.status'),
      dataIndex: 'status',
      align: 'center',
      fixed: 'left',
      width: 100,
      key: 'status',
      valueEnum: {
        Y: { text: language('project.enable') },
        N: { text: language('project.disable') },
      },
      render: (text, record, index) => {
        let checked = true
        if (record.status == 'N') {
          checked = false
        }
        return (
          <Switch
            checkedChildren={language('project.enable')}
            unCheckedChildren={language('project.disable')}
            checked={checked}
            onChange={(checked) => {
              SwitchBtn(record, checked)
            }}
            disabled={!writable}
          />
        )
      },
    },
    {
      width: 100,
      title: language('project.sysconf.network.name'),
      dataIndex: 'name',
      filters: true,
      onFilter: true,
      hideInSearch: true,
      align: 'center',
      ellipsis: true,
    },
    {
      title: language('project.sysconf.network.type'),
      width: 100,
      dataIndex: 'type',
      filters: true,
      onFilter: true,
      align: 'center',
      ellipsis: true,
      hideInSearch: true,
      render: (text, record, index) => {
        return typeList.map((item) => {
          if (item.value == record.type) {
            return item.label
          }
        })
      },
    },
    {
      title: language('project.sysconf.network.ipv4'),
      align: 'center',
      disable: true,
      dataIndex: 'ipv4',
      width: 140,
      filters: true,
      onFilter: true,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.network.mkv4'),
      align: 'center',
      width: 140,
      disable: true,
      dataIndex: 'mkv4',
      search: false,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.network.gwv4'),
      align: 'center',
      width: 160,
      key: 'showTime',
      dataIndex: 'gwv4',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: language('project.sysconf.network.gwmacv4'),
      align: 'center',
      key: 'gwmacv4',
      dataIndex: 'gwmacv4',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: language('project.sysconf.network.ipv6'),
      align: 'center',
      width: 170,
      dataIndex: 'ipv6',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: language('project.sysconf.network.mkv6'),
      align: 'center',
      width: 170,
      dataIndex: 'mkv6',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: language('project.sysconf.network.gwv6'),
      align: 'center',
      width: 140,
      dataIndex: 'gwv6',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: language('project.operate'),
      align: 'center',
      width: 120,
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            mod(record)
          }}
        >
          {language('project.edit')}
        </a>,
        <Popconfirm
          key="popconfirm"
          title={language('project.sysconf.network.clearconfirm')}
          onConfirm={() => {
            clearNetcard(record)
          }}
          okButtonProps={{
            loading: confirmLoading,
          }}
          okText={language('project.yes')}
          cancelText={language('project.no')}
        >
          <a>{language('project.sysconf.network.clear')}</a>
        </Popconfirm>,
      ],
    },
  ]

  const tableRef = useRef()
  let columnvalue = 'networkNicestTable'
  const [tableZWidth, setTableZWidth] = useState(0)
  let tableWidth = tableRef.current?.offsetWidth - 48 //获取页面宽度

  //页面更新宽度触发
  window.addEventListener('resize', function () {
    tableWidth = tableRef.current?.offsetWidth - 48
    setTableZWidth(tableWidth)
  })

  //获取table 长度
  let configWidth = 0
  let defaultWidthStatus = true
  columns?.map((item) => {
    if (
      !columnsHide[item.dataIndex] ||
      columnsHide[item.dataIndex].show == true
    ) {
      if (!item.width) {
        defaultWidthStatus = false
      }
      configWidth = configWidth + (item.width ? item.width : 200)
    }
  })

  useEffect(() => {
    getTabledata('first')
    getIFTypeList()
    showTableConf()
  }, [])

  /* 表格数据 start  数据起始值   limit 每页条数  */
  const getTabledata = (pagestart = '', pagelimit = '', value = '') => {
    setLoading(true)
    let data = {}
    post('/cfg.php?controller=netSetting&action=showInterface', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          setTabledata([...res.data])
          return false
        }
        setLoading(false)
        setTabledata([...res.data])
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  // 类型数据
  const getIFTypeList = () => {
    post('/cfg.php?controller=netSetting&action=getIFTypeList').then((res) => {
      if (res.success) {
        let list = []
        res.data.map((item) => {
          let tmp = {}
          tmp.label = item.text
          tmp.value = item.value
          tmp.hide = item.hide
          list.push(tmp)
        })
        setTypeList(list)
      }
    })
  }

  /* 回显表格密度列设置 */
  const showTableConf = async () => {
    let data = []
    data.module = columnvalue
    let res
    res = await postAsync(
      '/cfg.php?controller=confTableHead&action=showTableHead',
      data
    )
    if (res.density) {
      setDensitySize(res.density)
    }
    if (!res.success || res.data.length < 1) {
      columns?.map((item) => {
        if (!concealColumnList[item.dataIndex] && item.hideInTable != true) {
          let showCon = {}
          showCon.show = true
          concealColumnList[item.dataIndex] = showCon
        }
      })
      let data = []
      data.module = columnvalue
      data.value = JSON.stringify(concealColumnList)
      res = await postAsync(
        '/cfg.php?controller=confTableHead&action=setTableHead',
        data
      )
      if (res.success) {
        setColumnsHide(concealColumnList)
      }
    } else {
      setColumnsHide(res.data ? res.data : {})
    }
  }

  /* 表格列设置配置 */
  const columnsTableChange = (value) => {
    let data = []
    data.module = columnvalue
    data.value = JSON.stringify(value)
    post('/cfg.php?controller=confTableHead&action=setTableHead', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        setColumnsHide(value)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  /* 表格密度设置 */
  const sizeTableChange = (sizeType) => {
    let data = []
    data.module = columnvalue
    data.density = sizeType
    post('/cfg.php?controller=confTableHead&action=setTableHead', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        setDensitySize(sizeType)
      })
      .catch(() => {
        setDensitySize(sizeType)
        console.log('mistake')
      })
  }

  //赋值编辑表格
  const mod = (obj) => {
    if (obj.status == 'Y' || obj.status == true) {
      setSwitchCheck('checked')
    } else {
      setSwitchCheck('')
    }
    let hidden
    typeList.map((item) => {
      if (obj.type == item.value) {
        hidden = item.hide
      }
    })
    if (hidden == 'all') {
      setFields([])
    } else if (hidden == 'gwmacv4') {
      setFields(allFields.filter((item) => item.key !== 'gwmacv4'))
    } else {
      setFields(allFields)
    }
    // initialValues.status = obj.status
    let initialValues = obj
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues)
    }, 100)
    getModal(1)
  }

  //弹出编辑model
  const getModal = (status) => {
    if (status == 1) {
      setModalStatus(true)
    } else {
      formRef.current.resetFields()
      setModalStatus(false)
    }
  }

  //搜索
  const handsearch = (values) => {
    setQueryVal(values)
    getTabledata(startVal, limitVal, values)
  }

  //选中触发
  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    // setRecord(record)//选中行重新赋值
    setSelectedRowKeys(selectedRowKeys)
  }

  /* 清除网口 */
  const clearNetcard = (record) => {
    let data = {}
    data.name = record.name
    data.force = 'N'
    post('/cfg.php?controller=netSetting&action=clearIFeth', data)
      .then((res) => {
        if (res.success == false) {
          if (200 < res.code * 1 < 300) {
            clearConfirm(res, record)
          } else {
            message.error(res.msg)
            getTabledata()
            return false
          }
        } else {
          getTabledata()
          message.success(res.msg)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  /* 清除网口弹框 */
  const clearConfirm = (res, record) => {
    confirm({
      icon: <CloseCircleOutlined color="red" />,
      title: language('project.sysconf.network.forceclear'),
      content: res.msg,
      okText: language('project.mconfig.devices.ok'),
      cancelText: language('project.mconfig.devices.cancel'),
      onOk() {
        secondClearNetcard(record)
      },
    })
  }

  /* 第二次清除网口信息 */
  const secondClearNetcard = (record) => {
    let data = {}
    data.name = record.name
    data.force = 'Y'
    post('/cfg.php?controller=netSetting&action=clearIFeth', data)
      .then((res) => {
        message.success(res.msg)
        getTabledata()
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  // 修改编辑
  const Save = (info) => {
    let data = {}
    data.id = info.id
    data.name = info.name
    let status = 'N'
    if (info.status == 'Y' || info.status == true) {
      status = 'Y'
    }
    data.status = status
    data.type = info.type
    data.gwv4 = info.gwv4
    data.ipv4 = info.ipv4
    data.mkv4 = info.mkv4
    data.ipv6 = info.ipv6
    data.gwv6 = info.gwv6
    data.mkv6 = info.mkv6
    data.gwmacv4 = info.gwmacv4
    post('/cfg.php?controller=netSetting&action=setInterface', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        message.success(res.msg)
        getModal(2)
        getTabledata()
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  /* 获取mac地址 */
  const getMac = () => {
    let obj = formRef.current.getFieldsValue(['name', 'gwv4'])
    let data = {}
    data.name = obj.name
    data.gwv4 = obj.gwv4
    post('/cfg.php?controller=netSetting&action=getIFGatewayMAC', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        setTimeout(function () {
          formRef.current.setFieldsValue(res)
        }, 100)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  // 启用禁用
  const SwitchBtn = (record, checked) => {
    let data = {}
    data.id = record.id
    data.name = record.name
    // data.status = checked ? 'Y' : 'N';
    let status = 'N'
    if (checked) {
      status = 'Y'
    }
    data.status = status
    data.type = record.type
    data.gwv4 = record.gwv4
    data.ipv4 = record.ipv4
    data.mkv4 = record.mkv4
    data.ipv6 = record.ipv6
    data.gwv6 = record.gwv6
    data.mkv6 = record.mkv6
    data.gwmacv4 = record.gwmacv4
    post('/cfg.php?controller=netSetting&action=setInterface', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        // var list = tabledata
        // setTabledata([...list])
        getTabledata()
        message.success(res.msg)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  return (
    <div ref={tableRef} className='nicestDiv '>
      <ProTable
        search={false}
        editable={{
          type: 'multiple',
        }}
        className={
          tableZWidth > 0
            ? tableZWidth > configWidth + 120
              ? defaultWidthStatus
                ? 'proTableBox autdefaultoassmbtablebox'
                : 'proTableBox autoassmbtablebox'
              : 'proTableBox regassmbtablebox'
            : tableWidth > configWidth + 120
            ? defaultWidthStatus
              ? 'proTableBox autdefaultoassmbtablebox'
              : 'proTableBox autoassmbtablebox'
            : 'proTableBox regassmbtablebox'
        }
        bordered={true}
        scroll={{ y: clientHeight }}
        dateFormatter="string"
        loading={loading}
        columnEmptyText={false}
        //设置选中提示消失
        tableAlertRender={false}
        actionRef={actionRef}
        rowKey="id"
        rowkey={(record) => record.id}
        columns={writable ? columns : columns.slice(0, columns.length - 1)}
        dataSource={tabledata}
        //单选框选中变化
        rowSelection={{
          columnWidth: 32,
          selectedRowKeys,
          onChange: onSelectedRowKeysChange,
          getCheckboxProps: (record) => ({}),
        }}
        onSizeChange={(e) => {
          sizeTableChange(e)
        }}
        size={densitySize}
        columnsState={{
          value: columnsHide,
          onChange: (value) => {
            columnsTableChange(value)
          },
        }}
        options={{
          reload: function () {
            setLoading(true)
            getTabledata()
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return Object.assign(Object.assign({}, values), {
                created_at: [values.startTime, values.endTime],
              })
            }
            return values
          },
        }}
        pagination={false}
      />

      <ModalForm
        onFinish={async (values) => {
          Save(values)
        }}
        formRef={formRef}
        {...modalFormLayout}
        title={language('project.revise')}
        className="networkModal"
        visible={modalStatus}
        autoFocusFirstInput
        modalProps={{
          maskClosable: false,
          onCancel: () => {
            getModal(2)
          },
        }}
        onVisibleChange={setModalStatus}
        submitTimeout={2000}
      >
        <ProFormText label="ID" name="id" hidden />
        <ProFormSwitch
          name="status"
          label={language('project.sysconf.network.state')}
          checkedChildren={language('project.enable')}
          unCheckedChildren={language('project.disable')}
          valuePropName={switchCheck}
        />
        <ProForm.Item
          label={language('project.sysconf.network.network')}
          name="name"
        >
          <Input className="nicsetInput" />
        </ProForm.Item>
        <div className="typeselect">
          <ProForm.Item label={language('project.sysconf.network.type')}>
            <ProFormSelect
              request={async () => {
                return typeList
              }}
              allowClear={false}
              onChange={(value, key) => {
                if (key.hide == 'all') {
                  setFields([])
                } else if (key.hide == 'gwmacv4') {
                  setFields(allFields.filter((item) => item.key !== 'gwmacv4'))
                } else {
                  setFields(allFields)
                }
              }}
              initialValue="chapter"
              className="nicsetInput"
              name="type"
            />
          </ProForm.Item>
        </div>
        {fields.map((item) => {
          return (
            <ProForm.Item
              label={item.label}
              name={item.key}
              rules={item.rules}
              addonAfter={item.after}
            >
              <Input
                className="nicsetInput"
                suffix={
                  <Tooltip title={item.suffix}>
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
              />
            </ProForm.Item>
          )
        })}
      </ModalForm>
    </div>
  )
}
export default Nicset
