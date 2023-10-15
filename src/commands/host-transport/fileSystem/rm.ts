import { RmOptions } from '../../../util';
import FileSystemCommand from '../../abstract/fileSystem';

export default class RmCommand extends FileSystemCommand<RmOptions, string> {
    protected rootCmd = 'rm';
    protected argsMapper = {
        force: '-f',
        recursive: '-rR'
    };
}
