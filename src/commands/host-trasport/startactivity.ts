import { StartActivityOptions } from '../..';
import StartServiceCommand from './startservice';

export default class StartActivityCommand extends StartServiceCommand {
    Cmd = 'shell:am start ';
    execute(
        serial: string,
        pkg: string,
        activity: string,
        options?: StartActivityOptions
    ): Promise<void> {
        return super.execute(serial, pkg, activity, options);
    }
}
