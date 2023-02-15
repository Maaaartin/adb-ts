import { Connection } from '../../connection';
import { InputSource } from '../../util';
import Input from '../abstract/input';

export default class Text extends Input {
    constructor(
        connection: Connection,
        serial: string,
        source: InputSource,
        text: string
    ) {
        super(connection, serial, source, 'text', true, text);
    }
}
