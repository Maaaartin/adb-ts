import { Client } from '../../lib/client';
import { Device } from '../../lib/device';
import { AdbExecError } from '../../lib/util';
import { mockExec } from '../../mockery/execMock';

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
        mockExec(null, '', '');
        const result = await device.execShell('cmd');
        expect(result).toBe('');
    });

    it('Should execute shell command with error', async () => {
        mockExec(new Error('message'), '', '');
        await expect(() => device.execShell('cmd')).rejects.toEqual(
            new Error('message')
        );
    });

    it('Should execute shell command with std error', async () => {
        mockExec(null, '', 'message');
        try {
            await device.execShell('cmd');
        } catch (e: unknown) {
            expect(e).toEqual(
                new AdbExecError('message', '-s serial shell cmd')
            );
        }
    });

    it('Should execute shell command with std out matching error reg exp', async () => {
        mockExec(null, 'Error: message', '');
        try {
            await device.execShell('cmd');
        } catch (e: unknown) {
            expect(e).toEqual(
                new AdbExecError('Error: message', '-s serial shell cmd')
            );
        }
    });
});
