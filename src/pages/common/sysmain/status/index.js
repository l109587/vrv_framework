import React, { useRef, useState, useEffect } from 'react'
import { ProCard } from '@ant-design/pro-components'
import ProForm, { ProFormItem } from '@ant-design/pro-form'
import { formItemLayout } from '@/utils/helper'
import { language } from '@/utils/language'
import { connect, useDispatch } from 'umi'
import { Row, Col, Button, message, Modal, Tag, Popover, Spin } from 'antd'
import {
  PoweroffOutlined,
  QuestionCircleFilled,
  QuestionCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons'
import { fetchAuth } from '@/utils/common'
import { post, get } from '@/services/https'
import { regList, regIpList } from '@/utils/regExp'
import '@/utils/index.less'
import './index.less'
import WebUploadr from '@/components/Module/webUploadr'
const { confirm } = Modal

const SystemState = () => {
  const writable = fetchAuth()
  // 100m 10m 100k
  const formRef = useRef()
  const authformRef = useRef()
  const dispatch = useDispatch()
  const [fileList, setFileList] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [prdinfodata, setPrdinfodata] = useState({})
  const [licinfodata, setLicinfodata] = useState({})
  const [msgtext, setMsgtext] = useState('')
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSuccess = (res) => {
    if (res.success) {
      setIsModalVisible(true)
      setMsgtext(res.msg)
    } else {
      Modal.warning({
        title: language('project.title'),
        content: res.msg,
        okText: language('project.determine'),
        className: 'upwarningmda',
      })
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    post('/cfg.php?controller=sys&action=showSystemState').then((res) => {
      if (res.success) {
        setPrdinfodata(res.prdInfo)
        setLicinfodata(res.licInfo)
      } else {
      }
    })
  }

  const handleOk = () => {
    setConfirmLoading(true)
    post('/cfg.php?controller=sys&action=licenseUpdate', {}).then((res) => {
      if (res.success) {
        message.success(res.msg)
        setTimeout(() => {
          setConfirmLoading(false)
          setIsModalVisible(false)
          dispatch({ type: 'app/signOut' })
        }, 2000)
      } else {
        message.error(res.msg)
      }
    })
  }

  const handleRestart = () => {
    confirm({
      title: language('sysmain.ststus.restarts.title'),
      icon: <QuestionCircleFilled />,
      content: language('sysmain.ststus.restarts.content'),
      onOk: () => {
        reStartFn()
      },
      onCancel() {},
      className: 'confirmModal',
    })
  }

  const handleShutdown = () => {
    confirm({
      title: language('sysmain.ststus.shutdown.title'),
      icon: <QuestionCircleFilled style={{ color: '#FF0000' }} />,
      content: language('sysmain.ststus.shutdown.content'),
      onOk: () => {
        shutDownFn()
      },
      onCancel() {},
      className: 'confirmModal',
      okType: 'danger',
    })
  }

  const reStartFn = () => {
    post('/cfg.php?controller=sys&action=systemReboot', {}).then((res) => {
      if (res.success) {
        message.success(res.msg)
      }
    })
    setLoading(true)
    setTimeout(function () {
      checkRebootFinish()
    }, 2000)
  }

  let timer = ''
  const checkRebootFinish = () => {
    timer = setInterval(() => {
      post('/cfg.php?controller=sys&action=checkRebootFinish', {}).then(
        (res) => {
          if (res.success) {
            setLoading(false)
            clearInterval(timer)
          }
        }
      )
    }, 2000)
  }

  const shutDownFn = () => {
    post('/cfg.php?controller=sys&action=systemShutdown').then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      message.success(res.msg)
      dispatch({ type: 'app/signOut' })
    })
  }

  const svrexpDescrip = (
    <div className="timeDeseDiv">
      <div>
        <span style={{ color: '#12C189' }}>
          {language('sysmain.ststus.dueAuthoriz')}
        </span>
        <span>{language('sysmain.ststus.dueAuthoriz.content')}</span>
      </div>
      <div>
        <span style={{ color: 'rgb(255, 116, 41)' }}>
          {language('sysmain.ststus.trialAuthoriz')}
        </span>
        <span>{language('sysmain.ststus.trialAuthoriz.content')}</span>
      </div>
      <div>
        <i>{language('sysmain.ststus.authoriz.message')}</i>
      </div>
    </div>
  )

  const isAuto = true
  const upbutext = language('sysmain.ststus.upload.text')
  const maxSize = 1
  const accept = '.lic'
  const upurl = '/cfg.php?controller=sys&action=licenseUpload'
  const isShowUploadList = false // 是否回显文件名与进度条
  const maxCount = 1
  const isUpsuccess = true

  return (
    <Spin spinning={loading} size="large" tip={'重启中，请稍等'}>
      <ProCard ghost direction="column" gutter={[13, 13]}>
        <ProCard title={language('sysmain.ststus.produinfo')}>
          <ProForm
            {...formItemLayout}
            formRef={formRef}
            className="produform"
            autoFocusFirstInput
            submitter={false}
          >
            <ProFormItem label={language('sysmain.ststus.pmodel')}>
              {prdinfodata.pmodel}
            </ProFormItem>
            <ProFormItem label={language('sysmain.ststus.hwuuid')}>
              {prdinfodata.hwuuid}
            </ProFormItem>
            <ProFormItem label={language('sysmain.ststus.uptime')}>
              {prdinfodata.uptime}
            </ProFormItem>
            <ProFormItem label={language('sysmain.ststus.storage')}>
              {prdinfodata.hwinfo}
            </ProFormItem>
          </ProForm>
        </ProCard>
        <ProCard title={language('sysmain.ststus.authoinfo')}>
          <ProForm
            {...formItemLayout}
            formRef={authformRef}
            className="authform"
            autoFocusFirstInput
            submitter={false}
          >
            <ProFormItem label={language('sysmain.ststus.serial')}>
              {licinfodata.serial}
            </ProFormItem>
            <ProFormItem label={language('sysmain.ststus.authstatus')}>
              <Tag
                style={{
                  background: licinfodata.status_color,
                  color: licinfodata.status_ftclr,
                  paddingLeft: 16,
                  paddingRight: 16,
                  borderRadius: 5,
                }}
              >
                {licinfodata.status}
              </Tag>
            </ProFormItem>
            <ProFormItem label={language('sysmain.ststus.ahzusr')}>
              {licinfodata.ahz_user}
            </ProFormItem>
            <ProFormItem
              label={language('sysmain.ststus.svrexpi')}
              addonAfter={
                <Popover
                  placement="right"
                  trigger="hover"
                  title={language('sysmain.ststus.svrexpi.termDesc')}
                  content={svrexpDescrip}
                >
                  <QuestionCircleOutlined
                    style={{
                      color: '#FccA00',
                      fontSize: 20,
                      cursor: 'pointer',
                    }}
                  />
                </Popover>
              }
            >
              {licinfodata.svr_expi}
            </ProFormItem>
            <ProFormItem label={language('sysmain.ststus.svrtele')}>
              {licinfodata.svr_tele}
            </ProFormItem>
            <ProFormItem label={language('sysmain.ststus.ahz_type')}>
              {licinfodata?.ahz_type?.map((item) => (
                <Tag color="cyan">{item}</Tag>
              ))}
            </ProFormItem>
            <ProFormItem label={language('sysmain.ststus.uploadauth')}>
              <div className="statusupDiv">
                <WebUploadr
                  isUpsuccess={isUpsuccess}
                  isAuto={isAuto}
                  upbutext={upbutext}
                  maxSize={maxSize}
                  accept={accept}
                  upurl={upurl}
                  onSuccess={onSuccess}
                  isShowUploadList={isShowUploadList}
                  maxCount={maxCount}
                />
              </div>
            </ProFormItem>
          </ProForm>
        </ProCard>
        <ProCard  title={language('sysmain.ststus.sysopertion')} className='sysoperCard'>
          <Row>
            <Col offset={5}>
              <Button
                type="default"
                style={{
                  backgroundColor: '#FAAD15',
                  borderColor: '#FAAD15',
                  color: 'white',
                  marginRight: 30,
                }}
                disabled={!writable}
                icon={<RedoOutlined style={{ fontSize: 14 }} />}
                onClick={() => {
                  handleRestart()
                }}
              >
                {language('sysmain.ststus.sys.restart')}
              </Button>
              <Button
                type="danger"
                style={{
                  backgroundColor: '#FF0000',
                  borderColor: '#FF0000',
                  color: 'white',
                  marginRight: 30,
                }}
                disabled={!writable}
                icon={<PoweroffOutlined />}
                onClick={() => {
                  handleShutdown()
                }}
              >
                {language('sysmain.ststus.sys.shutdown')}
              </Button>
            </Col>
          </Row>
        </ProCard>
        <Modal
          title={language('sysmain.ststus.isauth')}
          visible={isModalVisible}
          confirmLoading={confirmLoading}
          className="statusisauth"
          onOk={handleOk}
          onCancel={() => {
            setIsModalVisible(false)
          }}
          maskClosable={false}
          keyboard={false}
        >
          <p>{msgtext}</p>
        </Modal>
      </ProCard>
    </Spin>
  )
}
export default SystemState
