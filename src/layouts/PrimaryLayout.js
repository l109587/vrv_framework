/* global window */
/* global document */
import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { setLocale, getLocale, withRouter, connect, Link } from 'umi'
import { MyLayout, GlobalFooter } from 'components'
import { BackTop, Layout, Drawer, ConfigProvider, Menu } from 'antd'
import { enquireScreen, unenquireScreen } from 'enquire-js'
import { config, getLocalelang } from 'utils'
import styles from './PrimaryLayout.less'
import store from 'store'
import enUSIntl from 'antd/lib/locale/en_US'
import zhCNIntl from 'antd/lib/locale/zh_CN'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import en_US from 'antd/lib/locale-provider/en_US'
import moment from 'moment'
const { pathToRegexp } = require('path-to-regexp')
const { Header, Content } = Layout
const { Bread, Sider } = MyLayout
import { postAsync } from '@/services/https'
import MenuHeader from '@/components/Layout/HeaderwithMenu'
import MyHeader from '@/components/Layout/Header'

let val = 0
var time //设置一个全局变量

const languages = [
  {
    value: 'zh-CN',
    label: '中文',
  },
  {
    value: 'en-US',
    label: '英文',
  },
]

const languagesType = {
  'zh-CN': zh_CN,
  'en-US': en_US,
}
const { NODE_ENV } = process.env


const menuLangChange = (langs, menus) => {
  menus.map((item, index) => {
    item.name = item[langs].name
    if (item.children)
      item.children.map((child, index) => {
        child.name = child[langs].name
      })
  })

  return menus
}

@withRouter
@connect(({ app, loading }) => ({ app, loading }))
class PrimaryLayout extends PureComponent {
  state = {
    intl: getLocale() ? getLocale() : 'zh-CN',
    julpUrl: '',
    nowProject: 'dsp',
  }

  componentDidMount() {
    this.fetchAuthList()
    function gethtmlfontsize() {
      // 1.获取html的宽,
      let htmlwidth =
        document.documentElement.clientWidth || document.body.clientWidth //有些浏览器documentElement获取不到,那就使用后面的body

      // 2.htmlDom
      let htmlDom = document.getElementsByTagName('html')[0]

      //3.设置根元素样式
      htmlDom.style.fontSize = htmlwidth / 20 + 'px'
    }
    console.log(store.get('token'))
    function regMsg (event){
      console.log(event)
      if(event && event.data == 'loginOut'){
        dispatch({type: 'app/signOut'});  
        store.set('outtime',time)
      }else {
        console.log('csy1111111111111')
      }
    }

    // 调用一次
    gethtmlfontsize()

    // 添加监听事件(resize是监听的意思)
    window.addEventListener('resize', gethtmlfontsize)
    window.addEventListener('message', regMsg);
    clearTimeout(time)
    const { dispatch } = this.props

    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const url = protocol + '//' + hostname + ':'
    this.setState({ julpUrl: url })
  }

  componentWillUnmount() {}

  onCollapseChange = (collapsed) => {
    this.props.dispatch({
      type: 'app/handleCollapseChange',
      payload: collapsed,
    })
  }

  getMsg = (data) => {
    //更新系统内置语言
    moment.locale(languagesType[data].locale)
    setLocale(data) //更改语言
  }
  //获取菜单权限
  fetchAuthList = async () => {
    const menuParams = NODE_ENV === 'development' ? { env: SYSTEM ?? '' } : {}
    const res = await postAsync(
      '/cfg.php?controller=menu&action=menuTree',
      menuParams
    )
    if (res.success) {
      //添加页面内操作权限
      const authsList = []
      res.data.map((item) => {
        if (item.children && item.children.length > 0) {
          item.children.map((childItem) => {
            authsList.push({
              route: childItem.route,
              writable: childItem?.wrt === 0 ? false : true,
            })
          })
        }
      })
      this.props.dispatch({
        type: 'app/changeAuths',
        payload: {
          authsList: authsList,
        },
      })
    } else {
      return false
    }
  }

  adjustIframe1 = () => {
    var ifm = document.getElementById('iframe2')
    ifm.height = document.documentElement.clientHeight
    ifm.width = document.documentElement.clientWidth
    ifm.contentWindow?.postMessage({ token: store.get('token') }, '*')
  }
  onSelect = (values) => {
    this.setState({
      nowProject: values.key,
    })
  }
 
