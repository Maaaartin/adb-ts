import { TouchOptions, escape } from '../../../util';
import FileSystemCommand from '../../abstract/fileSystem';

/**
 * Formats to YYYYMMDDHHmm[.]ssSSS
 */
const formatToTimeFlag = (value: Date | string): string => {
    const date = new Date(value);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

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
