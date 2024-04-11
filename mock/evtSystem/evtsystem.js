import Mock from 'mockjs'
export default function evtsystem(getParam, postParam, res) {
  let json = ''
  if (getParam.action == 'showEvtSystemList') {
    json = require('../json/evtlog/showEvtSystemList.json')
  } else if (getParam.action == 'showEvtSystemChart') {
    json = require('../json/evtlog/showEvtSystemChart.json')
  }
  res.send(json)
}
