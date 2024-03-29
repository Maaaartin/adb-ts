import { Connection } from '../../../connection';
import { InputSource } from '../../../util';
import Input from '../../abstract/input';

export default class Text extends Input {
    constructor(
        connection: Connection,
        serial: string,
        {
            text,
            source = 'touchscreen'
        }: {
            source: InputSource | void;
            text: string;
        }
    ) {
        super(connection, serial, source, 'text', text, true);
    }
}
