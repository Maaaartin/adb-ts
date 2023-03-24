import { MkDirOptions, escape } from '../../../util';
import FileSystemCommand from '../../abstract/fileSystem';

export default class MkDirCommand extends FileSystemCommand<
    MkDirOptions,
    string
> {
    protected rootCmd = 'mkdir';
    protected argsMapper = {
        mode: (mode: string | number): string[] => ['-m', escape(mode)],
        parent: '-p'
    };
}
