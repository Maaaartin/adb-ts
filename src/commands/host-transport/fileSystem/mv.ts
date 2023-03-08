import { Connection } from '../../../connection';
import { MvOptions } from '../../../util';
import FileSystemCommand from '../../abstract/fileSystem';

export default class MvCommand extends FileSystemCommand<MvOptions> {
    constructor(
        connection: Connection,
        serial: string,
        path: string | string[],
        options: MvOptions = {}
    ) {
        super(
            connection,
            serial,
            'mv',
            path,
            {
                force: '-f',
                noClobber: '-n'
            },
            options
        );
    }
}
