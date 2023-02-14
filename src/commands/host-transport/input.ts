import { Connection } from '../../connection';
import { InputSource, PrimitiveType, escape } from '../../util';
import TransportCommand from '../abstract/transport';

// TODO make separate classes for each input method
export default class InputCommand extends TransportCommand<void> {
    protected keepAlive = false;
    protected Cmd = 'shell:input ';
    private withEscape_ = false;

    constructor(
        connection: Connection,
        serial: string,
        source: InputSource,
        command: string,
        ...args: PrimitiveType[]
    ) {
        super(connection, serial);
        this.Cmd = ['shell:input', source as string]
            .concat(
                command,
                args
                    .filter((a) => typeof a !== 'undefined' && a !== '')
                    .map((a) => (this.withEscape_ ? escape(a) : String(a)))
            )
            .join(' ');
    }
    protected postExecute(): void {}

    public withEscape(): this {
        this.withEscape_ = true;
        return this;
    }
}
