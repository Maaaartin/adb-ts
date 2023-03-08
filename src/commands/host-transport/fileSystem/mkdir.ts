import { MkDirOptions, escape } from '../../../util';
import FileSystemCommand from '../../abstract/fileSystem';

// TODO check force option
export default class MkDirCommand extends FileSystemCommand<
    MkDirOptions,
    string
> {
    protected rootCmd = 'mkdir';
    protected argsMapper = {
        mode: (mode: string | number): string[] => ['-m', escape(mode)],
        parent: '-p',
        force: '-f'
    };
}
