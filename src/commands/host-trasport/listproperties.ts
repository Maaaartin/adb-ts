import { findMatches } from '../../util/functions';
import { PropertyMap } from '../../util/types';
import TransportParseAllCommand from '../abstract/transport-parse-all-command';

export default class ListPropertiesCommand extends TransportParseAllCommand<PropertyMap> {
    Cmd = 'shell:getprop';

    protected parse(value: string): PropertyMap {
        return findMatches(value, /^\[([\s\S]*?)\]: \[([\s\S]*?)\]?$/gm, 'map');
    }

    execute(serial: string): Promise<PropertyMap> {
        return this.preExecute(serial);
    }
}
