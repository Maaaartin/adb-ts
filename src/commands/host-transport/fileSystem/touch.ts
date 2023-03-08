import moment from 'moment';
import { Connection } from '../../../connection';
import { TouchOptions, escape } from '../../../util';
import FileSystemCommand from '../../abstract/fileSystem';

// TODO check if sorting flags for time works
export default class TouchCommand extends FileSystemCommand<TouchOptions> {
    constructor(
        connection: Connection,
        serial: string,
        path: string,
        options?: TouchOptions
    ) {
        super(
            connection,
            serial,
            'touch',
            path,
            {
                aTime: '-a',
                mTime: '-m',
                noCreate: '-c',
                symlink: '-h',
                date: (value) => ['-d', escape(moment(value).toISOString())],
                time: (value) => [
                    '-t',
                    escape(moment(value).format('YYYYMMDDHHmm[.]ssSSS'))
                ],
                reference: (value) => ['-r', escape(value)]
            },
            options
        );
    }
}
