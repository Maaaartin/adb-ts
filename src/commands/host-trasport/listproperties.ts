import { PrimitiveDictionary, stringToType } from '../..';
import TransportParseAllCommand from '../transport-parse-all-command';

export default class ListPropertiesCommand extends TransportParseAllCommand {
    protected parse(value: string) {
        const properties: PrimitiveDictionary = {};
        let match;
        const regExp = /^\[([\s\S]*?)\]: \[([\s\S]*?)\]?$/gm;
        while ((match = regExp.exec(value))) {
            properties[match[1]] = stringToType(match[2]);
        }
        return properties;
    }

    execute(serial: string): Promise<PrimitiveDictionary> {
        return super.execute(serial, 'shell:getprop');
    }
}
