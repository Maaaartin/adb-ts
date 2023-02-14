import { MvOptions } from '../../util';
import FileSystemCommand from '../abstract/fileSystem';

export default class MvCommand extends FileSystemCommand {
    protected rawCmd = 'mv';
    protected intentArgs(options?: MvOptions): string[] {
        const args: string[] = [];
        if (!options) {
            return args;
        }
        if (options.force) {
            args.push('-f');
        }

        if (options.noClobber) {
            args.push('-n');
        }
        return args;
    }
}
