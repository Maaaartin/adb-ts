import { RmOptions } from 'fs';
import { Connection } from '../../../connection';
import FileSystemCommand from '../../abstract/fileSystem';

export default class RmCommand extends FileSystemCommand {
    constructor(
        connection: Connection,
        serial: string,
        path: string,
        options?: RmOptions
    ) {
        super(connection, serial, 'rm', path, options);
    }

    protected intentArgs(options: RmOptions): string[] {
        const args: string[] = [];
        if (!options) {
            return args;
        }
        if (options.force) {
            args.push('-f');
        }

        if (options.recursive) {
            args.push('-rR');
        }

        return args;
    }
}
