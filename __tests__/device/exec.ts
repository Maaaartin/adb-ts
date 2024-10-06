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

describe('Device exec tests', () => {
    it('Should execute without error', async () => {
        let callback;
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback = callback_;
            callback_(null, '', '');
        });
        const result = await device.exec('cmd');
        expect(result).toBe('');
        expect(mockExecFile).toHaveBeenCalledWith(
            'adb',
            ['-s', 'serial', 'cmd'],
            callback
        );
    });

    it('Should execute with multiple params', async () => {
        let callback;
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback = callback_;
            callback_(null, '', '');
        });
        const result = await device.exec(['cmd', 'param']);
        expect(result).toBe('');
        expect(mockExecFile).toHaveBeenCalledWith(
            'adb',
            ['-s', 'serial', 'cmd', 'param'],
            callback
        );
    });

    it('Should execute with error', async () => {
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback_(new Error('message'), '', '');
        });
        await expect(() => device.exec('cmd')).rejects.toEqual(
            new Error('message')
        );
    });

    it('Should execute with std error', async () => {
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback_(null, '', 'message');
        });
        try {
            await device.exec('cmd');
        } catch (e: unknown) {
            expect(e).toEqual(
                new AdbExecError('message', '-s serial shell cmd')
            );
        }
    });

    it('Should execute with std out matching error reg exp', async () => {
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback_(null, 'Error: message', '');
        });
        try {
            await device.exec('cmd');
        } catch (e: unknown) {
            expect(e).toEqual(
                new AdbExecError('Error: message', '-s serial shell cmd')
            );
        }
    });
});
