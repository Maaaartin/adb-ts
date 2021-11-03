import Promise from 'bluebird';
import { SimpleType, stringToType } from '../..';
import TransportParseAllCommand from '../transport-parse-all-command';

export default class GetPropertyCommand extends TransportParseAllCommand {
    parse(value: string) {
        return stringToType(value);
    }
    execute(serial: string, prop: string): Promise<SimpleType> {
        return super.execute(serial, `shell:getprop ${prop}`);
    }
}
