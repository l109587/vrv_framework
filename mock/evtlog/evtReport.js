import { mockMethod } from '../../src/utils/common'
import Mock from 'mockjs'

const cfgData = Mock.mock({
  success: true,
  total: 20,
  'data|20': [
    {
      id: '@id',
      status: '@pick(["Y", "N"])',
      name: '@cname',
      addr: '@ip',
      proto: 'SYSLOG',
      'port|1-100': 100,
      type: 'evt',
      content: 'sysevt,assetsevt,resvet',
    },
  ],
})
const protocolData = {
  success: true,
  data: [
    { text: 'SYSLOG', value: 'SYSLOG' },
    { text: 'RESTFul', value: 'RESTFul' },
    { text: 'REAE', value: 'REAE' },
  ],
}
const eventData = {
  success: true,
  data: [
    { text: '系统事件', value: 'sysevt' },
    { text: '资产事件', value: 'assetsevt' },
    { text: '资源事件', value: 'resvet' },
  ],
}
export default function confAuthority(getParam, postParam, res) {
  if (getParam.action == 'showReportConf') {
    mockMethod('show', cfgData, postParam, res)
  }
  if (getParam.action == 'setReportConf') {
    mockMethod(postParam.op, cfgData, postParam, res)
  }
  if (getParam.action == 'delReportConf') {
    mockMethod('del', cfgData, postParam, res)
  }
  if (getParam.action == 'setReportStatus') {
    const index = cfgData?.data?.findIndex(item=>item.id==postParam.id)
    cfgData.data[index].status = postParam.enable
    res.json({ success: true, msg: "操作成功" });
  }
  if (getParam.action == 'getProtocolList') {
    res.json(protocolData)
  }
  if (getParam.action == 'getEventList') {
    res.json(eventData)
  }
}