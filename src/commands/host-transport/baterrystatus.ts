import TransportParseAllCommand from '../transport-parse-all-command';
import Promise from 'bluebird';
import { KeyStringObject, stringToType } from '../..';

export default class BatteryStatusCommand extends TransportParseAllCommand {
  parse(value: string) {
    const features: KeyStringObject = {};
    let match;
    const line = value.split(/\n/);
    for (const item of line) {
      match = /^([\s\S]*?): ([\s\S]*?)$/gm.exec(item);
      if (match) {
        features[match[1].trim()] = stringToType(match[2]);
      }
    }
    return features;
  }

  execute(serial: string): Promise<KeyStringObject> {
    return super.execute(serial, 'shell:dumpsys battery');
  }
}
