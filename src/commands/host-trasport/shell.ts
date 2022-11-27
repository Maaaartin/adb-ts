import TransportCommand from '../transport';

export default class ShellCommand extends TransportCommand<string> {
    Cmd = 'shell:';
    protected postExecute(): Promise<string> {
        return this.parser.readAll().then((value) => {
            return value.toString();
        });
    }

    execute(serial: string, command: string | string[]): Promise<string> {
        this.Cmd += [command].flat().join(' ');
        return this.preExecute(serial);
    }
}
