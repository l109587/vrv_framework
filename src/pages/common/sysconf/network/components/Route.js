import React, { useRef, useState, useEffect } from 'react'
import { language } from '@/utils/language'
import { post, get } from '@/services/https'
import { Button, Input, message, Popconfirm, Tag } from 'antd'
import { TableLayout } from '@/components'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-components'
import { useSelector } from 'umi'
import { modalFormLayout } from '@/utils/helper'
import { regIpList } from '@/utils/regExp'
import { fetchAuth } from '@/utils/common'
import './index.less'
const { ProtableModule } = TableLayout
const { Search } = Input
const Route = () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 228
  const writable = fetchAuth()
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      ellipsis: true,
      align: 'center',
    },
    {
      title: language('adminacc.label.status'),
      dataIndex: 'flag',
      key: 'flag',
      width: 120,
      ellipsis: true,
      align: 'center',
      render: (text, record) => {
        if (record.flag == 1) {
          return (
            <Tag style={{ marginRight: '0px', padding: '0px 10px' }} color="success">
              {language('sysconf.network.route.effective')}
            </Tag>
          )
        } else {
          return (
            <Tag style={{ marginRight: '0px', padding: '0px 10px' }} color="default">
              {language('sysconf.network.route.invalid')}
            </Tag>
          )
        }
      },
    },
    {
      title: language('sysconf.network.route.dest'),
      dataIndex: 'dest',
      key: 'dest',
      width: 180,
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('sysconf.network.route.mask'),
      dataIndex: 'mask',
      key: 'mask',
      width: 180,
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('sysconf.network.route.next'),
      dataIndex: 'next',
      key: 'next',
      width: 120,
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('sysconf.network.route.dev'),
      dataIndex: 'dev',
      key: 'dev',
      width: 140,
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('project.operate'),
      width: 120,
      ellipsis: true,
      align: 'center',
      valueType: 'option',
      key: 'option',
      hideInTable: !writable,
      render: (text, record) => {
        return (
          <Popconfirm
            title={language('project.delconfirm')}
            okText={language('project.yes')}
            cancelText={language('project.no')}
            onConfirm={() => {
              delRoute(record.id)
            }}
          >
            <Button size="small" type="link">
              {language('project.del')}
            </Button>
          </Popconfirm>
        )
      },
    },
  ]

  const formRef = useRef()
  const [devList, setDevList] = useState([])
  const concealColumns = {
    id: { show: false },
  }
  const [queryVal, setQueryVal] = useState() //首个搜索框的值
  const [incID, setIncID] = useState(0)
  const tableKey = 'netRouteTable'
  const apishowurl = '/cfg.php?controller=netSetting&action=showRoute'
  let searchVal = { queryVal: queryVal }
  const [modalStatus, setModalStatus] = useState(false)
  const rowKey = (record) => record.id

  useEffect(() => {
    showDevData()
  }, [])

  const showDevData = () => {
    post('/cfg.php?controller=netSetting&action=showRouteInterface').then(
      (res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        setDevList(res.data)
      }
    )
  }

  const delRoute = (id) => {
    post('/cfg.php?controller=netSetting&action=delRoute', { id: id }).then(
      (res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        message.success(res.msg)
        setIncID((incID) => incID + 1)
      }
    )
  }

  //添加按钮点击触发
  const addClick = () => {
    showModal('open')
  }

  const showModal = (status) => {
    if (status == 'open') {
      setModalStatus(true)
    } else {
      formRef.current.resetFields()
      setModalStatus(false)
    }
  }

  const setRoute = (values) => {
    let data = values
    post('/cfg.php?controller=netSetting&action=addRoute', data).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      message.success(res.msg)
      showModal('close')
      setIncID((incID) => incID + 1)
    })
  }

  return (
    <div className='routeDiv'>
      <ProtableModule
        incID={incID}
        columns={columns}
        tableKey={tableKey}
        searchVal={searchVal}
        apishowurl={apishowurl}
        addButton={true}
        rowkey={rowKey}
        addClick={addClick}
        clientHeight={clientHeight}
        columnvalue={'netRouteColVal'}
        concealColumns={concealColumns}
        showPage={true}
        noParams={true}
      />
      <ModalForm
        formRef={formRef}
        {...modalFormLayout}
        title={language('project.add')}
        visible={modalStatus}
        autoFocusFirstInput
        modalProps={{
          maskClosable: false,
          onCancel: () => {
            showModal('close')
          },
        }}
        className="networkModal"
        onVisibleChange={setModalStatus}
        submitTimeout={2000}
        onFinish={async (values) => {
          setRoute(values)
        }}
      >
        <ProFormText
          label={language('sysconf.network.route.dest')}
          name="dest"
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
            {
              pattern: regIpList.ipv4.regex,
              message: regIpList.ipv4.alertText,
            },
          ]}
        />
        <ProFormText
          label={language('sysconf.network.route.mask')}
          name="mask"
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
            {
              pattern: regIpList.ipv4.regex,
              message: language('sysconf.network.mask.regexMsg'),
            },
          ]}
        />
        <ProFormText
          label={language('sysconf.network.route.next')}
          name="next"
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
            {
              pattern: regIpList.ipv4.regex,
              message: regIpList.ipv4.alertText,
            },
          ]}
        />
        <ProFormSelect
          label={language('sysconf.network.route.dev')}
          name="dev"
          rules={[
            {
              required: true,
              message: language('project.messageselect'),
            },
          ]}
          options={devList}
          fieldProps={{
            fieldNames: {
              label: 'text',
            },
          }}
        />
      </ModalForm>
    </div>
  )
}

export default Route
