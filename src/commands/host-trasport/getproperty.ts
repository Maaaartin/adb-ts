import { stringToType } from '../..';
import { PrimitiveWithDate } from './../..';
import TransportParseAllCommand from '../transport-parse-all-command';

export default class GetPropertyCommand extends TransportParseAllCommand<PrimitiveWithDate> {
    Cmd = 'shell:getprop ';

    parse(value: string): PrimitiveWithDate {
        return stringToType(value);
    }
    execute(serial: string, prop: string): Promise<PrimitiveWithDate> {
        this.Cmd += prop;
        return super.preExecute(serial);
    }
}
