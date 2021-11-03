import { SettingsMode, SimpleType } from '../..';
import TransportCommand from '../tranport';

export default class PutSetting extends TransportCommand {
    execute(
        serial: string,
        mode: SettingsMode,
        name: string,
        value: SimpleType
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
