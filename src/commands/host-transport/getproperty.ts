import { Connection } from '../../connection';
import { stringToType } from '../../util';
import { PropertyValue } from '../../util';
import TransportParseAllCommand from '../abstract/transportParseAll';

export default class GetPropertyCommand extends TransportParseAllCommand<PropertyValue> {
    protected Cmd: string;

    constructor(connection: Connection, serial: string, property: string) {
        super(connection, serial);
        this.Cmd = `shell:getprop ${property}`;
    }

    protected parse(value: string): PropertyValue {
        return stringToType(value);
    }
}
