import { PrimitiveType, stringToType } from '../..';
import TransportParseAllCommand from '../transport-parse-all-command';

export default class GetPropertyCommand extends TransportParseAllCommand {
    parse(value: string) {
        return stringToType(value);
    }
    execute(serial: string, prop: string): Promise<PrimitiveType> {
        return super.execute(serial, `shell:getprop ${prop}`);
    }
}
