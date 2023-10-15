import { PrematureEOFError } from '../../util';
import LineTransform from '../../linetransform';
import TransportCommand from '../abstract/transport';

export default class ScreencapCommand extends TransportCommand<Buffer> {
    protected keepAlive = false;

    protected Cmd = 'shell:echo && screencap -p 2>/dev/null';

    protected async postExecute(): Promise<Buffer> {
        const buffer = await this.parser.readBytes(1);
        const transform = new LineTransform({
            autoDetect: true
        });
        transform.write(buffer);
        this.connection.pipe(transform);
        return new Promise<Buffer>((resolve, reject) => {
            const acc: Buffer[] = [];
            transform.on('data', (data) => {
                acc.push(Buffer.from(data));
            });
            transform.once('end', () => {
                resolve(Buffer.concat(acc));
            });
            transform.once('error', reject);
        });
    }

    public async execute(): Promise<Buffer> {
        try {
            return await super.execute();
        } catch (err) {
            if (err instanceof PrematureEOFError) {
                throw new Error('No support for the screencap command');
            }
            throw err;
        } finally {
            this.endConnection();
        }
    }
}
