import { Client } from '../../lib/client';
import { mockExec } from '../../mockery/execMock';

describe('Client constructor tests', () => {
    it('Create Adb client instance', () => {
        const client = new Client();
        expect(client['options']).toEqual({
            port: 5037,
            host: 'localhost',
            bin: 'adb',
            noAutoStart: false
        });
    });

    it('Create Adb client instance with options', () => {
        const client = new Client({ bin: undefined, port: 5036 });
        expect(client['options']).toEqual({
            port: 5036,
            host: 'localhost',
            bin: 'adb',
            noAutoStart: false
        });
    });
});

describe('Start server tests', () => {
    it('Start adb server', async () => {
        mockExec(null);
        const client = new Client();
        await expect(client.startServer()).resolves.toBeUndefined();
    });

    it('Start adb server error', async () => {
        try {
            mockExec(new Error('message'));
            const client = new Client();
            await client.startServer();
        } catch (e: unknown) {
            expect(e).toEqual(new Error('message'));
        }
    });

    it('Start adb server callback overload', () => {
        mockExec(null);
        const client = new Client();
        client.startServer((err) => {
            expect(err).toBeNull();
        });
    });

    it('Start adb server callback overload error', () => {
        mockExec(new Error('message'));
        const client = new Client();
        client.startServer((err) => {
            expect(err).toBeInstanceOf(Error);
        });
    });
});
