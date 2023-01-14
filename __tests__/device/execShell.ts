import { AdbClient } from '../../lib/client';
import { AdbDevice } from '../../lib/device';
import { AdbExecError } from '../../lib/util';
import { mockExec } from '../../mockery/execMock';

const device = new AdbDevice(new AdbClient({ noAutoStart: true }), {
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
        mockExec(null, '', '');
        const result = await device.execShell('cmd');
        expect(result).toBe('');
    });

    it('Should execute shell command with error', async () => {
        mockExec(new Error('message'), '', '');
        await expect(() => device.execShell('cmd')).rejects.toThrowError(
            new Error('message')
        );
    });

    it('Should execute shell command with std error', async () => {
        mockExec(null, '', 'message');
        try {
            await device.execShell('cmd');
        } catch (e: any) {
            expect(e.message).toBe('message');
            expect(e.command).toBe('-s serial shell cmd');
            expect(e).toBeInstanceOf(AdbExecError);
        }
    });

    it('Should execute shell command with std out matching error reg exp', async () => {
        mockExec(null, 'Error: message', '');
        try {
            await device.execShell('cmd');
        } catch (e: any) {
            expect(e.message).toBe('Error: message');
            expect(e.command).toBe('-s serial shell cmd');
            expect(e).toBeInstanceOf(AdbExecError);
        }
    });
});
