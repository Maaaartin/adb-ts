import { Readable } from 'stream';
import TransportCommand from '../transport';

export default class IsInstalledCommand extends TransportCommand<boolean> {
    Cmd = '';
    protected postExecute(): Promise<boolean> {
        return this.parser.readAscii(8).then(
            (reply) => {
                if (reply === 'package:') {
                    return true;
                }
                throw this.parser.unexpected(reply, 'package:');
            },
            () => false
        );
    }
    execute(serial: string, pkg: string | Readable): Promise<boolean> {
        this.Cmd = `shell:pm path ${pkg} 2>/dev/null`;
        return this.preExecute(serial);
    }
}
