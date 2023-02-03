import { StartActivityOptions } from '../../util';
import StartServiceCommand from './startService';

export default class StartActivityCommand extends StartServiceCommand {
    protected Cmd = 'shell:am start ';
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
