import resmngt  from './resmngt';
import mconfig from './mconfig';
import monitor from './monitor';
import logmngt from './logmngt';
import analyse from './analyse';
import central from './central';
import nbg from './nbg';
import assmngt from './assmngt';
import cfgmngt from './cfgmngt';
import tacindex from './tacindex';
import illevent from './illevent';
import monconf from './monconf';
import alarmdt from './alarmdt';
import dmcmconfig from './dmcmconfig';
import ntanetaudit from './ntanetaudit';
import prbmgt from './prbmgt';
import netanalyse from './netanalyse';
import common from './common/index';

export default {
    ...resmngt,
    ...mconfig,
    ...monitor,
    ...logmngt,
    ...analyse,
    ...central,
    ...nbg,
    ...assmngt,
    ...cfgmngt,
    ...tacindex,
    ...illevent,
    ...monconf,
    ...alarmdt,
    ...dmcmconfig,
    ...ntanetaudit,
    ...prbmgt,
    ...netanalyse,
    ...common
}