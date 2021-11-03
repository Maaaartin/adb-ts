import moment from 'moment';
import { MvOptions, TouchOptions } from '../..';
import FileSystemCommand from '../filesystem';

export default class MvCommand extends FileSystemCommand {
    intentArgs(options?: MvOptions) {
        const args: string[] = [];
        if (!options) {
            return args;
        } else {
            if (options.force) {
                args.push('-f');
            }
            if (options.interactive) {
                args.push('-i');
            }
            if (options.verbose) {
                args.push('-v');
            }
            if (options.noClobber) {
                args.push('-n');
            }
            return args;
        }
    }

    getCmd() {
        return 'mv';
    }

    execute(serial: string, paths: string[], options?: MvOptions) {
        return super.execute(serial, paths, options);
    }
}
