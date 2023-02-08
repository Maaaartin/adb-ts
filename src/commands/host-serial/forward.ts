import Command from '../command';

export default class ForwardCommand extends Command<void> {
    protected autoEnd = true;
    execute(serial: string, local: string, remote: string): Promise<void> {
        return this.initExecute(
            `host-serial:${serial}:forward:${local};${remote}`
        ).then(
            this.handleReply(() =>
                this.parser.readAscii(4).then(this.handleReply(undefined))
            )
        );
    }
}
