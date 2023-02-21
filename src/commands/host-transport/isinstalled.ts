import TransportCommand from '../abstract/transport';

export default class IsInstalledCommand extends TransportCommand<boolean> {
    protected keepAlive = false;
    protected Cmd = '';
    protected postExecute(): Promise<boolean> {
        return this.parser.readAscii(8).then(
            (reply) => {
                if (reply === 'package:') {
                    return true;
                }
                throw this.parser.unexpected(reply, 'package:');
            },
            () => false
        );
    }
    execute(serial: string, pkg: string): Promise<boolean> {
        this.Cmd = `shell:pm path ${pkg} 2>/dev/null`;
        return this.preExecute(serial);
    }
}
