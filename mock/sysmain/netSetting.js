export default function netSetting(getParam, postParam, res) {
    let json = ''
    if(getParam.action == 'showInterface') {
        json = require('../json/sysmain/network.json')
    } else if(getParam.action == 'getIFTypeList') {
        json = require('../json/sysmain/typeList.json')
    }
    else if(getParam.action == 'clearIFeth') {
        json = require('../json/sysconf/clearIFeth.json')
    }
    else if(getParam.action == 'showRoute') {
        json = require('../json/sysconf/showRoute.json')
    }
    res.send(json)
  }
  