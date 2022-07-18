import { MkDirOptions } from '../..';
import FileSystemCommand from '../filesystem';

export default class MkDirCommand extends FileSystemCommand {
    intentArgs(options?: MkDirOptions) {
        const args: string[] = [];
        if (!options) {
            return args;
        }
        if (options.mode !== void 0) {
            args.push('-m', options.mode.toString());
        }
        if (options.parent) {
            args.push('-p');
        }

        return args;
    }

    get Cmd(): string {
        return 'mkdir';
    }

    execute(serial: string, path: string, options?: MkDirOptions) {
        return super.execute(serial, path, options);
    }
}
