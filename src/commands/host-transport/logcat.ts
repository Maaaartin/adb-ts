import LineTransform from '../../linetransform';
import RawCommand from '../raw-command';
import Promise from 'bluebird';
import { LogcatOptions } from '../..';

export default class LogcatCommand extends RawCommand {
  execute(serial: string, options?: LogcatOptions): Promise<LineTransform> {
    let cmd = 'logcat -B *:I 2>/dev/null';
    if (options?.clear) {
      cmd = 'logcat -c 2>/dev/null && ' + cmd;
    }
    return super.execute(serial, `shell:echo && ${cmd}`).then((result) => {
      const transform = new LineTransform({ autoDetect: true });
      result.pipe(transform);
      return transform;
    });
  }
}
