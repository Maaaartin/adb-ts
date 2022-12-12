import { RmOptions } from '../../index';
import FileSystemCommand from '../filesystem';

export default class RmCommand extends FileSystemCommand {
    Cmd = 'rm';
    intentArgs(options?: RmOptions): string[] {
        const args: string[] = [];
        if (!options) {
            return args;
        }
        if (options.force) {
            args.push('-f');
            delete options.force;
        }

        if (options.recursive) {
            args.push('-rR');
            delete options.recursive;
        }

        for (const item of Object.entries(options)) {
            args.push(item[0], this.escape(item[1]));
        }
        return args;
    }

    execute(serial: string, path: string, options?: RmOptions): Promise<void> {
        return super.execute(serial, path, options).then(() => {});
    }
}
