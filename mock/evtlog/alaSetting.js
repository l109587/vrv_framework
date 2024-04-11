import { mockMethod } from '../../src/utils/common'
import Mock, { mock } from 'mockjs'

const cfgData = Mock.mock({
  success: true,
  total: 20,
  'data|20': [
    {
      id: '@id',
      status: '@pick(["Y", "N"])',
      event: '@pick(["login", "restart","find","identify"])',
      class: '@pick(["sysevent", "assetsevent"])',
      'level|1-4': 4,
      wpage: '@pick(["Y", "N"])',
      email: '@pick(["Y", "N"])',
      phone: '@pick(["Y", "N"])',
    },
  ],
})
const eventData = Mock.mock({
  success: true,
  total: 10,
  'data|10': [
    {
      id: '@id',
      // 'status|0-1': 1,
      status: 0,
      // datetime: '@datetime',
      // datetime: '@now(yyyy-MM-dd) @increment(-1):00:00',
      'now|+1': '@now("yyyy-MM-dd")',
      'fromNowOn|+1': 1,
      datetime: function () {
        let now = new Date(this.now)
        now.setTime(now.getTime() - this.fromNowOn * 24 * 60 * 60 * 1000)
        let sub = now
        var year =
          sub.getFullYear() < 10 ? '0' + sub.getFullYear() : sub.getFullYear()
        var month =
          sub.getMonth() + 1 < 10 ? '0' + sub.getMonth() : sub.getMonth()
        var day = sub.getDate() < 10 ? '0' + sub.getDate() : sub.getDate()
        return year + '-' + month + '-' + day
      },
      event: '@pick(["资产发现", "资产识别","资产变更"])',
      class: '@pick(["资产事件"])',
      'level|1-4': 4,
      detail: '告警事件内容，脚本攻击',
    },
  ],
})
const eventList = {
  success: true,
  data: [
    {
      text: '系统事件',
      value: 1,
      child: [
        { text: '管理员登录', value: 'login' },
        { text: '系统重启', value: 'restart' },
      ],
    },
    {
      text: '资产事件',
      value: 2,
      child: [
        { text: '资产发现', value: 'find' },
        { text: '资产识别', value: 'identify' },
      ],
    },
  ],
}
const levelList = {
  success: true,
  data: [
    { text: '紧急', value: 1, color: 'red' },
    { text: '重要', value: 2, color: 'orange' },
    { text: '次要', value: 3, color: 'yellow' },
    { text: '提示', value: 4, color: 'blue' },
  ],
}

//邮件告警配置回显数据
const emailConf = {
  success: true,
  data: [
    {
      name: 'global',
      mailsvr: '12.2.2.2',
      mailssl: 'Y',
      mailsnd: 'send@vrv.com',
      mailpwd: '123123',
      receive: 'ser1@vrv.com;ser2@vrv.com',
    },
  ],
}

//短信网关类型列表
const smsgwtTypeList = {
  success: true,
  data: [
    { text: '一', value: 'yi', display: ['smshost'] },
    { text: '两', value: 'er', display: ['smshost', 'smscode'] },
    { text: '三', value: 'san', display: ['smshost', 'smscode', 'smspawd'] },
    {
      text: '四',
      value: 'si',
      display: ['smshost', 'smscode', 'smspawd', 'smssign'],
    },
    {
      text: '五',
      value: 'wu',
      display: ['smshost', 'smscode', 'smspawd', 'smssign', 'smstmpl'],
    },
  ],
}
//短信网关配置
const SMSGWConfData = Mock.mock({
  success: true,
  data: {
    smstype: 'default',
    smshost: 'https://12.2.2.2',
    method: '@pick(["purl","gurl","json"])',
    content: 'content',
    sign: '@pick(["Y","N"])',
    signtext: 'signtext',
    receive: 'receive',
    arglist: [
      { name: ' 参数1', argkey: 'arg1', argval: 'argval1' },
      { name: ' 参数2', argkey: 'arg2', argval: 'argval2' },
    ],
  },
})
//短息告警配置回显数据
const phonecfgData = {
  success: true,
  data: [{ name: 'global', receive: '12229304944;12229304945;12229304964' }],
}

//弹窗事件回显数据

export default function (getParam, postParam, res) {
  if (getParam.action == 'showAlarmConf') {
    mockMethod('show', cfgData, postParam, res)
  }
  if (getParam.action == 'setAlarmConf') {
    mockMethod(postParam.op, cfgData, postParam, res)
  }
  if (getParam.action == 'delAlarmConf') {
    mockMethod('del', cfgData, postParam, res)
  }
  if (getParam.action == 'setAlarmStatus') {
    const index = cfgData?.data?.findIndex((item) => item.id == postParam.id)
    cfgData.data[index].status = postParam.enable
    res.json({ success: true, msg: '操作成功' })
  }
  if (getParam.action == 'getEventList') {
    res.json(eventList)
  }
  if (getParam.action == 'getLevelList') {
    res.json(levelList)
  }
  if (getParam.action == 'showAlarmEvent') {
    mockMethod('show', eventData, postParam, res)
  }
  if (getParam.action == 'deleteAlarm') {
    mockMethod('del', eventData, postParam, res)
  }
  if (getParam.action == 'showPageAlarm') {
    const pageData = Mock.mock({
      success: true,
      status: '@pick(["Y"])',
      data: {
        id: '@id',
        status: 0,
        datetime: '@now()',
        event: '@pick(["资产发现", "资产识别","资产变更"])',
        class: '@pick(["资产事件"])',
        'level|0-4': 4,
        detail: '告警事件内容，脚本攻击',
      },
    })
    res.json(pageData)
    if (pageData.status === 'Y') {
      // eventData.data.push(pageData.data)
      eventData.data = [pageData.data, ...eventData.data]
      eventData.total++
    }
  }
  if (getParam.action == 'disposeAlarm') {
    const ids = postParam.ids.split(',')
    ids.map((value) => {
      const index = eventData.data.findIndex((item) => item.id == value)
      if (index >= 0) {
        eventData.data[index].status = 1
      }
    })
    res.json({ success: true, msg: '操作成功' })
  }
  if (getParam.action == 'showEmailConf') {
    res.json(emailConf)
  }
  if (getParam.action == 'sendMailTest') {
    res.json({ success: true, msg: '操作成功' })
  }
  if (getParam.action == 'showSMSGWTypeList') {
    res.json(smsgwtTypeList)
  }
  if (getParam.action == 'showPhoneConf') {
    res.json(phonecfgData)
  }
  if (getParam.action == 'showSMSGWConf') {
    res.json(SMSGWConfData)
  }
  if (getParam.action == 'sendSMSGTest') {
    res.json({ success: true, msg: '操作成功' })
  }
  if (getParam.action == 'showAlarmUnread') {
    res.json(eventData)
  }
  if (getParam.action == 'showAlarmDialog') {
    const AlarmDialog = Mock.mock({
      success: true,
      // data: {
      //   id: '@id',
      //   datetime: '2023-07-11 12:00:00',
      //   event: '资产变更',
      //   class: '资产事件',
      //   'level|1-2': 2,
      //   status: 0,
      //   detail: '',
      // },
      data:{}
    })
    res.json(AlarmDialog)
    if (AlarmDialog.total > 0) {
      eventData.data = [AlarmDialog.data, ...eventData.data]
      eventData.total++
    }
  }
}
