import TransportParseAllCommand from '../transport-parse-all-command';
import Promise from 'bluebird';
import { KeyStringObject, stringToType } from '../..';

export default class ListFeaturesCommand extends TransportParseAllCommand {
    parse(value: string) {
        const features: KeyStringObject = {};
        let match;
        const rexExp = /^feature:(.*?)(?:=(.*?))?\r?$/gm;
        while (match = rexExp.exec(value)) {
            features[match[1]] = stringToType(match[2]) || true;
        }
        return features;
    }

    execute(serial: string): Promise<KeyStringObject> {
        return super.execute(serial, 'shell:pm list features 2>/dev/null');
    }
}