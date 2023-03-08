import { MvOptions } from '../../../util';
import FileSystemCommand from '../../abstract/fileSystem';

export default class MvCommand extends FileSystemCommand<MvOptions, string[]> {
    protected rootCmd = 'mv';
    protected argsMapper = {
        force: '-f',
        noClobber: '-n'
    };
}
