import { StartActivityOptions } from '../../util';
import StartServiceCommand from './startservice';

export default class StartActivityCommand extends StartServiceCommand {
    protected internalCmd = 'shell:am start';
    protected intentArgs(options: StartActivityOptions): string[] {
        return [...super.intentArgs(options)].concat(
            options.debug ? '-D' : [],
            options.wait ? '-W' : []
        );
    }
}
