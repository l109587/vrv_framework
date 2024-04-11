// 网络配置
import React from 'react'
import { Card, Tabs } from 'antd'
import './index.less'
import { Dns, Ipv4, Ipv6, Nicset, Route } from './components'
import { language } from '@/utils/language'
import { ProCard } from '@ant-design/pro-components'
const { TabPane } = Tabs
const NetworkConfiguration = () => {
  return (
    <div className="networkCard">
      <Tabs defaultActiveKey="1" type="card" size="Large">
        <TabPane tab={language('project.sysconf.network.networkset')} key="1">
          <Nicset />
        </TabPane>
        <TabPane tab={language('sysconf.netconf.dnsconf')} key="2">
          <Dns />
        </TabPane>
        <TabPane tab={language('sysconf.network.route.cardTitle')} key="3">
          <Route />
        </TabPane>
        {/* <TabPane tab="IPv4路由表" key="2">
              <Ipv4 />
            </TabPane>
            <TabPane tab="IPv6路由表" key="3">
              <Ipv6 />
            </TabPane>
         */}
      </Tabs>
    </div>
  )
}
export default NetworkConfiguration
