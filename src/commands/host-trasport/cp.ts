import { CpOptions } from '../../util/types';
import FileSystemCommand from '../filesystem';

export default class CpCommand extends FileSystemCommand {
    Cmd = 'cp';
    intentArgs(options?: CpOptions): string[] {
        const args: string[] = [];
        if (!options) {
            return args;
        }

        if (options.noClobber) {
            args.push('-n');
        }
        if (options.symlink) {
            args.push('-s');
        }

        if (options.hardLink) {
            args.push('-l');
        }

        if (options.noFollowSymlinks) {
            args.push('-P');
        }
        if (options.followAllSymlinks) {
            args.push('-L');
        }
        if (options.followListedSymlinks) {
            args.push('-H');
        }
        if (options.archive) {
            args.push('-a');
        } else {
            if (options.recursive) {
                args.push('-r');
            }
            if (options.noDereference) {
                args.push('-d');
            }
            if (options.preserveTimestamps) {
                args.push('-p');
            }
        }
        if (options.preserve) {
            const params = options.preserve.all
                ? ['a']
                : Object.entries(options.preserve)
                      .filter(([key, value]) => key !== 'all' && value)
                      .map(([key]) => key[0]);
            args.push(`--preserve=${params.join('')}`);
        }
        if (options.delFirst) {
            args.push('-F');
        }
        if (options.delDest) {
            args.push('-f');
        }
        if (options.update) {
            args.push('-u');
        }

        if (options.copyToTarget) {
            args.push('-t');
        }
        return args;
    }

    execute(
        serial: string,
        paths: [string, string],
        options?: CpOptions
    ): Promise<void> {
        return super.execute(serial, paths, options);
    }
}
