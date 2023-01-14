import { PrematureEOFError } from '../../util';
import LineTransform from '../../linetransform';
import TransportCommand from '../abstract/transport';

export default class ScreencapCommand extends TransportCommand<Buffer> {
    protected postExecute(): Promise<Buffer> {
        return this.parser
            .readBytes(1)
            .then((buffer) => this.transform(buffer));
    }
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

            .catch((err) => {
                if (err instanceof PrematureEOFError) {
                    throw new Error('No support for the screencap command');
                }
                throw err;
            })
            .finally(() => {
                return this.endConnection();
            });
    }
}
