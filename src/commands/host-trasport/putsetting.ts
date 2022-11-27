import { SettingsMode, PrimitiveType } from '../..';
import TransportCommand from '../transport';

export default class PutSetting extends TransportCommand<void> {
    Cmd = 'shell:settings put ';
    protected postExecute(): Promise<void> {
        return this.parser.readAll().then((value) => {
            const valueStr = value.toString();
            if (!/^\s*$/.test(valueStr)) {
                throw new Error(valueStr);
            }
        });
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
