import { Connection } from '../../connection';
import { StartActivityOptions } from '../../util';
import StartProcess from '../abstract/startProcess';

export default class StartActivityCommand extends StartProcess {
    constructor(
        connection: Connection,
        serial: string,
        pkg: string,
        activity: string,
        options: StartActivityOptions = {}
    ) {
        super(connection, serial, 'shell:am start', pkg, activity, options);
    }
    protected intentArgs(options: StartActivityOptions): string[] {
        return [...super.intentArgs(options)].concat(
            options.debug ? '-D' : [],
            options.wait ? '-W' : []
        );
    }
}
