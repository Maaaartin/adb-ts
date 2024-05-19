import { Client } from '../../lib/client';
import { mockExec } from '../../mockery/execMock';

describe('Client constructor tests', () => {
    it('Create Adb client instance', () => {
        const client = new Client();
        expect(client['options']).toEqual({
            port: 5037,
            host: '127.0.0.1',
            bin: 'adb',
            noAutoStart: false
        });
    });

    it('Create Adb client instance with options', () => {
        const client = new Client({ bin: undefined, port: 5036 });
        expect(client['options']).toEqual({
            port: 5036,
            host: '127.0.0.1',
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
});
