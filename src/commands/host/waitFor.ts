import Command from '../command';
import { WaitForState, WaitForType } from '../../util';
import { Connection } from '../../connection';

export default class WaitFor extends Command<void> {
    protected autoEnd = false;
    private transport: WaitForType;
    private state: WaitForState;

    constructor(
        connection: Connection,
        transport: WaitForType,
        state: WaitForState
    ) {
        super(connection);
        this.transport = transport;
        this.state = state;
    }

    public async execute(): Promise<void> {
        try {
            await this.initAndValidateReply(
                `host:wait-for-${this.transport}-${this.state}`
            );
            await this.handleReply(undefined)(await this.parser.readAscii(4));
        } finally {
            this.endConnection();
        }
    }
}
