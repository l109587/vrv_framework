import { BellOutlined } from '@ant-design/icons'
import { Badge, Spin, Tabs, Dropdown } from 'antd'
import useMergedState from 'rc-util/es/hooks/useMergedState'
import { history } from 'umi'
import React from 'react'
import classNames from 'classnames'
import NoticeList from './NoticeList'
import styles from './index.less'

const { TabPane } = Tabs;

export default function NoticeIcon(props) {
  const getNotificationBox = () => {
    const {
      children,
      loading,
      onClear,
      onTabChange,
      onItemClick,
      onDeleteItem,
      viewMoreText,
    } = props
    if (!children) {
      return null
    }
    const panes = []
    React.Children.forEach(children, (child) => {
      if (!child) {
        return
      }
      const { list, title, count, tabKey, showClear, showViewMore,emptyText,showExtra } =
        child.props
      const len = list && list.length ? list.length : 0
      const msgCount = count || count === 0 ? count : len
      const tabTitle = msgCount > 0 ? `${title} （最新${msgCount}条）` : title
      panes.push(
        <TabPane tab={tabTitle} key={tabKey}>
          <NoticeList
            viewMoreText={viewMoreText}
            list={list}
            tabKey={tabKey}
            onClear={() => onClear && onClear(title, tabKey)}
            onClick={(item) => onItemClick && onItemClick(item, child.props)}
            onViewMore={onViewMore}
            deleteItem={(item) => onDeleteItem && onDeleteItem(item,child.props)}
            showClear={showClear}
            showViewMore={showViewMore}
            showExtra={showExtra}
            title={title}
            emptyText={emptyText}
          />
        </TabPane>
      )
    })
    return (
      <>
        <Spin spinning={loading} delay={300}>
          <Tabs className={styles.tabs} onChange={onTabChange}>
            {panes}
          </Tabs>
        </Spin>
      </>
    )
  }
  const { className, count, bell } = props;

  //查看更多
  const  onViewMore = ()=>{
    setVisible(false)
    history.push('/evtlog/alarmevt')
  }

  const [visible, setVisible] = useMergedState(false, {
    value: props.popupVisible,
    onChange: props.onPopupVisibleChange,
  });
  const noticeButtonClass = classNames(className, styles.noticeButton);
  const notificationBox = getNotificationBox();
  const NoticeBellIcon = bell || <BellOutlined className={styles.icon} />;
  const trigger = (
    <span className={classNames(noticeButtonClass, { opened: visible })}>
      <Badge count={count} style={{ boxShadow: 'none' }} className={styles.badge}>
        {NoticeBellIcon}
      </Badge>
    </span>
  );
  if (!notificationBox) {
    return trigger;
  }
  return (
    <Dropdown
      placement="bottomRight"
      overlay={notificationBox}
      overlayClassName={styles.popover}
      trigger={['click']}
      visible={visible}
      onVisibleChange={setVisible}
    >
      {trigger}
    </Dropdown>
  )
}
