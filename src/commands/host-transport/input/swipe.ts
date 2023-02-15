import { Connection } from '../../../connection';
import { InputDurationOptions } from '../../../util';
import Input from '../../abstract/input';

export default class Swipe extends Input {
    constructor(
        connection: Connection,
        serial: string,
        {
            x1,
            x2,
            y1,
            y2,
            options: { source = 'touchscreen', duration } = {}
        }: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            options?: InputDurationOptions;
        }
    ) {
        super(connection, serial, source, 'swipe', [
            x1,
            y1,
            x2,
            y2,
            typeof duration === 'number' ? duration : ''
        ]);
    }
}
