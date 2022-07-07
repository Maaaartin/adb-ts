import { CpOptions } from '../..';
import FileSystemCommand from '../filesystem';

export default class CpCommand extends FileSystemCommand {
    intentArgs(options?: CpOptions) {
        const args: string[] = [];
        if (!options) {
            return args;
        } else {
            if (options.verbose) {
                args.push('-v');
            }
            if (options.noClobber) {
                args.push('-n');
            }
            if (options.symlink) {
                args.push('-s');
            }
            if (options.interactive) {
                args.push('-i');
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
                if (options.preserve) {
                    const params = options.preserve.all
                        ? ['all']
                        : Object.entries(options.preserve)
                              .filter(([key, value]) => key !== 'all' && value)
                              .map((item) => item[0]);
                    args.push(`--preserve=${params.join(',')}`);
                }
            }
            if (options.delFirst) {
                args.push('-F');
            }
            if (options.delDest) {
                args.push('-f');
            }
            return args;
        }
    }

    get Cmd(): string {
        return 'cp';
    }

    execute(serial: string, paths: string[], options?: CpOptions) {
        return super.execute(serial, paths, options);
    }
}
