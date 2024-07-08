import { TouchOptions, escape } from '../../../util';
import FileSystemCommand from '../../abstract/fileSystem';

/**
 * Formats to YYYYMMDDHHmm[.]ssSSS
 */
const formatToTimeFlag = (value: Date | string): string => {
    const date = new Date(value);
    const year = date.getUTCFullYear().toString();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');

    return `${year}${month}${day}${hours}${minutes}.${seconds}${milliseconds}`;
};
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
            escape(new Date(value).toISOString())
        ],
        time: (value: Date | string): string[] => [
            '-t',
            escape(formatToTimeFlag(value))
        ],
        reference: (value: string): string[] => ['-r', escape(value)]
    };
}
