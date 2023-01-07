import { PrimitiveType, SettingsMode } from '../../util/types';
import TransportParseAllCommand from '../abstract/transport-parse-all-command';

export default class PutSetting extends TransportParseAllCommand<void> {
    Cmd = 'shell:settings put ';
    protected parse(value: string): void {
        if (!/^\s*$/.test(value)) {
            throw new Error(value);
        }
    }

    execute(
        serial: string,
        mode: SettingsMode,
        name: string,
        value: PrimitiveType
    ): Promise<void> {
        this.Cmd += [mode, this.escape(name), this.escape(value)].join(' ');
        return this.preExecute(serial);
    }
}
