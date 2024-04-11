import React from 'react'
import { message } from 'antd'
import Portdgt from '@/assets/switch/portdgt.png';//网口 上  深绿
import Portdg from '@/assets/switch/portdg.png';// 网口下  深绿
import Portbt from '@/assets/switch/portbt.png';
import Portb from '@/assets/switch/portb.png';
import Portgt from '@/assets/switch/portgt.png';
import Portg from '@/assets/switch/portg.png';
import Portlgt from '@/assets/switch/portlgt.png';
import Portlg from '@/assets/switch/portlg.png';
import Portrt from '@/assets/switch/portrt.png';
import Portr from '@/assets/switch/portr.png';
import Portot from '@/assets/switch/portot.png';
import Porto from '@/assets/switch/porto.png';
import Nactppc from '@/assets/switch/nac_tp_pc.png';//电脑显示器 灰
import Cisco from '@/assets/switch/logo_cisco.png';
import H3c from '@/assets/switch/logo_h3c.png';
import Huawei from '@/assets/switch/logo_huawei.png';
import Ruijie from '@/assets/switch/logo_ruijie.png';
import Unknow from '@/assets/switch/logo_unknow.png';
import Right from '@/assets/topology/switch/right.png';
import Left from '@/assets/topology/switch/left.png';
import nat_off from '@/assets/topology/nat_off.png';
import switch_off from '@/assets/topology/switch_off.png';
import nat_on from '@/assets/topology/nat_on.png';
import Switchon from '@/assets/topology/switch_on.png'
import Switchoff from '@/assets/topology/switch_off.png'
import Routeron from '@/assets/topology/router_on.png'
import Routeroff from '@/assets/topology/router_off.png'
import Naton from '@/assets/topology/nat_on.png'
import Natoff from '@/assets/topology/nat_off.png'
import Routerwarn from '@/assets/topology/router_warn.png'
import Natwarn from '@/assets/topology/nat_warn.png'
import Switchwarn from '@/assets/topology/switch_warn.png'


/**
 * topo 二级右侧图标
 * @param {*} n 
 * @returns 
 */
export const rightIcon = ((n) => {
  switch (n) {
    case ('logo_cisco.png'):
      return Cisco;
    case ('logo_h3c.png'):
      return H3c;
    case ('logo_huawei.png'):
      return Huawei;
    case ('logo_ruijie.png'):
      return Ruijie;
    default:
      return Unknow;
  }
})

/**
 * topo 二级内容图标
 * @param {*} item 
 * @param {*} iconType 
 */
export const paddingTopo = (item, iconType) => {
  let icon;
  if (parseInt(item.link) == 1) {//级联
    icon = (iconType == "up" ? Portbt : Portb);
  } else if (parseInt(item.status) == 0) {//离线
    icon = (iconType == "up" ? Portgt : Portg);
  } else if (parseInt(item.status) == 1) {//空闲
    icon = (iconType == "up" ? Portlgt : Portlg);
  } else if (Number(item.inflowwarn) > 0) {//告警终端
    icon = (iconType == "up" ? Portrt : Portr);
  } else if (item.term_num > 1) {//多终端
    icon = (iconType == "up" ? Portot : Porto);
  } else if (item.term_num == 1) {//单终端
    icon = (iconType == "up" ? Portdgt : Portdg);
  } else {//无终端
    icon = (iconType == "up" ? Portlgt : Portlg);
  }
  return icon;
}

/**
 * topo页图标
 * @param {*} icon 
 * @returns 
 */
export const iconTypeShow = (node) => {
  let index = node.icon.lastIndexOf('/');
  let iconIndex = node.icon.lastIndexOf('.');
  let showIcon = node.icon.slice(index + 1, iconIndex);
  let a = '';
  if (node.devtype == 'switch' && node.online == 1) {
    a = Switchon
  } else if (node.devtype == 'switch' && node.online != 1) {
    a = Switchoff
  } else if (node.devtype == 'router' && node.online == 1) {
    a = Routeron
  } else if (node.devtype == 'router' && node.online != 1) {
    a = Routeroff
  } else if (node.devtype == 'nat' && node.online == 1) {
    a = Naton
  } else if (node.devtype == 'nat' && node.online != 1) {
    a = Natoff
  }

  return a;
}

export const iconChange = (image) => {
  let index = image.lastIndexOf('/');
  let iconIndex = image.lastIndexOf('.');
  let showIcon = image.slice(index + 1, iconIndex);
  let a ;
  switch (showIcon) {
    case 'switch_off':
      a = switch_off;
      break;
    case 'switch_on':
      a = Switchon;
      break;
    case 'nat_off':
      a = Natoff;
      break;
    case 'nat_on':
      a = Naton;
      break;
    case 'router_on':
      a = Routeron;
      break;
    case 'router_off':
      a = Routeroff;
      break;
    case 'router_warn':
      a = Routerwarn;
      break;
    case 'nat_warn':
      a = Natwarn;
      break;
    case 'switch_warn':
      a = Switchwarn;
      break;
    default:
      a = nat_on;
      break;
  }
  return a;
}

export const iconRight = Right;
export const iconLeft = Left;
export const iconNactppc = Nactppc;