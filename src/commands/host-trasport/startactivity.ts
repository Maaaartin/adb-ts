import { StartActivityOptions } from '../../util/types';
import StartServiceCommand from './startservice';

export default class StartActivityCommand extends StartServiceCommand {
    Cmd = 'shell:am start ';
    intentArgs(options: StartActivityOptions): string[] {
        return [...super.intentArgs(options)].concat(
            options.debug ? '-D' : [],
            options.wait ? '-W' : []
        );
    }
    execute(
        serial: string,
        pkg: string,
        activity: string,
        options?: StartActivityOptions
    ): Promise<void> {
        return super.execute(serial, pkg, activity, options);
    }
}