  render() {
    const { app, location, dispatch, children } = this.props

    const { theme, collapsed, notifications, layout } = app
    const { isMobile, nowProject } = this.state
    const { onCollapseChange } = this
    const lange = getLocalelang()
    const menus = menuLangChange(lange, store.get('Permission') || [])

    const headerProps = {
      menus,
      collapsed,
      notifications,
      onCollapseChange,
      fixed: config.fixedHeader,
      onAllNotificationsRead() {
        dispatch({ type: 'app/allNotificationsRead' })
      },
      onSignOut() {
        dispatch({ type: 'app/signOut' })
      },
    }

    const siderProps = {
      theme,
      menus,
      isMobile,
      collapsed,
      onCollapseChange,
    }
  
    const TopMenu = () => {
      return (
        <div style={{
          marginLeft: '95px',
          width: '-webkit-fill-available'
        }}>
        <Menu
          mode="horizontal"
          theme="dark"
          selectedKeys={nowProject}
          onSelect={this.onSelect}
          className={styles.topmenu}
        >
          <Menu.Item key={'dsp'}>
            <Link>
              <span style={{fontSize: '18px'}}>处置系统</span>
            </Link>
          </Menu.Item>
          <Menu.Item key={'nac'}>
            <Link>
              <span style={{fontSize: '18px'}}>保密组件</span>
            </Link>
          </Menu.Item>
        </Menu>
        </div>
      )
    }

    const { intl, julpUrl } = this.state

    return (
      <div ref={(e) => (this.divDom = e)}>
        <ConfigProvider locale={languagesType[intl]}>
          <Fragment>
            {layout === 'top' ? (
              <Layout>
                <div className={styles.bottomContainer}>
                  <Header style={{ height: 48, lineHeight: 48 }}>
                    <MenuHeader
                      {...headerProps}
                      intlMap={languages}
                      intl={intl}
                      person={this.getMsg}
                    />
                  </Header>
                  <Content className={styles.botBontent}> {children} </Content>
                </div>
              </Layout>
            ) : (
              <Layout>
                {SYSTEM == 'dsp' ? <div style={{display: nowProject == 'dsp' ? 'block' : 'none'}}> <Sider {...siderProps} />  </div> : <Sider {...siderProps} /> }
                <div
                  id="primaryLayout"
                  className={styles.container}
                  style={{ paddingTop: config.fixedHeader ? 72 : 0 }}
                >
                  <MyHeader
                    {...headerProps}
                    intlMap={languages}
                    julpHtml={TopMenu()}
                    intl={intl}
                    person={this.getMsg}
                  />
                  {SYSTEM == 'dsp' ? (
                    <>
                      <div style={{display: nowProject == 'dsp' ? 'block' : 'none'}}>
                      {/* <iframe id='iframe1' key={1} src={'http://10.88.2.17:8000'} frameBorder='0' scrolling='auto' onLoad={this.adjustIframe}></iframe> */}
                      {/* <Content className={styles.content}> {children} </Content> */}
                      <Content className={styles.content}> {children} </Content>
                      {/* { nowProject == 'dsp' && <MemoizedMyContent /> } */}
                      </div>
                      <div style={{display: nowProject == 'dsp' ? 'none' : 'block'}}>
                       {/* <iframe id='iframe2' key={2} src={'http://10.88.2.17:8000'} frameBorder='0' scrolling='auto' onLoad={this.adjustIframe1}></iframe> */}
                        <iframe
                          id="iframe2"
                          src={'/BMZ/'}
                          frameBorder="0"
                          scrolling="auto"
                          onLoad={this.adjustIframe1}
                        ></iframe>
                       </div>
                       </>
                  ) : (
                    <></>
                  )}

                  {SYSTEM == 'dsp' ? (
                    <></>
                  ) : (
                    <Content className={styles.content}> {children} </Content>
                  )}
                  <BackTop
                    className={styles.backTop}
                    target={() => document.querySelector('#primaryLayout')}
                  />
                </div>
              </Layout>
            )}
          </Fragment>
        </ConfigProvider>
      </div>
    )
  }
}

PrimaryLayout.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default PrimaryLayout
