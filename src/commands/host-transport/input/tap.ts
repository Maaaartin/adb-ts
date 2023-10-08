import { Connection } from '../../../connection';
import { InputSource } from '../../../util';
import Input from '../../abstract/input';

export default class Tap extends Input {
    constructor(
        connection: Connection,
        serial: string,
        {
            source = 'touchscreen',
            x,
            y
        }: { source: InputSource | void; x: number; y: number }
    ) {
        super(connection, serial, source, 'tap', [x, y]);
    }
}
