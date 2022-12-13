import moment from 'moment';
import { TouchOptions } from '../..';
import FileSystemCommand from '../filesystem';

export default class TouchCommand extends FileSystemCommand {
    Cmd = 'touch';
    intentArgs(options?: TouchOptions): string[] {
        const args: string[] = [];
        if (!options) {
            return args;
        }
        if (options.aTime) {
            args.push('-a');
        }
        if (options.mTime) {
            args.push('-m');
        }
        if (options.noCreate) {
            args.push('-c');
        }
        if (options.symlink) {
            args.push('-h');
        }
        if (options.date) {
            args.push('-d', this.escape(moment(options.date).toISOString()));
        }
        if (options.time) {
            args.push(
                '-t',
                this.escape(moment(options.time).format('YYYYMMDDHHmm[.]ssSSS'))
            );
        }
        if (options.reference) {
            args.push('-r', this.escape(options.reference));
        }
        return args;
    }

    execute(
        serial: string,
        path: string,
        options?: TouchOptions
    ): Promise<void> {
        return super.execute(serial, path, options).then(() => {});
    }
}
