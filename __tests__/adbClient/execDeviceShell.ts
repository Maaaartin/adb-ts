import { Client } from '../../lib/client';
import { AdbExecError } from '../../lib/util';
import { execFile } from 'child_process';

jest.mock('child_process', () => ({
    execFile: jest.fn()
}));

const mockExecFile = execFile as unknown as jest.Mock;

describe('Exec device shell tests', () => {
    it('Should execute without error', async () => {
        let callback;
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback = callback_;
            callback_(null, '', '');
        });
        const adb = new Client({ noAutoStart: true });
        const result = await adb.execDeviceShell('serial', 'cmd');
        expect(result).toBe('');
        expect(mockExecFile).toHaveBeenCalledWith(
            'adb',
            ['-s', 'serial', 'shell', 'cmd'],
            callback
        );
    });

    it('Should execute with multiple params', async () => {
        let callback;
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback = callback_;
            callback_(null, '', '');
        });
        const adb = new Client({ noAutoStart: true });
        const result = await adb.execDeviceShell('serial', ['cmd', 'param']);
        expect(result).toBe('');
        expect(mockExecFile).toHaveBeenCalledWith(
            'adb',
            ['-s', 'serial', 'shell', 'cmd', 'param'],
            callback
        );
    });

    it('Should execute with error', async () => {
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback_(new Error('message'), '', '');
        });
        const adb = new Client({ noAutoStart: true });
        await expect(() =>
            adb.execDeviceShell('serial', 'cmd')
        ).rejects.toEqual(new Error('message'));
    });

    it('Should execute with std error', async () => {
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback_(null, '', 'message');
        });
        const adb = new Client({ noAutoStart: true });
        try {
            await adb.execDeviceShell('serial', 'cmd');
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
        const adb = new Client({ noAutoStart: true });
        try {
            await adb.execDeviceShell('serial', 'cmd');
        } catch (e: unknown) {
            expect(e).toEqual(
                new AdbExecError('Error: message', '-s serial shell cmd')
            );
        }
    });
});
