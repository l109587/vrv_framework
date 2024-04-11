import { notification, Modal,message } from 'antd'
import { ExclamationCircleOutlined} from '@ant-design/icons'

export default function notice(level, title, content,duration=null,router) {
  const config = {
    title: title,
    content: content,
    icon:<ExclamationCircleOutlined style={{color:'red'}}/>
  }
  if (level === 'high') {
    Modal.warning(config)
  } else if (level === 'low') {
    notification.warning({ 
      key:'onlyKye',
      message: title,
      description: content,
      onClose: () => {
        console.log('Notification Clicked!')
      },
      placement:'bottomRight',
      duration:duration
    })
  }
}
