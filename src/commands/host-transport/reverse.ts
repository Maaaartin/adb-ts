import { Connection } from '../../connection';
import TransportParseAllCommand from '../abstract/transportParseAll';

export default class ReverseCommand extends TransportParseAllCommand<void> {
    protected Cmd: string;

    constructor(
        connection: Connection,
        serial: string,
        remote: string,
        local: string
    ) {
        super(connection, serial);
        this.Cmd = `reverse:forward:${remote};${local}`;
    }

    protected parse(value: string): Promise<void> {
        return this.validateReply(value);
    }
}
