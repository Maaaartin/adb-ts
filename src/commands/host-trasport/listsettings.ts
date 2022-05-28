import { PrimitiveDictionary, SettingsMode, stringToType } from '../..';

import TransportParseAllCommand from '../transport-parse-all-command';

export default class ListSettingsCommand extends TransportParseAllCommand {
    parse(value: string) {
        const settings: PrimitiveDictionary = {};
        let match;
        const regExp = /^([\s\S]*?)=([\s\S]*?)\n/gm;
        while ((match = regExp.exec(value))) {
            settings[match[1]] = stringToType(match[2]);
        }
        return settings;
    }
    execute(serial: string, mode: SettingsMode): Promise<PrimitiveDictionary> {
        return super.execute(serial, `shell:settings list ${mode}`);
    }
}
