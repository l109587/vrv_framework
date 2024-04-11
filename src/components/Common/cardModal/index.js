import React, { useRef, useState, useEffect } from 'react';
import { language } from '@/utils/language';
import ProCard from '@ant-design/pro-card';
import '@/utils/index.less';
import './index.less';
import { DragBox } from '@/components';
let domWidth = document.body.clientWidth - 230
export default (props) => {

  let proRef = useRef();
  const { cardHeight, leftContent, rightContent, title, type } = props
  const [moveStatus, setMoveStatus] = useState('');
  const [tableWidth, setTableWidth] = useState(238);
  const dragCallback = (e, v) => {
    setTableWidth(v)
  }
  return (
    <>
      <ProCard ref={proRef} ghost gutter={moveStatus == 'front' ? false : false} className='cardModalContain' bodyStyle={{
        paddingLeft: moveStatus == 'front' ? 0 : '0px'
      }} >
        <DragBox dragAble={false} minWidth={238} minHeight={184} edgeDistance={[10, 10, 10, domWidth / 2 + 50 ]} dragCallback={dragCallback} >
          <ProCard className='ztreecard'
            style={
              {
                height: type ? cardHeight : cardHeight,
                width: moveStatus == 'front' ? 0 : `${tableWidth}px`
              }
            }
            colSpan={moveStatus == 'front' ? '0px' : `${tableWidth}px`}
            title={title ? title : false}>
            {leftContent}
            <div className={moveStatus == 'front' ? 'zdislpayArrow zarrowfront' : 'zdislpayArrow zarrowafter'} evt='close' onClick={() => {
              if (!moveStatus || moveStatus == 'after') {
                setMoveStatus('front');
              } else {
                setMoveStatus('after');
              }
            }}><a className={moveStatus == 'front' ? 'pngfix open' : 'pngfix'} href="javascript:void(0);"></a></div>
          </ProCard>
        </DragBox>
        <ProCard className='treecardbuttmomove'
          colSpan={moveStatus == 'front' ? 'calc(100% )' : `calc(100% - ${tableWidth+15}px)`}
          ghost style={{ height: cardHeight, backgroundColor: 'white',
          marginLeft: moveStatus == 'front' ? 0 : '15px' }}>
          {rightContent}
        </ProCard>

      </ProCard>

    </>
  )

}