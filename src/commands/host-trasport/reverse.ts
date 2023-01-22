import TransportParseAllCommand from '../abstract/transportParseAll';

export default class ReverseCommand extends TransportParseAllCommand<void> {
    protected parse(value: string): Promise<void> {
        return this.handleReply(undefined)(value);
    }
    protected Cmd = 'reverse:forward:';
    execute(serial: string, remote: string, local: string): Promise<void> {
        this.Cmd += `${remote};${local}`;
        return this.preExecute(serial);
    }
}
