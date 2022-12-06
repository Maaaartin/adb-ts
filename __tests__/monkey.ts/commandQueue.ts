import { Socket } from 'net';
import MonkeyMock from '../../mockery/mockMonkeyServer';
import Monkey from '../../lib/monkey/client';

describe('Monkey command queue tests', () => {
    it('Should execute without error', async (done) => {
        const monkeyMock = new MonkeyMock([
            { status: 'OK', reply: '' },
            { status: 'OK', reply: '' },
            { status: 'OK', reply: '' },
            { status: 'OK', reply: 'test' }
        ]);
        const port = await monkeyMock.start();
        const monkey = new Monkey().connect(new Socket().connect({ port }));
        monkey
            .commandQueue()
            .type('test')
            .sleep(5)
            .type('test')
            .getBuildDevice()
            .execute((err, values) => {
                expect(err).toBeNull();
                expect(values).toEqual([null, null, null, 'test']);
                monkeyMock.end();
                monkey.end();
                done();
            });
    });

    it('Should execute with error', async (done) => {
        const monkeyMock = new MonkeyMock([
            { status: 'OK', reply: '' },
            { status: 'ERROR', reply: 'error1' },
            { status: 'OK', reply: '' },
            { status: 'ERROR', reply: 'error2' }
        ]);
        const port = await monkeyMock.start();
        const monkey = new Monkey().connect(new Socket().connect({ port }));
        monkey
            .commandQueue()
            .type('test')
            .sleep(5)
            .type('test')
            .getBuildDevice()
            .execute((err, values) => {
                expect(err).toEqual(
                    new Error('sleep 5: error1, getvar build.device: error2')
                );
                expect(values).toEqual([]);
                monkeyMock.end();
                monkey.end();
                done();
            });
    });

    it('Should execute with error', async (done) => {
        const monkeyMock = new MonkeyMock([
            { status: 'OK', reply: '' },
            { status: 'ERROR', reply: 'error1' },
            { status: 'OK', reply: '' },
            { status: 'ERROR', reply: 'error2' }
        ]);
        const port = await monkeyMock.start();
        const monkey = new Monkey().connect(new Socket().connect({ port }));
        monkey
            .commandQueue()
            .type('test')
            .sleep(5)
            .type('test')
            .getBuildDevice()
            .execute((err, values) => {
                expect(err).toEqual(
                    new Error('sleep 5: error1, getvar build.device: error2')
                );
                expect(values).toEqual([]);
                monkeyMock.end();
                monkey.end();
                done();
            });
    });

    it('Should throw error on reuse', async () => {
        const monkeyMock = new MonkeyMock([]);
        const port = await monkeyMock.start();
        const monkey = new Monkey().connect(new Socket().connect({ port }));
        const queue = monkey.commandQueue();

        queue.type('test').execute(() => {});
        expect(() => queue.type('').execute(() => {})).toThrowError(
            new Error('Reuse not supported')
        );
        monkey.end(() => {
            monkeyMock.end();
        });
    });
});
