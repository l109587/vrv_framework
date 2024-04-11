import React, { useRef, useState, useEffect } from 'react'
import { ProForm, ProCard, ProFormText } from '@ant-design/pro-components'
import { formleftLayout } from '@/utils/helper'
import { Alert, Row, Col, Upload, Button, message, Space, Modal } from 'antd'
import { UploadOutlined, SaveOutlined, EyeOutlined } from '@ant-design/icons'
import { post } from '@/services/https'
import { msg } from '@/utils/fun'
import { language } from '@/utils/language'
import styles from './index.less'
import store from 'store'
import { fetchAuth } from '@/utils/common'
import { regList } from '@/utils/regExp'
import Preview from './preview'
import html2canvas from 'html2canvas'

import bjistNBG from '@/assets/common/login/bg-img-nbg.png'
import bjistTAC from '@/assets/common/login/bg-img-tac.png'
import bjistNBA from '@/assets/common/login/bg-img-nba.png'
import bjistNTA from '@/assets/common/login/bg-img-nta.png'
import bjistDMC from '@/assets/common/login/bg-img-dmc.png'
import bjistNMD from '@/assets/common/login/bg-img-nmd.png'
import bjistNFD from '@/assets/common/login/bg-img-nfd.png'
import bjistNBGT from '@/assets/common/login/bg-img-nbg-top.png'
import BgBlue from '@/assets/common/login/bg-blue.png'
import BgRed from '@/assets/common/login/bg-red.png'

