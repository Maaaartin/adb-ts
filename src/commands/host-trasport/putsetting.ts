import { PrimitiveType, SettingsMode, escape } from '../../util';
import TransportParseAllCommand from '../abstract/transportParseAll';

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
        this.Cmd += [mode, escape(name), escape(value)].join(' ');
        return this.preExecute(serial);
    }
}
