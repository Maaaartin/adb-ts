import { PrimitiveType } from '../..';
import TransportCommand from '../transport';

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
        param1: string,
        param2: string,
        args: PrimitiveType[]
    ): void {
        const filterInvalid = (a: PrimitiveType): boolean =>
            typeof a !== 'undefined' && a !== '';
        const params = ([param1] as PrimitiveType[])
            .concat(param2)
            .filter(filterInvalid)
            .concat(
                args
                    .filter(filterInvalid)
                    .map((a) => (this.withEscape_ ? this.escape(a) : a))
            )
            .join(' ');
        this.Cmd += params;
    }
    execute(
        serial: string,
        param1: string,
        param2: string,
        ...args: PrimitiveType[]
    ): Promise<void> {
        this.buildParams(param1, param2, args);
        return this.preExecute(serial);
    }
}
