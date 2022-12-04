import { DuplexMock } from 'stream-mock';
import Monkey from '../../lib/monkey/client';
import { Socket } from 'net';

describe('Monkey client tests', () => {
    it('Create monkey instance', () => {
        const monkey = new Monkey().connect(
            new DuplexMock() as unknown as Socket
        );
        expect(monkey).toBeInstanceOf(Monkey);
    });
});
