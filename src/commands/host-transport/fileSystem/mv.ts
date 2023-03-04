import { Connection } from '../../../connection';
import { MvOptions } from '../../../util';
import FileSystemCommand from '../../abstract/fileSystem';

export default class MvCommand extends FileSystemCommand {
    constructor(
        connection: Connection,
        serial: string,
        path: string | string[],
        options: MvOptions = {}
    ) {
        super(connection, serial, 'mv', path, options);
    }

    protected intentArgs(options: MvOptions): string[] {
        const args: string[] = [];
        if (!options) {
            return args;
        }
        if (options.force) {
            args.push('-f');
        }

        if (options.noClobber) {
            args.push('-n');
        }
        return args;
    }
}
