import LineTransform from '../../linetransform';
import RawCommand from '../raw-command';

import { LogcatOptions } from '../..';

export default class LogcatCommand extends RawCommand {
    Cmd = 'shell:echo && ';
    execute(serial: string, options?: LogcatOptions): Promise<LineTransform> {
        let cmd = 'logcat -B *:I 2>/dev/null';
        if (options?.clear) {
            cmd = 'logcat -c 2>/dev/null && ' + cmd;
        }
        this.Cmd += cmd;
        return this.preExecute(serial).then((result) => {
            const transform = new LineTransform({ autoDetect: true });
            result.pipe(transform);
            return transform;
        });
    }
}
