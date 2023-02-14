import TransportParseAllCommand from '../abstract/transportParseAll';
import { escape, PrimitiveType } from '../../util';
import { Connection } from '../../connection';

export default class SetProp extends TransportParseAllCommand<void> {
    protected Cmd: string;

    constructor(
        connection: Connection,
        serial: string,
        prop: string,
        value: PrimitiveType
    ) {
        super(connection, serial);
        this.Cmd = ['shell:setprop']
            .concat([prop, value].map(escape))
            .join(' ');
    }

    protected parse(value: string): void {
        if (!/^\s*$/.test(value)) {
            throw new Error(value);
        }
    }
}
