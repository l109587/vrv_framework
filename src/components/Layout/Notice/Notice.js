import { useEffect, useState } from 'react'
import { groupBy } from 'lodash'
import moment from 'moment'
import { notification, Modal,message,Tag,Button } from 'antd'
import { ExclamationCircleOutlined,CloseOutlined} from '@ant-design/icons'
import NoticeIcon from './NoticeIcon'
import styles from './index.less'
import { post } from '@/services/https'
import throttle from "lodash/throttle"
import { history,useLocation } from 'umi'

const getNoticeData = (notices) => {
  if (!notices || notices.length === 0 || !Array.isArray(notices)) {
    return []
  }

  const newNotices = notices.map((notice) => {
    const newNotice = { ...notice }

    // if (newNotice.datetime) {
    //   newNotice.datetime = moment(notice.datetime).fromNow()
    // }

    if (newNotice.id) {
      newNotice.key = newNotice.id
    }
    return newNotice
  })
  return newNotices
  // return groupBy(newNotices, 'type')
}

const getUnreadData = (noticeData) => {
  const unreadMsg = {}
  Object.keys(noticeData).forEach((key) => {
    const value = noticeData[key]

    if (!unreadMsg[key]) {
      unreadMsg[key] = 0 
    }

    if (Array.isArray(value)) {
      unreadMsg[key] = value.filter((item) => item.status ==0).length
    }
  })
  return unreadMsg
}

const Notice = () => {
  const [notices,setNotices] = useState([])
  const noticeData = getNoticeData(notices)
  const unreadMsg = getUnreadData(noticeData || {})
  const [total,setTotal] = useState(0)
  const location  = useLocation()
  let timeout = null
  let interval = null

  useEffect(()=>{
    // getNotices()
    fetchPageAlarm()
    return ()=>{
      clearTimeout(timeout)
      clearInterval(interval)
      notification.close('lowNotice')
    }
  },[])

  const changeReadState = (ids,type='') => {
    post('/cfg.php?controller=alaSetting&action=disposeAlarm', { ids: ids })
      .then((res) => {
        if (res.success) {
          if( type !== 'modal'){
            const data = [...notices]
            const newIds = ids.split(',')
            notices.map((item,index)=>{
              newIds.map((i)=>{
                if (item.id ===i) {
                  data[index].read = true
                }
              })
            })
            setNotices(data)
          }else{
            fetchNoticeList()
          }
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const deleteItem = (id) => {
    const newNotices = [ ...notices ] 
    notices.forEach((item,index)=>{
      if(item.id === id){
        newNotices.splice(index,1)
      }
    })
    setNotices(newNotices)
  }

  const clearReadState = (title, key) => {
    const ids = []
    noticeData.map((item)=>{
      ids.push(item.id)
    })
    const newIds = ids.join(',')
    changeReadState(newIds)
  }
  const highNotice = (values)=>{
    const { id,event,detail,datetime } = values
    const config = {
      title: event,
      content: <div><div>{detail}</div><div>{datetime}</div></div>,
      icon:<ExclamationCircleOutlined style={{color:'red'}}/>,
      onOk(){
        changeReadState(id,'modal')
        timeout = setTimeout(() => {
          fetchPageAlarm()
        }, 3000);
      },
      className:styles.warnModal
    }
    Modal.warning(config)
  }

  const lowNotice = (values)=>{
    const { id,event,detail,router,datetime } = values
    let contents = <></>
    if(location.pathname == router){
      contents = ( <div>{detail}</div>)
    }else{
      contents = (<Button type='link' style={{padding:0}} onClick={() => {
        history.push(router)
        notification.close('lowNotice')
      }}>{detail}</Button>)
    }
    notification.warning({ 
      key:'lowNotice',
      message: event,
      description: <div><div>{detail}</div><div>{datetime}</div></div>,
      placement:'bottomRight',
      duration:0,
      closeIcon:<CloseOutlined onClick={()=>{
        changeReadState(id,'modal')
        timeout = setTimeout(() => {
          fetchPageAlarm()
        }, 3000);
      }}/>
    })
  }
  
  //弹窗事件回显
   const fetchPageAlarm = () =>{
    post('/cfg.php?controller=alaSetting&action=showAlarmDialog').then((res)=>{
      if(res.success){
        if(!(JSON.stringify(res.data) == "{}")){
          fetchNoticeList()
          if(res.data.level == 1 ){
            highNotice(res.data)
          }else if(res.data.level == 2){
            lowNotice(res.data)
          }
        }else{
          timeout = setTimeout(() => {
            fetchPageAlarm()
          }, 5000);
        }
        
      }else {
        res.msg&&message.error(res.msg)
      }
    }).catch((error)=>{
      console.log(error)
    })
   }
   //获取告警事件
  const fetchNoticeList = () => {
    // const params = {start:0,limit:10}
    // post('/cfg.php?controller=alaSetting&action=showAlarmUnread',params).then((res)=>{
    //   if(res.success){
    //     setNotices(res.data)
    //     setTotal(res.total||0)
    //   }else{
    //     res.msg&&message.error(res.msg)
    //   }
    // }).catch((error)=>{
    //   console.log(error)
    // })
  }

  //定时调用fetchNoticeList
  const getNotices = ()=>{
    interval = setInterval(() => {
      fetchNoticeList()
    }, 3000);
  }

  return (
    <NoticeIcon
      className={styles.action}
      count={total}
      onItemClick={(item) => {
        changeReadState(item.id)
      }}
      // onDeleteItem={(item) =>{
      //   deleteItem(item.id)
      // }}
      onClear={(title, key) => clearReadState(title, key)}
      loading={false}
      viewMoreText="查看更多"
      clearClose
    >
      <div
        tabKey="notification"
        count={unreadMsg.notification}
        list={noticeData?.filter((item)=> item.status ==0)}
        title="告警事件"
        emptyText="暂无告警事件"
        showViewMore={true}
        showClear={true}
      />
      {/* <NoticeIcon.Tab
        tabKey="message"
        count={0}
        list={noticeData.message?.splice(0,5)}
        title="通知"
        emptyText="暂无消息"
        showViewMore={false}
        showClear={false}
        showExtra={false}
      /> */}
    </NoticeIcon>
  )
}

export default Notice
