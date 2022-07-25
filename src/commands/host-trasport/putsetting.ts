import { SettingsMode, PrimitiveType } from '../..';
import TransportCommand from '../transport';

export default class PutSetting extends TransportCommand {
    execute(
        serial: string,
        mode: SettingsMode,
        name: string,
        value: PrimitiveType
    ) {
        return super
            .execute(
                serial,
                'shell:settings put',
                mode,
                name,
                this.escape(value)
            )
            .then(() => {
                return this.parser.readAll().then((value) => {
                    const valueStr = value.toString();
                    if (/failed/.test(valueStr)) {
                        throw new Error(valueStr);
                    }
                });
            });
    }
}
