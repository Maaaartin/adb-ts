import { Socket } from 'net';
import MonkeyMock from '../../mockery/mockMonkeyServer';
import Monkey from '../../lib/monkey/client';

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

describe('Commands', () => {
    it('Should send command', async (done) => {
        const monkeyMock = new MonkeyMock([{ status: 'OK', reply: 'value' }]);

        const port = await monkeyMock.start();
        const monkey = new Monkey();

        monkey.connect(new Socket().connect({ port, host: 'localhost' }));
        monkey.send('test', (err, value, command) => {
            monkey.end();
            monkeyMock.end();
            expect(err).toBeNull();
            expect(value).toBe('value');
            expect(command).toBe('test');
            done();
        });
    });

    it('Should make command fail', async (done) => {
        const monkeyMock = new MonkeyMock([
            { status: 'OK', reply: 'value', timeout: 300 }
        ]);

        const port = await monkeyMock.start();
        const monkey = new Monkey();

        monkey.connect(new Socket().connect({ port, host: 'localhost' }));
        monkey.send('test', (err, value, command) => {
            monkey.end();
            monkeyMock.end();
            expect(err).toEqual(new Error('Command failed'));
            expect(value).toBeNull();
            expect(command).toBe('test');
            done();
        });
    });

    it('Should emit error when replies are still coming', async (done) => {
        const monkeyMock = new MonkeyMock([{ status: 'OK', reply: 'value' }]);

        const port = await monkeyMock.start();
        const monkey = new Monkey();

        monkey.connect(new Socket().connect({ port, host: 'localhost' }));
        monkey.on('error', (err) => {
            monkeyMock.end();
            expect(err).toEqual(
                new Error('Command queue depleted, but replies still coming in')
            );
            done();
        });
        monkey.send('test', () => {});
        monkey.queue.splice(0, monkey.queue.length);
    });
});
