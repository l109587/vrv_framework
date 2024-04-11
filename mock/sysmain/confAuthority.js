export default function confAuthority(getParam, postParam, res) {
  let json = ''
  if (getParam.action == 'showAuthority') {
    json = require('../json/sysconf/showAuthority.json')
  }
  if (getParam.action == 'getAuthority') {
    json = {
      success: true,
      data: [
        {
          id: '2',
          name: '区域二级',
        },
        {
          id: '3',
          name: '运维三级',
        },
      ],
      self: {
        id: '1',
        name: '区域一级',
      },
    }
  } else if (getParam.action == 'showAuthorityContent') {
    json = require('../json/sysconf/showAuthorityContent.json')
  }
  res.send(json)
}
