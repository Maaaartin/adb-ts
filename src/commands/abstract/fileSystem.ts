import { Connection } from '../../connection';
import ExecCommand from './exec';

export default abstract class FileSystemCommand extends ExecCommand<void> {
    private path: string[];
    private options: Record<string, any> | undefined;
    private internalCmd: string;
    protected abstract intentArgs(options?: Record<string, any>): string[];

    constructor(
        connection: Connection,
        serial: string,
        cmd: string,
        path: string[],
        options?: Record<string, any>
    ) {
        super(connection, serial);
        this.options = options;
        this.internalCmd = cmd;
        this.path = path;
    }

    protected get rawCmd(): string {
        return [
            this.internalCmd,
            ...this.intentArgs(this.options),
            ...[this.path].flat()
        ].join(' ');
    }

    cast(): void {}
}
