import { InputSource, PrimitiveType, escape } from '../../util';
import TransportCommand from '../abstract/transport';

export default class InputCommand extends TransportCommand<void> {
    Cmd = 'shell:input ';
    private withEscape_ = false;
    public withEscape(): this {
        this.withEscape_ = true;
        return this;
    }
    protected postExecute(): void {}
    private buildParams(
        source: InputSource,
        command: string,
        args: PrimitiveType[]
    ): void {
        const params = [source as string]
            .concat(
                command,
                args
                    .filter((a) => typeof a !== 'undefined' && a !== '')
                    .map((a) => (this.withEscape_ ? escape(a) : String(a)))
            )
            .join(' ');
        this.Cmd += params;
    }
    execute(
        serial: string,
        source: InputSource,
        command: string,
        ...args: PrimitiveType[]
    ): Promise<void> {
        this.buildParams(source, command, args);
        return this.preExecute(serial);
    }
}
