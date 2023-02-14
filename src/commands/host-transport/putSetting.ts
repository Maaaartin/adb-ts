import { Connection } from '../../connection';
import { PrimitiveType, SettingsMode, escape } from '../../util';
import TransportParseAllCommand from '../abstract/transportParseAll';

export default class PutSetting extends TransportParseAllCommand<void> {
    protected Cmd: string;

    constructor(
        connection: Connection,
        serial: string,
        mode: SettingsMode,
        name: string,
        value: PrimitiveType
    ) {
        super(connection, serial);
        this.Cmd = [
            'shell:settings put',
            mode,
            escape(name),
            escape(value)
        ].join(' ');
    }

    protected parse(value: string): void {
        if (!/^\s*$/.test(value)) {
            throw new Error(value);
        }
    }
}
