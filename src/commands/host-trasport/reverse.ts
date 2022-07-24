import EmptyCommand from '../empty-command';

export default class ReverseCommand extends EmptyCommand {
    Cmd = 'reverse:forward:';
    execute(serial: string, remote: string, local: string): Promise<void> {
        this.Cmd += `${remote};${local}`;
        return super.preExecute(serial);
    }
}
