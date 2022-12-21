import { stringToType } from '../../util/functions';
import { PropertyValue, SettingsMode } from '../../util/types';
import TransportParseAllCommand from '../transport-parse-all-command';

export default class GetSetting extends TransportParseAllCommand<PropertyValue> {
    Cmd = 'shell:settings get ';

    protected parse(value: string): PropertyValue {
        return stringToType(value);
    }

    execute(
        serial: string,
        mode: SettingsMode,
        name: string
    ): Promise<PropertyValue> {
        this.Cmd += [mode, this.escape(name)].join(' ');
        return this.preExecute(serial);
    }
}
