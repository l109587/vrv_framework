import adminacc from './adminacc';
import temporary from './temporary';
import sysconf from './sysconf';
import regexp from './regexp';
import sysdebug from './sysdebug';
import sysmain from './sysmain';
import evtlog from './evtlog';
import assembly from './assembly';

export default {
    ...adminacc,
    ...temporary,
    ...sysconf,
    ...regexp,
    ...sysdebug,
    ...sysmain,
    ...evtlog,
    ...assembly,
}