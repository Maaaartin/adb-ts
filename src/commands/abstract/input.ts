import { Connection } from '../../connection';
import { InputSource, PrimitiveType, escape } from '../../util';
import TransportCommand from './transport';

export default abstract class Input extends TransportCommand<void> {
    protected keepAlive = false;
    protected Cmd: string;

    constructor(
        connection: Connection,
        serial: string,
        source: InputSource,
        command: string,
        withEscape: boolean,
        ...args: PrimitiveType[]
    ) {
        super(connection, serial);
        this.Cmd = ['shell:input', source as string]
            .concat(
                command,
                args
                    .filter((a) => typeof a !== 'undefined' && a !== '')
                    .map((a) => (withEscape ? escape(a) : String(a)))
            )
            .join(' ');
    }
    protected postExecute(): void {}
}
