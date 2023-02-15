import { Connection } from '../../connection';
import { StartServiceOptions, escape } from '../../util';
import StartProcess from '../abstract/startProcess';

// TODO should have abstract
export default class StartServiceCommand extends StartProcess {
    protected keepAlive = false;
    protected internalCmd = 'shell:am startservice';

    constructor(
        connection: Connection,
        serial: string,
        pkg: string,
        service: string,
        options: StartServiceOptions = {}
    ) {
        super(
            connection,
            serial,
            'shell:am startservice',
            pkg,
            service,
            options
        );
    }
}
