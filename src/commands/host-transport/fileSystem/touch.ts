import moment from 'moment';
import { TouchOptions, escape } from '../../../util';
import FileSystemCommand from '../../abstract/fileSystem';

export default class TouchCommand extends FileSystemCommand<
    TouchOptions,
    string
> {
    protected rootCmd = 'touch';
    protected argsMapper = {
        aTime: '-a',
        mTime: '-m',
        noCreate: '-c',
        symlink: '-h',
        date: (value: Date | string): string[] => [
            '-d',
            escape(moment(value).toISOString())
        ],
        time: (value: Date | string): string[] => [
            '-t',
            escape(moment(value).format('YYYYMMDDHHmm[.]ssSSS'))
        ],
        reference: (value: string): string[] => ['-r', escape(value)]
    };
}
