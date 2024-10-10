import { Client } from '../../lib/client';
import { Device } from '../../lib/device';
import { AdbExecError } from '../../lib/util';
import { execFile } from 'child_process';

jest.mock('child_process', () => ({
    execFile: jest.fn()
}));

const mockExecFile = execFile as unknown as jest.Mock;

const device = new Device(new Client({ noAutoStart: true }), {
    id: 'serial',
    state: 'device',
    path: 'path',
    device: 'device',
    model: 'model',
    product: 'product',
    transportId: 'transportId',
    transport: 'usb'
});

describe('Device exec shell tests', () => {
    it('Should execute shell command without error', async () => {
        let callback;
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback = callback_;
            callback_(null, '', '');
        });
        const result = await device.execShell('cmd');
        expect(result).toBe('');
        expect(mockExecFile).toHaveBeenCalledWith(
            'adb',
            ['-s', 'serial', 'shell', 'cmd'],
            callback
        );
    });

    it('Should execute shell command with multiple parameters', async () => {
        let callback;
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback = callback_;
            callback_(null, '', '');
        });
        const result = await device.execShell(['cmd', 'param']);
        expect(result).toBe('');
        expect(mockExecFile).toHaveBeenCalledWith(
            'adb',
            ['-s', 'serial', 'shell', 'cmd', 'param'],
            callback
        );
    });

    it('Should execute shell command with error', async () => {
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback_(new Error('message'), '', '');
        });
        await expect(() => device.execShell('cmd')).rejects.toEqual(
            new Error('message')
        );
    });

    it('Should execute shell command with std error', async () => {
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback_(null, '', 'message');
        });
        try {
            await device.execShell('cmd');
        } catch (e: unknown) {
            expect(e).toEqual(
                new AdbExecError('message', '-s serial shell cmd')
            );
        }
    });

    it('Should execute shell command with std out matching error reg exp', async () => {
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback_(null, 'Error: message', '');
        });
        try {
            await device.execShell('cmd');
        } catch (e: unknown) {
            expect(e).toEqual(
                new AdbExecError('Error: message', '-s serial shell cmd')
            );
        }
    });
});
