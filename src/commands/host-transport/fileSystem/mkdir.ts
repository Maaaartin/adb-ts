import { Connection } from '../../../connection';
import { MkDirOptions, escape } from '../../../util';
import FileSystemCommand from '../../abstract/fileSystem';

// TODO check force option
export default class MkDirCommand extends FileSystemCommand<MkDirOptions> {
    constructor(
        connection: Connection,
        serial: string,
        path: string,
        options: MkDirOptions = {}
    ) {
        super(
            connection,
            serial,
            'mkdir',
            path,
            {
                mode: (mode: string | number): string[] => ['-m', escape(mode)],
                parent: '-p',
                force: '-f'
            },
            options
        );
    }
}
