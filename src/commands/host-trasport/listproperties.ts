import { KeyStringObject, stringToType } from '../..';
import TransportParseAllCommand from '../transport-parse-all-command';
import Promise from 'bluebird';

export default class ListPropertiesCommand extends TransportParseAllCommand {
    protected parse(value: string) {
        const properties: KeyStringObject = {};
        let match;
        const regExp = /^\[([\s\S]*?)\]: \[([\s\S]*?)\]?$/gm;
        while ((match = regExp.exec(value))) {
            properties[match[1]] = stringToType(match[2]);
        }
        return properties;
    }

    execute(serial: string): Promise<KeyStringObject> {
        return super.execute(serial, 'shell:getprop');
    }
}
