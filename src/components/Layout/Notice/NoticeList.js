import { Avatar, List, Tag, Typography, Space } from 'antd'

import React from 'react'
import classNames from 'classnames'
import styles from './NoticeList.less'
import { WarningOutlined } from '@ant-design/icons'

const NoticeList = ({
  list = [],
  onClick,
  onClear,
  title,
  onViewMore,
  deleteItem,
  emptyText,
  showClear = true,
  viewMoreText,
  showViewMore = false,
  showExtra = true,
  showAvatar = true,
}) => {
  if (!list || list.length === 0) {
    return (
      <div className={styles.notFound}>
        <div>{emptyText}</div>
      </div>
    )
  }
  const levelMap = {
    1: '紧急',
    2: '重要',
    3: '次要',
    4: '提示',
  }
  const levelTag = (level,datetime) => {
    let color = ''
    switch (level) {
      case 1:
        color = '#BD3124'
        break
      case 2:
        color = '#FA561F'
        break
      case 3:
        color = '#FFBF6B'
        break
      case 4:
        color = '#93D2F3'
        break
      default:
        break
    }
    return (
      <>
        <Space>
          <Tag color={color} style={{marginRight: 0,height:20,lineHeight:'18px'}}>{levelMap[level]}</Tag>
          <span className={styles.datetime}>{datetime}</span>
        </Space>
      </>
    )
    
  }
  return (
    <div>
      <List
        className={styles.list}
        dataSource={list}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item)
          // eslint-disable-next-line no-nested-ternary
          const leftIcon = (level)=> {
            let color = '#BD3124'
            switch (level) {
              case 1:
                color = '#BD3124'
                break
              case 2:
                color = '#FA561F'
                break
              case 3:
                color = '#FFBF6B'
                break
              case 4:
                color = '#93D2F3'
                break
              default:
                break
            }
            return  showAvatar && <Avatar className={styles.avatar} style={{backgroundColor:color}} icon={<WarningOutlined />} />
            
          }
          return (
            <List.Item
              className={itemCls}
              key={item.key || i}
              onClick={() => {
                onClick?.(item)
              }}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon(item.level)}
                title={
                  <div>
                    <div className={styles.title}>
                    <Space>
                      <span>{item.event}</span>
                    </Space>
                    {showExtra ? (
                      <div className={styles.extra}>
                        {item.read ? (
                          <div>
                            <Tag
                              color="green"
                              style={{
                                marginRight: 0,
                                height:20,
                                lineHeight:'18px'
                              }}
                            >
                              已读
                            </Tag>
                          </div>
                        ) : (
                          <Tag
                            color="gold"
                            style={{
                              marginRight: 0,
                              height:20,
                              lineHeight:'18px'
                            }}
                          >
                            未读
                          </Tag>
                        )}
                      </div>
                    ) : null}
                    
                  </div>
                    {levelTag(item.level,item.datetime)}
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description}>{item.detail}</div>
                    
                  </div>
                }
              />
            </List.Item>
          )
        }}
      />
      <div className={styles.bottomBar}>
        {showClear ? <div onClick={onClear}>全部已读</div> : null}
        {showViewMore ? (
          <div
            onClick={(e) => {
              if (onViewMore) {
                onViewMore(e)
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default NoticeList
