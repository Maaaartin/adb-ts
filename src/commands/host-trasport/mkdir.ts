import { MkDirOptions, escape } from '../../util';
import FileSystemCommand from '../abstract/fileSystem';

export default class MkDirCommand extends FileSystemCommand {
    protected Cmd = 'mkdir';
    intentArgs(options?: MkDirOptions): string[] {
        const args: string[] = [];
        if (!options) {
            return args;
        }
        if (options.mode !== undefined) {
            args.push('-m', escape(options.mode));
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
