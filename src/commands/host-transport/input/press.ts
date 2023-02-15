import { Connection } from '../../../connection';
import { InputSource } from '../../../util';
import Input from '../../abstract/input';

export default class Press extends Input {
    constructor(
        connection: Connection,
        serial: string,
        source = 'trackball' as InputSource
    ) {
        super(connection, serial, source, 'press', false);
    }
}
