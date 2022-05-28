import TransportParseAllCommand from '../transport-parse-all-command';

import { PrimitiveDictionary, stringToType } from '../..';

export default class ListFeaturesCommand extends TransportParseAllCommand {
    parse(value: string) {
        const features: PrimitiveDictionary = {};
        let match;
        const regExp = /^feature:(.*?)(?:=(.*?))?\r?$/gm;
        while ((match = regExp.exec(value))) {
            features[match[1]] = stringToType(match[2]) || true;
        }
        return features;
    }

    execute(serial: string): Promise<PrimitiveDictionary> {
        return super.execute(serial, 'shell:pm list features 2>/dev/null');
    }
}
