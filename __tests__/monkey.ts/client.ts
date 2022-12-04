import Monkey from '../../lib/monkey/client';
import { Socket } from 'net';

describe('Monkey client tests', () => {
    it('Create monkey instance', () => {
        const monkey = new Monkey().connect(new Socket());
        expect(monkey).toBeInstanceOf(Monkey);
    });
});

describe('Events', () => {
    it('Should emit error', (done) => {
        const monkey = new Monkey().connect(new Socket());
        monkey.on('error', (err) => {
            expect(err).toBeInstanceOf(Error);
            done();
        });
        monkey.stream.emit('error', new Error('Test error'));
    });

    it('Should emit end', (done) => {
        const monkey = new Monkey().connect(new Socket());
        monkey.on('end', () => {
            done();
        });
        monkey.stream.emit('end');
    });

    it('Should emit finish', (done) => {
        const monkey = new Monkey().connect(new Socket());
        monkey.on('finish', () => {
            done();
        });
        monkey.stream.emit('finish');
    });
});
