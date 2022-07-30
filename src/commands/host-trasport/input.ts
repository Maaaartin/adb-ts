import { PrimitiveType } from '../..';
import TransportCommand from '../transport';

export default class InputCommand extends TransportCommand<void> {
    Cmd = 'shell:input ';
    protected postExecute(): Promise<void> {
        return Promise.resolve();
    }
    private buildParams(
        param1: string,
        param2: string,
        args: PrimitiveType[]
    ): void {
        this.Cmd += this.escape(param1)
            .concat(' ')
            .concat(this.escape(param2))
            .concat(args.length === 0 ? '' : ' ')
            .concat(args.map(this.escape).join(' '));
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
