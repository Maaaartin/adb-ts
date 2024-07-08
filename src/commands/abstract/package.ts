import { Connection } from '../../connection';
import TransportCommand from './transport';

export default abstract class PackageCommand extends TransportCommand<void> {
    protected abstract Cmd: string;
    protected packageOrPath: string;
    protected keepAlive = false;

    constructor(connection: Connection, serial: string, packageOrPath: string) {
        super(connection, serial);
        this.packageOrPath = packageOrPath;
    }

    protected async postExecute(): Promise<void> {
        try {
            const [, result, code] = await this.parser.searchLine(
                /^(Success|Failure \[(.*?)\])$/,
                false
            );
            if (result !== 'Success') {
                this.throwError(code);
            }
        } finally {
            await this.parser.readAll();
        }
    }
    protected abstract throwError(code: string): never;
}
