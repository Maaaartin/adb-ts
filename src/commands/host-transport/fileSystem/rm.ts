import { Connection } from '../../../connection';
import { RmOptions } from '../../../util';
import FileSystemCommand from '../../abstract/fileSystem';

export default class RmCommand extends FileSystemCommand<RmOptions> {
    constructor(
        connection: Connection,
        serial: string,
        path: string,
        options?: RmOptions
    ) {
        super(
            connection,
            serial,
            'rm',
            path,
            {
                force: '-f',
                recursive: '-rR'
            },
            options
        );
    }
}
