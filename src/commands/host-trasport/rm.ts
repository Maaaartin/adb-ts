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
        }

        if (options.recursive) {
            args.push('-rR');
        }

        if (options.interactive) {
            args.push('-i');
        }

        if (options.verbose) {
            args.push('-v');
        }

        return args;
    }

    execute(
        serial: string,
        path: string,
        options?: RmOptions
    ): Promise<string | void> {
        return super.execute(serial, path, options).then((value) => {
            if (options?.verbose) {
                return value;
            }
        });
    }
}
