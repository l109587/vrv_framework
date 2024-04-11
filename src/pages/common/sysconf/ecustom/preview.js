import React, { useRef } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormText } from '@ant-design/pro-components'
import { Button } from 'antd'
import sty from './preview.less'
import { language } from '@/utils/language'

import BgBlue from '@/assets/common/login/bg-blue.png'
import BgRed from '@/assets/common/login/bg-red.png'
import bjistNBG from '@/assets/common/login/bg-img-nbg.png'
import bjistTAC from '@/assets/common/login/bg-img-tac.png'
import bjistNBA from '@/assets/common/login/bg-img-nba.png'
import bjistNTA from '@/assets/common/login/bg-img-nta.png'
import bjistDMC from '@/assets/common/login/bg-img-dmc.png'
import bjistNMD from '@/assets/common/login/bg-img-nmd.png'
import bjistNFD from '@/assets/common/login/bg-img-nfd.png'
import bjistNBGT from '@/assets/common/login/bg-img-nbg-top.png'

export default function LoginPreview(props) {
  const {
    bgFile = '',
    bgistFile = '',
    elementRef,
    name = '',
    vers = '',
  } = props
  const loginRef = useRef()

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
  const showBJ = () => {
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

  return (
    <>
      <div ref={elementRef} style={{ position: 'fixed', top: '5000px' }}>
        <div
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            backgroundImage: `url(${showBJ()})`,
          }}
        >
          <div style={{ display: 'flex' }}>
            <div
              style={{ height: '100vh', display: 'flex', alignItems: 'center' }}
            >
              <img
                src={showBgist()}
                alt="bgist"
                style={{ width: 583, height: 450 }}
              />
            </div>
            <div
              style={{ height: '100vh', display: 'flex', alignItems: 'center' }}
            >
              <div className={sty.formRight}>
                <div className={sty.logo}>
                  <span>{name}</span>
                </div>
                <LoginForm
                  className={sty.loginForm}
                  formRef={loginRef}
                  submitter={{
                    render: () => {
                      return (
                        <Button
                          type="primary"
                          size="large"
                          onClick={() => {
                            loginRef.current.submit()
                          }}
                        >
                          {language('project.login.btnlogin')}
                        </Button>
                      )
                    },
                  }}
                >
                  <ProFormText
                    name="username"
                    placeholder=""
                    fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
                    rules={[
                      {
                        required: true,
                        message: language('project.login.entername'),
                      },
                    ]}
                  />
                  <ProFormText.Password
                    name="password"
                    placeholder=""
                    fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
                    rules={[
                      {
                        required: true,
                        message: language('project.login.enterpawd'),
                      },
                    ]}
                  />
                </LoginForm>
              </div>
            </div>
          </div>
          <div
            style={{
              color: '#fff',
              position: 'absolute',
              left: '49%',
              bottom: '20px',
              marginLeft: '-110px',
            }}
          >
            {vers}
          </div>
        </div>
      </div>
    </>
  )
}