export default function Ecustom() {
  const writable = fetchAuth()
  const formRef = useRef()
  const elementRef = useRef(null)

  const [logoFile, setLogoFile] = useState('')
  const [bgFile, setBgFile] = useState('')
  const [bgistFile, setBgistFile] = useState('')
  const [productName, setProductName] = useState('') //产品名称
  const [factInfo, seFactInfo] = useState('') //厂商信息

  useEffect(() => {
    showEnCustom()
    fetchlogo()
    fetchBg()
    fetchBgist()
  }, [])

  //图片转换
  const handlePreview = async () => {
    const timestamp = Date.now()
    const element = elementRef.current

    if (element) {
      try {
        // 使用 html2canvas 将 DOM 元素转为图片
        const canvas = await html2canvas(element)

        // 创建一个新的图片元素用于预览
        const src = canvas.toDataURL()

        // 在这里可以执行预览逻辑，比如显示弹窗、调整样式等
        const newContent = `
          <html>
            <head>
              <title>登录页预览</title>
              <style>
                body {
                  margin: 0;
                  height: 100vh;
                  width: 100%;
                }
                img {
                  width: 100%;
                  height: 100vh;
                }
              </style>
            </head>
            <body>
              <img src=${src} alt="Full Screen Preview" />
            </body>
          </html>
          `
        const newdoc = window.open('', `预览${timestamp}`)
        newdoc.document.write(newContent)
      } catch (error) {
        console.error('Error converting element to image:', error)
      }
    }
  }

  //获取背景logo
  const fetchBg = (preview) => {
    post(
      '/login.php?action=background',
      { bjtp: SYSTEM, preview: preview },
      { responseType: 'arraybuffer' }
    ).then((res) => {
      const data =
        'data:image/png;base64,' +
        btoa(
          new Uint8Array(res).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        )
      setBgFile(data)
    })
  }
  //获取背景配图
  const fetchBgist = (preview) => {
    post(
      '/login.php?action=background_img',
      { bjtp: SYSTEM, preview: preview },
      { responseType: 'arraybuffer' }
    ).then((res) => {
      const data =
        'data:image/png;base64,' +
        btoa(
          new Uint8Array(res).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        )
      setBgistFile(data)
    })
  }
  //获取logo
  const fetchlogo = () => {
    post('/login.php?action=logo', {}, { responseType: 'arraybuffer' }).then(
      (res) => {
        const data =
          'data:image/png;base64,' +
          btoa(
            new Uint8Array(res).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          )
        setLogoFile(data)
      }
    )
  }

  //产品基础信息回显
  const showEnCustom = () => {
    post('/cfg.php?controller=sysDeploy&action=showEnCustom').then((res) => {
      if (res.success) {
        const { product, company } = res
        setProductName(product)
        seFactInfo(company)
        formRef.current.setFieldsValue({ product: product, company: company })
      }
    })
  }

  const logoHandleUpload = (info) => {
    if (info.file.status === 'done') {
      const { success, msg } = info.file.response
      if (success) {
        msg && message.success(msg)
        fetchlogo()
      } else {
        msg && message.error(msg)
      }
    }
  }

  const bgHandleUpload = (info) => {
    if (info.file.status === 'done') {
      const { success, msg } = info.file.response
      if (success) {
        msg && message.success(msg)
        fetchBg(1)
      } else {
        msg && message.error(msg)
      }
    }
  }
  const bgistHandleUpload = (info) => {
    if (info.file.status === 'done') {
      const { success, msg } = info.file.response
      if (success) {
        msg && message.success(msg)
        fetchBgist(1)
      } else {
        msg && message.error(msg)
      }
    }
  }
  const logoUpdateProps = {
    accept: '.png',
    action: '/cfg.php?controller=sysDeploy&action=imageUpload',
    name: 'file',
    data: { token: store.get('token'), type: 'logo' },
    listType: 'picture-card',
    beforeUpload: (file, fileList) => LogoBeforeUpload(file, fileList),
    style: {
      display: 'inline-block',
    },
    maxCount: 1,
    onChange: (info, fileList) => logoHandleUpload(info, fileList),
    showUploadList: false,
  }

  const bgUpdateProps = {
    accept: '.png',
    action: '/cfg.php?controller=sysDeploy&action=imageUpload',
    name: 'file',
    data: { token: store.get('token'), type: 'bg', bjtp: SYSTEM },
    listType: 'picture-card',
    beforeUpload: (file, fileList) => bgBeforeUpload(file, fileList),
    style: {
      display: 'inline-block',
    },
    maxCount: 1,
    onChange: (info) => bgHandleUpload(info),
    showUploadList: false,
  }

  const bgistUpdateProps = {
    accept: '.png',
    action: '/cfg.php?controller=sysDeploy&action=imageUpload',
    name: 'file',
    data: { token: store.get('token'), type: 'bg_img', bjtp: SYSTEM },
    listType: 'picture-card',
    beforeUpload: (file, fileList) => bgistBeforeUpload(file, fileList),
    style: {
      display: 'inline-block',
    },
    maxCount: 1,
    onChange: (info) => bgistHandleUpload(info),
    showUploadList: false,
  }

  const LogoBeforeUpload = (file, fileList) => {
    let name = file.name
    let suffix = name.substr(name.lastIndexOf('.'))
    if (suffix != '.png') {
      message.error(language('sysconf.ecustom.uploaderror'))
      return false
    }
    return new Promise((resolve, reject) => {
      const islogo1M = file.size / 1024 / 1024 < 1
      let filereader = new FileReader()
      filereader.onload = (e) => {
        let src = e.target.result
        const image = new Image()
        image.onerror = reject
        image.src = src
        image.onload = function () {
          if (!islogo1M) {
            message.error(language('project.sysconf.ecustom.logosizefault'))
            return reject(false)
          } else if (image.width !== 72 || image.height !== 72) {
            message.error(language('project.sysconf.ecustom.whfault'))
            return reject(false)
          } else {
            return resolve(true)
          }
        }
      }
      filereader.readAsDataURL(file)
    })
  }

  const bgBeforeUpload = (file, fileList) => {
    let name = file.name
    let suffix = name.substr(name.lastIndexOf('.'))
    if (suffix != '.png') {
      message.error(language('sysconf.ecustom.uploaderror'))
      return false
    }
    return new Promise((resolve, reject) => {
      const islogo5M = file.size / 1024 / 1024 < 5
      let filereader = new FileReader()
      filereader.onload = (e) => {
        let src = e.target.result
        const image = new Image()
        image.onerror = reject
        image.src = src
        image.onload = function () {
          if (!islogo5M) {
            message.error(language('project.sysconf.ecustom.bgsizefault'))
            return reject(false)
          } else if (image.width !== 1920 || image.height !== 1080) {
            message.error(language('project.sysconf.ecustom.whfault'))
            return reject(false)
          } else {
            return resolve(true)
          }
        }
      }
      filereader.readAsDataURL(file)
    })
  }

  const bgistBeforeUpload = (file, fileList) => {
    let name = file.name
    let suffix = name.substr(name.lastIndexOf('.'))
    if (suffix != '.png') {
      message.error(language('sysconf.ecustom.uploaderror'))
      return false
    }
    return new Promise((resolve, reject) => {
      const isbgist1M = file.size / 1024 / 1024 < 1
      let filereader = new FileReader()
      filereader.onload = (e) => {
        let src = e.target.result
        const image = new Image()
        image.onerror = reject
        image.src = src
        image.onload = function () {
          if (!isbgist1M) {
            message.error(language('project.sysconf.ecustom.logosizefault'))
            return reject(false)
          } else if (image.width !== 583 || image.height !== 450) {
            message.error(language('project.sysconf.ecustom.whfault'))
            return reject(false)
          } else {
            return resolve(true)
          }
        }
      }
      filereader.readAsDataURL(file)
    })
  }

  const showBg = () => {
    if (process.env.NODE_ENV === 'production') {
      return bgFile
    } else {
      if (SYSTEM === 'nba') {
        return BgRed
      } else {
        return BgBlue
      }
    }
  }

  const showBgist = () => {
    if (process.env.NODE_ENV === 'production') {
      return bgistFile
    } else {
      switch (SYSTEM) {
        case 'tac':
          return bjistTAC
        case 'nbg':
          return bjistNBG
        case 'nba':
          return bjistNBA
        case 'nta':
          return bjistNTA
        case 'dmc':
          return bjistDMC
        case 'nmd':
          return bjistNMD
        case 'nfd':
          return bjistNFD
        case 'nbg-top':
          return bjistNBGT
      }
      return bjistTAC
    }
  }

  //设置产品基础信息
  const saveConfig = (values) => {
    const data = { product: '', company: '' }
    const params = { ...data, ...values, bjtp: SYSTEM }
    post('/cfg.php?controller=sysDeploy&action=setEnCustom', params).then(
      (res) => {
        if (res.success) {
          msg(res)
        } else {
          msg(res)
        }
      }
    )
  }

  return (
    <>
      <ProCard
        direction="column"
        gutter={[13, 13]}
        bodyStyle={{ paddingBottom: 0 }}
      >
        <div style={{ fontSize: '16px', color: '#101010' }}>
          {language('project.sysconf.ecustom.title')}
        </div>
        <ProForm
          formRef={formRef}
          {...formleftLayout}
          onFinish={saveConfig}
          submitter={{
            // 配置按钮的属性
            resetButtonProps: {
              style: {
                // 隐藏重置按钮
                display: 'none',
              },
            },
            submitButtonProps: {
              style: {
                // 隐藏提交按钮
                display: 'none',
              },
            },
          }}
        >
          <ProFormText
            width={300}
            name="product"
            label={language('project.sysconf.ecustom.product')}
            rules={[
              {
                max: 64,
              },
              {
                pattern: regList.strmax.regex,
                message: regList.strmax.alertText,
              },
            ]}
            fieldProps={{
              onChange: (text) => {
                setProductName(text.target.value)
              },
            }}
          />
          <ProFormText
            width={300}
            name="company"
            label={language('project.sysconf.ecustom.company')}
            rules={[
              {
                max: 64,
              },
              {
                pattern: regList.strmax.regex,
                message: regList.strmax.alertText,
              },
            ]}
            fieldProps={{
              onChange: (text) => {
                seFactInfo(text.target.value)
              },
            }}
          />

          <ProFormText
            label={language('project.sysconf.ecustom.logo')}
            wrapperCol={{
              xs: { span: 7 },
              sm: { span: 12 },
            }}
          >
            <div className={styles.logo}>
              <img src={logoFile || '/logo.png'} style={{ width: 36 }} />
            </div>
            <div style={{ display: 'flex' }}>
              <div className={styles.uploadButton}>
                <Upload {...logoUpdateProps}>
                  <Button
                    icon={<UploadOutlined />}
                    type="primary"
                    ghost
                    disabled={!writable}
                  >
                    {language('project.sysconf.ecustom.changepic')}
                  </Button>
                </Upload>
              </div>
              <Alert
                style={{ height: 32, width: 367 }}
                message={language('project.sysconf.ecustom.logomsg')}
                type="info"
                showIcon
              />
            </div>
          </ProFormText>
          <div style={{ position: 'relative' }}>
            <ProFormText
              label={language('project.sysconf.ecustom.bg')}
              wrapperCol={{
                xs: { span: 7 },
                sm: { span: 10 },
              }}
            >
              <div
                style={{
                  width: 480,
                  height: 270,
                  backgroundColor: '#e8e8e8',
                  marginBottom: 12,
                }}
              >
                <img src={showBg()} style={{ width: '100%', height: '100%' }} />
              </div>
              <div className={styles.uploadBg}>
                <Row>
                  <Col>
                    <Upload {...bgUpdateProps}>
                      <Button
                        icon={<UploadOutlined />}
                        type="primary"
                        ghost
                        disabled={!writable}
                      >
                        {language('project.sysconf.ecustom.uploadpic')}
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </div>
              <div
                style={{ position: 'absolute', bottom: '8px', left: '113px' }}
              >
                <Alert
                  style={{ height: 32, width: 368 }}
                  message={language('project.sysconf.ecustom.bgmsg')}
                  type="info"
                  showIcon
                />
              </div>
            </ProFormText>
          </div>
          <div style={{ position: 'relative' }}>
            <ProFormText
              label={language('project.sysconf.ecustom.bgist')}
              wrapperCol={{
                xs: { span: 7 },
                sm: { span: 10 },
              }}
            >
              <div
                style={{
                  width: 140,
                  height: 115,
                  backgroundColor: '#e8e8e8',
                  marginBottom: 12,
                }}
              >
                <img
                  src={showBgist()}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div className={styles.uploadBg}>
                <Row>
                  <Col>
                    <Upload {...bgistUpdateProps}>
                      <Button
                        icon={<UploadOutlined />}
                        type="primary"
                        ghost
                        disabled={!writable}
                      >
                        {language('project.sysconf.ecustom.uploadpic')}
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </div>
              <div
                style={{ position: 'absolute', bottom: '8px', left: '113px' }}
              >
                <Alert
                  style={{ height: 32, width: 374 }}
                  message={language('project.sysconf.ecustom.bgistmsg')}
                  type="info"
                  showIcon
                />
              </div>
            </ProFormText>
          </div>
          <Col offset={6} style={{ marginBottom: 6 }}>
            <Space>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={handlePreview}
                disabled={!writable}
              >
                {language('project.sysconf.ecustom.bgpreview')}
              </Button>
              <Button
                icon={<SaveOutlined />}
                type="primary"
                htmlType="submit"
                disabled={!writable}
              >
                {language('project.sysconf.ecustom.saveconfig')}
              </Button>
            </Space>
          </Col>
        </ProForm>
        <Preview
          elementRef={elementRef}
          bgFile={bgFile}
          bgistFile={bgistFile}
          name={productName}
          vers={factInfo}
        />
      </ProCard>
    </>
  )
}
