import { stringToType } from '../../util';
import { PropertyValue } from '../../util';
import TransportParseAllCommand from '../abstract/transportParseAll';

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
