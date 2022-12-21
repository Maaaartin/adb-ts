import { MkDirOptions } from '../../util/types';
import FileSystemCommand from '../filesystem';

export default class MkDirCommand extends FileSystemCommand {
    Cmd = 'mkdir';
    intentArgs(options?: MkDirOptions): string[] {
        const args: string[] = [];
        if (!options) {
            return args;
        }
        if (options.mode !== undefined) {
            args.push('-m', this.escape(options.mode));
        }
        if (options.parent) {
            args.push('-p');
        }

        return args;
    }

    execute(
        serial: string,
        path: string,
        options?: MkDirOptions
    ): Promise<void> {
        return super.execute(serial, path, options);
    }
}
