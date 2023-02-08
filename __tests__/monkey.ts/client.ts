import { Socket } from 'net';
import { promisify } from 'util';
import MonkeyMock from '../../mockery/mockMonkeyServer';
import { Monkey } from '../../lib/monkey/client';

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
    it('Should send command', async () => {
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
        });
    });

    it('Should send multiple commands', async () => {
        const monkeyMock = new MonkeyMock([
            { status: 'OK', reply: 'value' },
            { status: 'OK', reply: 'value' }
        ]);
        const port = await monkeyMock.start();
        const monkey = new Monkey();

        monkey.connect(new Socket().connect({ port, host: 'localhost' }));

        const commands = ['test1', 'test2'];
        monkey.send(commands, (err, value, command) => {
            const cmd = commands.shift();
            if (commands.length === 0) {
                monkey.end();
                monkeyMock.end();
            }
            expect(err).toBeNull();
            expect(value).toBe('value');
            expect(command).toBe(cmd);
        });
    });

    it('Should make command fail', async () => {
        const monkeyMock = new MonkeyMock([]);

        const port = await monkeyMock.start();
        const monkey = new Monkey();

        monkey.connect(new Socket().connect({ port, host: 'localhost' }));
        const [err, value, command] = await promisify<any[]>((cb) => {
            monkey.send('test', (err, value, command) => {
                return cb(null, [err, value, command]);
            });
        })();
        monkey.end();
        monkeyMock.end();
        expect(err).toEqual(new Error('Command failed'));
        expect(value).toBeNull();
        expect(command).toBe('test');
    });

    it('Should emit error when replies are still coming', async () => {
        const monkeyMock = new MonkeyMock([{ status: 'OK', reply: 'value' }]);

        const port = await monkeyMock.start();
        const monkey = new Monkey();

        monkey.connect(new Socket().connect({ port, host: 'localhost' }));
        monkey.on('error', (err) => {
            monkeyMock.end();
            monkey.end();
            expect(err).toEqual(
                new Error('Command queue depleted, but replies still coming in')
            );
        });
        monkey.send('test', () => {});
        monkey.queue.splice(0, monkey.queue.length);
    });
});
