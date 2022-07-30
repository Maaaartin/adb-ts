import { PrimitiveType } from '../..';
import TransportCommand from '../transport';

export default class InputCommand extends TransportCommand<void> {
    Cmd = 'shell:input ';
    protected postExecute(): Promise<void> {
        return Promise.resolve();
    }
    execute(
        serial: string,
        param1: string,
        param2: string,
        ...args: PrimitiveType[]
    ): Promise<void> {
        this.Cmd += this.escape(param1)
            .concat(' ')
            .concat(this.escape(param2))
            .concat(' ')
            .concat(args.map(this.escape).join(' '));

        return this.preExecute(serial);
    }
}
