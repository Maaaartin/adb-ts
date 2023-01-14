import { InputSource, PrimitiveType, escape } from '../../util';
import TransportCommand from '../abstract/transport';

export default class InputCommand extends TransportCommand<void> {
    Cmd = 'shell:input ';
    private withEscape_ = false;
    public withEscape(): this {
        this.withEscape_ = true;
        return this;
    }
    protected postExecute(): Promise<void> {
        return Promise.resolve();
    }
    private buildParams(
        source: InputSource,
        command: string,
        args: PrimitiveType[]
    ): void {
        const filterInvalid = (a: PrimitiveType): boolean =>
            typeof a !== 'undefined' && a !== '';
        const params = [source as PrimitiveType]
            .concat(command)
            .filter(filterInvalid)
            .concat(
                args
                    .filter(filterInvalid)
                    .map((a) => (this.withEscape_ ? escape(a) : a))
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
