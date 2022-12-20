import { PrematureEOFError } from '../..';
import LineTransform from '../../linetransform';
import RawCommand from '../raw-command';

export default class ScreencapCommand extends RawCommand {
    Cmd = 'shell:echo && screencap -p 2>/dev/null';

    private transform(buffer: Buffer): Promise<Buffer> {
        const transform = new LineTransform({
            autoDetect: true
        });
        transform.write(buffer);
        this.connection.pipe(transform);
        return new Promise<Buffer>((resolve, reject) => {
            const acc: Buffer[] = [];
            transform.on('data', (data) => {
                acc.push(data);
            });
            transform.once('end', () => {
                resolve(Buffer.concat(acc));
            });
            transform.once('error', reject);
        });
    }
    execute(serial: string): Promise<Buffer> {
        return this.preExecute(serial)
            .then(() => {
                return this.parser
                    .readBytes(1)
                    .then((buffer) => this.transform(buffer));
            })
            .catch((err) => {
                if (err instanceof PrematureEOFError) {
                    throw new Error('No support for the screencap command');
                }
                throw err;
            })
            .finally(() => {
                return this.connection.end();
            });
    }
}
