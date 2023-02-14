import { Connection } from '../../connection';
import { stringToType } from '../../util';
import { PropertyValue } from '../../util';
import TransportParseAllCommand from '../abstract/transportParseAll';

export default class GetPropertyCommand extends TransportParseAllCommand<PropertyValue> {
    private property: string;

    constructor(connection: Connection, serial: string, property: string) {
        super(connection, serial);
        this.property = property;
    }

    protected get Cmd(): string {
        return `shell:getprop ${this.property}`;
    }

    protected parse(value: string): PropertyValue {
        return stringToType(value);
    }
}
