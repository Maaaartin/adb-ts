import { stringToType } from '../../util/functions';
import { PropertyValue } from '../../util/types';
import TransportParseAllCommand from '../abstract/transport-parse-all-command';

export default class GetPropertyCommand extends TransportParseAllCommand<PropertyValue> {
    Cmd = 'shell:getprop ';

    parse(value: string): PropertyValue {
        return stringToType(value);
    }
    execute(serial: string, prop: string): Promise<PropertyValue> {
        this.Cmd += prop;
        return this.preExecute(serial);
    }
}
