import { KeyStringObject, SettingsMode, stringToType } from '../..';
import TransportParseAllCommand from '../transport-parse-all-command';
import Promise from 'bluebird';

export default class ListSettingsCommand extends TransportParseAllCommand {
    parse(value) {
        const settings: KeyStringObject = {};
        let match;
        const rexExp = /^([\s\S]*?)=([\s\S]*?)\n/gm;
        while (match = rexExp.exec(value)) {
            settings[match[1]] = stringToType(match[2] === '' ? undefined : match[2]);
        }
        return settings;
    }
    execute(serial: string, mode: SettingsMode): Promise<KeyStringObject[]> {
        return super.execute(serial, `shell:settings list ${mode}`)
    }
}