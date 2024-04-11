import React, { useRef, useState, useEffect } from 'react';
import { Tree, Steps, Transfer, Row, Col, Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import ProForm, { ModalForm, ProFormRadio } from '@ant-design/pro-form';
import { post } from '@/services/https';
import { defaultModalFormLayout } from "@/utils/helper";
import { language } from '@/utils/language'
import '@/utils/index.less';
import './index.less';
let H = document.body.clientHeight - 296
export default (props) => {

  const { fetchMenuList,getMenuList, menuList=[], occupyList, treePopoverOpen,shortcutMenu=[]} = props;
  useEffect(()=>{
    if(!treePopoverOpen){
      setModalStatus(false)
      setTargetKeys(targetKeys.filter(v => !targetNowKeys.some((item)=> item === v)));
      setTargetNowKeys([]);
    }
  }, [treePopoverOpen])

  let rightKeys = [];
  shortcutMenu.map((item)=>{
    rightKeys.push(item.route)
  })
  menuList.map((item) => {
    item.key = item.route;
    if (item.children) {
      if (item.children.length > 0) {
        item.children.map((val) => {
          val.key = val.route;
        })
      }
    }
  })


  //穿梭框开始
  const formRef = useRef();
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const [nowSize, setNowSize] = useState(1);

  const [targetKeys, setTargetKeys] = useState(rightKeys);
  const [targetNowKeys, setTargetNowKeys] = useState([])
  //判断是否弹出添加model
  const getModal = (status) => {
    if (status) {
      setModalStatus(true);
    } else {
      setNowSize(1)
      setModalStatus(false);
      setTargetKeys(targetKeys.filter(v => !targetNowKeys.some((item)=> item === v)));
      setTargetNowKeys([]);
      formRef.current.resetFields();
    }
  }

  const sizeArr = [
    { label: language('assembly.onegird'), value: 1 },
    { label: language('assembly.twogird'), value: 2 },
  ]

  const colorArr = [
    { label: <div className='radiocolor radiocolorbule'></div>, value: '#298FCC' },
    { label: <div className='radiocolor radiocolorred'></div>, value: '#DE3C00' },
    { label: <div className='radiocolor radiocolorgreen'></div>, value: '#1DA652' },
  ]

  const directionArr = [
    { label: language('assembly.transverse'), value: 'transverse' },
    { label: language('assembly.vertical'), value: 'vertical' },
  ]

  /**
   * 
   * @param {*所有数据key} keys 
   * @param {*左右} option 
   * @param {*当前选中key} nowKeys 
   */
  const changeTransfer = (keys, option, nowKeys) => {
    if (option == 'left') {
      // setTargetKeys(keys);
      moveLeft(nowKeys, keys)
    } else {
      getModal(true)
      //选中到右侧的数据的key
      setTargetKeys(keys);
      setTargetNowKeys(nowKeys);
    }
  };

  //穿梭框移除操作
  const moveLeft = (nowKeys, keys) => {
    let data = {}
    data.menus = nowKeys.join(',');
    post('/cfg.php?controller=menu&action=delShortcutMenu', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      } else {
        setTargetKeys(keys)
        getMenuList();
        fetchMenuList()
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  const deepCopy = (obj)=>{
    if(typeof obj !== 'object' || obj === null){
      return obj;
    }
    let copy = Array.isArray(obj) ? [] : {};
    for(let key in obj){
      if(Object.prototype.hasOwnProperty.call(obj,key)){
        copy[key] = deepCopy(obj[key])
      }
    }
    return copy;
  }

  //穿梭框添加操作
  const moveRight = (values) => {
    let data = { ...values };
    data.menus = targetNowKeys.join(',');
    let status = false;
    let arr = deepCopy(occupyList);
    targetNowKeys.map((item) => {
      if (values.size == 1) {
        let nowKey = false;
        for (let key = 0; key < arr.length; key++) {
          if (arr[key].type == 2) {
            nowKey = key;
            break;
          }
        }
        if (nowKey !== false) {
          arr[nowKey].type = 1;
          arr[nowKey].list = {};
          arr[nowKey].occupy = item;
          status = true;
        } else {
          status = false;
        }
      } else {
        let nowKey = false;
        for (let key = 0; key < arr.length; key++) {
          if (values.direction == 'transverse') {
            if ((key != 2 && key != 5 && key != 8) && (arr[key].type == 2 && arr[key + 1].type == 2)) {
              nowKey = key;
              break;
            }
          } else {
            if ((key != 6 && key != 7 && key != 8) && (arr[key].type == 2 && arr[key + 3].type == 2)) {
              nowKey = key;
              break;
            }
          }
        }

        if (nowKey !== false) {
          if (values.direction == 'transverse') {
            arr[nowKey].type = 1;
            arr[nowKey].list = {};
            arr[nowKey].occupy = item
            arr[nowKey + 1].type = 1;
            arr[nowKey + 1].list = {};
            arr[nowKey + 1].occupy = item;
          } else {
            arr[nowKey].type = 1;
            arr[nowKey].list = {};
            arr[nowKey].occupy = item;
            arr[nowKey + 3].type = 1;
            arr[nowKey + 3].list = {};
            arr[nowKey + 3].occupy = item;
          }
          status = true;
        } else {
          status = false;
        }
      }
    })
    if (!status) {
      message.error(language('assembly.operationalerror'));
      return false;
    }
    post('/cfg.php?controller=menu&action=setShortcutMenu', data).then((res) => {
      if (!res.success) {
        setTargetKeys(targetKeys.filter(v => !targetNowKeys.some((item)=> item === v)));
        message.error(res.msg);
        return false;
      } else {
        getModal(false);
        setTargetKeys(targetKeys.concat(targetNowKeys));
        getMenuList();
        fetchMenuList();
      }
    }).catch(() => {
      setTargetKeys(targetKeys.filter(v => !targetNowKeys.some((item)=> item === v)));
      console.log('mistake')
    })
  }

  //数据查找
  const isChecked = (selectedKeys, eventKey) => selectedKeys.includes(eventKey);

  const generateTree = (treeNodes = [], checkedKeys = []) =>
    treeNodes.map(({ children, ...props }) => ({
      ...props,
      disabled: checkedKeys.includes(props.key),
      children: generateTree(children, checkedKeys),
    }));
  const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
    const transferDataSource = [];
    function flatten(list = []) {
      list.forEach((item) => {
        transferDataSource.push(item);
        flatten(item.children);
      });
    }
    flatten(dataSource);
    return (
      <Transfer
        {...restProps}
        targetKeys={targetKeys}
        dataSource={transferDataSource}
        selectAllLabels={[
          ({ selectedCount, totalCount }) => (
            <span>
              <span>{language('assembly.meun')}</span>
              {selectedCount + targetNowKeys.length}
              /
              {totalCount + targetNowKeys.length}
              <span>{language('assembly.term')}</span>
            </span>
          ),
          ({ selectedCount, totalCount }) => (
            <span>
              <span>{language('assembly.set')}</span>
              {totalCount - targetNowKeys.length}
              <span>{language('assembly.term')}</span>
            </span>
          )
        ]}
        className="tree-transfer"
        render={(item) => item.title}
        showSelectAll={false}
      >
        {({ direction, onItemSelect, selectedKeys, filteredItems,  }) => {
          if (direction === 'left') {
            const checkedKeys = [...selectedKeys, ...targetKeys];
            return (
              <div
              >
                <Tree
                  blockNode
                  checkable
                  defaultExpandAll
                  selectable={false}
                  checkedKeys={checkedKeys}
                  treeData={generateTree(dataSource, targetKeys)}
                  onCheck={(_, { node: { key } }) => {
                    onItemSelect(key, !isChecked(checkedKeys, key));
                  }}
                />
              </div>
            );
          }
        }}
      </Transfer>
    );
  };
  return (<>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
      <div>
        {language('assembly.custom')}
      </div>
      {/* <div style={{ color: 'rgba(154,154,154,1)' }} onClick={() => {
        props.handleOpenChange(false, true)
      }}>
        <CloseOutlined />
      </div> */}
    </div>
    <div className='shuttleframebox'>
      <TreeTransfer dataSource={menuList} targetKeys={targetKeys} onChange={changeTransfer} />
      <div className={modalStatus ? 'shuttleconfig shuttleconfigOpen' : 'shuttleconfig shuttleconfigClose'}>
        <div className='shuttleconfigheader'>
          <div className='headertitle'>{language('assembly.setup')}</div>
          <div onClick={() => {
            getModal(false)
          }}><CloseOutlined /></div>
        </div>
        <ProForm {...defaultModalFormLayout}
          className='shuttleconfigfrom'
          formRef={formRef}
          title={language('assembly.setup')}
          autoFocusFirstInput
          submitter={{
            render: () => {
              return [
                <div className='shuttleconfigfooter'>
                  <Row>
                    <Col>
                      <Button
                        onClick={() => {
                          getModal(false)
                        }}
                      >
                        {language('assembly.cancel')}
                      </Button>
                    </Col>
                    <Col  >
                      <Button
                        type="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          formRef.current.submit()
                        }}
                      >
                        {language('assembly.confirm')}
                      </Button>
                    </Col>
                  </Row>
                </div>
              ]
            },
          }}
          modalProps={{
            maskClosable: false,
          }} submitTimeout={2000} onFinish={async (values) => {
            moveRight(values);
          }}>
          <div className='radiobutton'>
            <ProFormRadio.Group
              options={sizeArr}
              label={language('assembly.eachsquare')}
              name="size"
              radioType='button'
              initialValue={1}
              fieldProps={{
                buttonStyle: 'solid',
                defaultValue: 'single',
              }}
              onChange={(e) => {
                console.log(e)
                setNowSize(e.target.value)
              }}
            />
          </div>
          <ProFormRadio.Group
            options={colorArr}
            label={language('assembly.displaycolor')}
            name="color"
            initialValue={'#298FCC'}
            fieldProps={{
              buttonStyle: 'solid',
              defaultValue: 'single',
            }}
          />
          <ProFormRadio.Group
            options={directionArr}
            label={language('assembly.direction')}
            disabled={nowSize == 2 ? false : true}
            initialValue={'transverse'}
            name="direction"
            fieldProps={{
              buttonStyle: 'solid',
              defaultValue: 'single',
            }}
          />
        </ProForm>
      </div>
    </div>

  </>);
};