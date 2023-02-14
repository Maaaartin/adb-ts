import { Connection } from '../../connection';
import { PropertyValue, SettingsMode, escape, stringToType } from '../../util';
import TransportParseAllCommand from '../abstract/transportParseAll';

export default class GetSetting extends TransportParseAllCommand<PropertyValue> {
    protected Cmd: string;

    constructor(
        connection: Connection,
        serial: string,
        mode: SettingsMode,
        name: string
    ) {
        super(connection, serial);
        this.Cmd = ['shell:settings get', mode, escape(name)].join(' ');
    }

    protected parse(value: string): PropertyValue {
        return stringToType(value);
    }
}
