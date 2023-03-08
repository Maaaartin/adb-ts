import { CpOptions, PreserveOptions } from '../../../util';
import FileSystemCommand from '../../abstract/fileSystem';

export default class CpCommand extends FileSystemCommand<CpOptions, string[]> {
    protected rootCmd = 'cp';
    protected argsMapper = {
        noClobber: '-n',
        symlink: '-s',
        hardLink: '-l',
        noFollowSymlinks: '-P',
        followAllSymlinks: '-L',
        followListedSymlinks: '-H',
        archive: '-a',
        recursive: (_value: boolean, options: CpOptions): string =>
            options.archive ? '' : '-r',
        noDereference: (_value: boolean, options: CpOptions): string =>
            options.archive ? '' : '-d',
        preserveTimestamps: (_value: boolean, options: CpOptions): string =>
            options.archive ? '' : '-p',
        preserve(value: PreserveOptions): string {
            const params = value.all
                ? ['a']
                : Object.entries(value)
                      .filter(([key, value]) => key !== 'all' && value)
                      .map(([key]) => key[0]);
            return `--preserve=${params.join('')}`;
        },
        delFirst: '-F',
        delDest: '-f',
        update: '-u',
        copyToTarget: '-t'
    };
}
