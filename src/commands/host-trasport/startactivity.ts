import { StartActivityOptions } from "../..";
import StartServiceCommand from "./startservice";

export default class StartActivityCommand extends StartServiceCommand {
    execute(serial: string, pkg: string, activity: string, options?: StartActivityOptions) {
        return super.execute(serial, pkg, activity, options, 'shell:am start ');
    }
}