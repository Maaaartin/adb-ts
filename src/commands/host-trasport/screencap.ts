import { PrematureEOFError } from '../..';
import LineTransform from '../../linetransform';
import RawCommand from '../raw-command';

export default class ScreencapCommand extends RawCommand {
    execute(serial: string) {
        return super
            .execute(serial, 'shell:echo && screencap -p 2>/dev/null')
            .then(() => {
                return this.parser_
                    .readBytes(1)
                    .then((chunk) => {
                        const transform = new LineTransform({
                            autoDetect: true
                        });
                        transform.write(chunk);
                        this.connection_.pipe(transform);
                        return transform;
                    })
                    .catch((err) => {
                        if (err instanceof PrematureEOFError) {
                            throw new Error(
                                'No support for the screencap command'
                            );
                        } else {
                            throw err;
                        }
                    });
            });
    }
}
