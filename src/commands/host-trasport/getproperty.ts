import { PrimitiveType, stringToType } from '../..';
import TransportParseAllCommand from '../transport-parse-all-command';

export default class GetPropertyCommand extends TransportParseAllCommand<PrimitiveType> {
    private cmd = 'shell:getprop ';
    get Cmd(): string {
        return this.cmd;
    }
    private set Cmd(value: string) {
        this.cmd = value;
    }

    parse(value: string): PrimitiveType {
        return stringToType(value);
    }
    execute(serial: string, prop: string): Promise<PrimitiveType> {
        this.Cmd += prop;
        return super.preExecute(serial);
    }
}
