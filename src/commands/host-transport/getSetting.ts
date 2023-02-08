import { PropertyValue, SettingsMode, escape, stringToType } from '../../util';
import TransportParseAllCommand from '../abstract/transportParseAll';

export default class GetSetting extends TransportParseAllCommand<PropertyValue> {
    protected Cmd = 'shell:settings get ';

    protected parse(value: string): PropertyValue {
        return stringToType(value);
    }

    execute(
        serial: string,
        mode: SettingsMode,
        name: string
    ): Promise<PropertyValue> {
        this.Cmd += [mode, escape(name)].join(' ');
        return this.preExecute(serial);
    }
}
