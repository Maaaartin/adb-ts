import { Connection } from '../../connection';
import ExecCommand from './exec';

export default abstract class FileSystemCommand extends ExecCommand<void> {
    protected rawCmd: string;
    protected abstract intentArgs(options?: Record<string, any>): string[];

    constructor(
        connection: Connection,
        serial: string,
        cmd: string,
        path: string | string[],
        options: Record<string, any> = {}
    ) {
        super(connection, serial);
        this.rawCmd = [cmd, ...this.intentArgs(options), ...[path].flat()].join(
            ' '
        );
    }

    protected cast(): void {}
}
