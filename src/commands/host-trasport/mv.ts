import { MvOptions } from '../../util/types';
import FileSystemCommand from '../abstract/filesystem';

export default class MvCommand extends FileSystemCommand {
    Cmd = 'mv';
    intentArgs(options?: MvOptions): string[] {
        const args: string[] = [];
        if (!options) {
            return args;
        }
        if (options.force) {
            args.push('-f');
        }

        if (options.noClobber) {
            args.push('-n');
        }
        return args;
    }

    execute(
        serial: string,
        paths: [string, string],
        options?: MvOptions
    ): Promise<void> {
        return super.execute(serial, paths, options);
    }
}
