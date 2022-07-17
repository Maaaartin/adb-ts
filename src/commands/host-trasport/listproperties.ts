import { PrimitiveDictionary, stringToType } from '../..';
import TransportParseAllCommand from '../transport-parse-all-command';

export default class ListPropertiesCommand extends TransportParseAllCommand<PrimitiveDictionary> {
    get Cmd(): string {
        return 'shell:getprop';
    }
    protected parse(value: string): PrimitiveDictionary {
        const properties: PrimitiveDictionary = {};
        let match;
        const regExp = /^\[([\s\S]*?)\]: \[([\s\S]*?)\]?$/gm;
        while ((match = regExp.exec(value))) {
            properties[match[1]] = stringToType(match[2]);
        }
        return properties;
    }

    execute(serial: string): Promise<PrimitiveDictionary> {
        return super.preExecute(serial);
    }
}
