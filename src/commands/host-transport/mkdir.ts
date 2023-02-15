import { Connection } from '../../connection';
import { MkDirOptions, escape } from '../../util';
import FileSystemCommand from '../abstract/fileSystem';

export default class MkDirCommand extends FileSystemCommand {
    constructor(
        connection: Connection,
        serial: string,
        path: string,
        options: MkDirOptions = {}
    ) {
        super(connection, serial, 'mkdir', path, options);
    }

    protected intentArgs(options: MkDirOptions): string[] {
        const args: string[] = [];
        if (!options) {
            return args;
        }
        if (options.mode !== undefined) {
            args.push('-m', escape(options.mode));
        }
        if (options.parent) {
            args.push('-p');
        }

        return args;
    }
}
