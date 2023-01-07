import ExecCommand from '../abstract/exec';

export default class ShellCommand extends ExecCommand<string> {
    public Cmd = '';
    protected cast(value: string): string {
        return value;
    }

    execute(serial: string, command: string): Promise<string> {
        this.Cmd = command;
        return this.preExecute(serial);
    }
}
