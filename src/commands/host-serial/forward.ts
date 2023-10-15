import { Connection } from '../../connection';
import Command from '../command';

export default class ForwardCommand extends Command<void> {
    protected autoEnd = true;
    private command: string;

    constructor(
        connection: Connection,
        serial: string,
        local: string,
        remote: string
    ) {
        super(connection);
        this.command = `host-serial:${serial}:forward:${local};${remote}`;
    }

    public async execute(): Promise<void> {
        await this.initAndValidateReply(this.command);
        await this.readAndValidateReply();
    }
}
