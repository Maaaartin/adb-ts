import { Connection } from '../../connection';
import { findMatches } from '../../util';
import { PropertyMap, SettingsMode } from '../../util';
import TransportParseAllCommand from '../abstract/transportParseAll';

export default class ListSettingsCommand extends TransportParseAllCommand<PropertyMap> {
    protected Cmd: string;

    constructor(connection: Connection, serial: string, mode: SettingsMode) {
        super(connection, serial);
        this.Cmd = `shell:settings list ${mode}`;
    }

    protected parse(value: string): PropertyMap {
        return findMatches(value, /^([\s\S]*?)=([\s\S]*?)$/gm, 'map');
    }
}
