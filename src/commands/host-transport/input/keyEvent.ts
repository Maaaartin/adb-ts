import { Connection } from '../../../connection';
import { KeyEventOptions, NonEmptyArray } from '../../../util';
import Input from '../../abstract/input';

export default class KeyEvent extends Input {
    constructor(
        connection: Connection,
        serial: string,
        {
            options: { source = 'keyboard', variant } = {},
            code
        }: {
            options: KeyEventOptions | void;
            code: number | NonEmptyArray<number>;
        }
    ) {
        super(connection, serial, source, 'keyevent', [
            variant === 'longpress'
                ? '--longpress'
                : variant === 'doubletap'
                ? '--doubletap'
                : '',
            ...[code].flat()
        ]);
    }
}
