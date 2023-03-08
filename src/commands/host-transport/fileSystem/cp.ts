import { Connection } from '../../../connection';
import { CpOptions, PreserveOptions } from '../../../util';
import FileSystemCommand from '../../abstract/fileSystem';

export default class CpCommand extends FileSystemCommand<CpOptions> {
    constructor(
        connection: Connection,
        serial: string,
        path: string | string[],
        options?: CpOptions
    ) {
        super(
            connection,
            serial,
            'cp',
            path,
            {
                noClobber: '-n',
                symlink: '-s',
                hardLink: '-l',
                noFollowSymlinks: '-P',
                followAllSymlinks: '-L',
                followListedSymlinks: '-H',
                archive: '-a',
                recursive: options?.archive ? '' : '-r',
                noDereference: options?.archive ? '' : '-d',
                preserveTimestamps: options?.archive ? '' : '-p',
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
            },
            options
        );
    }
}
