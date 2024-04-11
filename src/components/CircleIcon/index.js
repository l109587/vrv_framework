import React from 'react'
import './CircleIcon.less'

export default (props) => {
  const { style, name } = props;
  return (
    <div className='circularbox' style={style ? style : {}}>
      {name}
    </div>
  )
}