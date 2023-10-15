import { Client } from '../../lib/client';
import { AdbExecError } from '../../lib/util';
import { mockExec } from '../../mockery/execMock';

describe('Exec device tests', () => {
    it('Should execute without error', async () => {
        mockExec(null, '', '');
        const adb = new Client({ noAutoStart: true });
        const result = await adb.execDevice('serial', 'cmd');
        expect(result).toBe('');
    });

    it('Should execute with error', async () => {
        mockExec(new Error('message'), '', '');
        const adb = new Client({ noAutoStart: true });
        await expect(() => adb.execDevice('serial', 'cmd')).rejects.toEqual(
            new Error('message')
        );
    });

    it('Should execute with std error', async () => {
        mockExec(null, '', 'message');
        const adb = new Client({ noAutoStart: true });
        try {
            await adb.execDevice('serial', 'cmd');
        } catch (e: unknown) {
            expect(e).toEqual(
                new AdbExecError('message', '-s serial shell cmd')
            );
        }
    });

    it('Should execute with std out matching error reg exp', async () => {
        mockExec(null, 'Error: message', '');
        const adb = new Client({ noAutoStart: true });
        try {
            await adb.execDevice('serial', 'cmd');
        } catch (e: unknown) {
            expect(e).toEqual(
                new AdbExecError('Error: message', '-s serial shell cmd')
            );
        }
    });
});
