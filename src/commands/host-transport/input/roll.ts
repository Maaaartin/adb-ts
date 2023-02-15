import { Connection } from '../../../connection';
import { InputSource } from '../../../util';
import Input from '../../abstract/input';

export default class Roll extends Input {
    constructor(
        connection: Connection,
        serial: string,
        {
            source = 'trackball',
            x,
            y
        }: {
            source?: InputSource;
            x: number;
            y: number;
        }
    ) {
        super(connection, serial, source, 'roll', false, x, y);
    }
}
