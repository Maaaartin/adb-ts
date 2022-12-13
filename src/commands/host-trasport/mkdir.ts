import { MkDirOptions } from '../..';
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
        if (options.verbose) {
            args.push('-v');
        }

        return args;
    }

    execute(
        serial: string,
        path: string,
        options?: MkDirOptions
    ): Promise<string | void> {
        return super.execute(serial, path, options);
    }
}
