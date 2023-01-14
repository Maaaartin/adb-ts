import { findMatches } from '../../util';
import { PropertyMap } from '../../util';
import TransportParseAllCommand from '../abstract/transportParseAll';

export default class ListPropertiesCommand extends TransportParseAllCommand<PropertyMap> {
    Cmd = 'shell:getprop';

    protected parse(value: string): PropertyMap {
        return findMatches(value, /^\[([\s\S]*?)\]: \[([\s\S]*?)\]?$/gm, 'map');
    }

    execute(serial: string): Promise<PropertyMap> {
        return this.preExecute(serial);
    }
}
