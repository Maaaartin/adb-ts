import { Client } from '../../lib/client';
import { execFile } from 'child_process';

jest.mock('child_process', () => ({
    execFile: jest.fn()
}));

const mockExecFile = execFile as unknown as jest.Mock;

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
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback_(null, '', '');
        });
        const client = new Client();
        await expect(client.startServer()).resolves.toBeUndefined();
    });
});
